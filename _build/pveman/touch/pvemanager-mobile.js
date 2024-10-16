/**
 * Utility class for setting/reading values from browser cookies.
 * Values can be written using the {@link #set} method.
 * Values can be read using the {@link #get} method.
 * A cookie can be invalidated on the client machine using the {@link #clear} method.
 */
Ext.define('Ext.util.Cookies', {
    singleton: true,
    
    /**
     * Creates a cookie with the specified name and value. Additional settings for the cookie may be optionally specified
     * (for example: expiration, access restriction, SSL).
     * @param {String} name The name of the cookie to set.
     * @param {Object} value The value to set for the cookie.
     * @param {Object} [expires] Specify an expiration date the cookie is to persist until. Note that the specified Date
     * object will be converted to Greenwich Mean Time (GMT).
     * @param {String} [path] Setting a path on the cookie restricts access to pages that match that path. Defaults to all
     * pages ('/').
     * @param {String} [domain] Setting a domain restricts access to pages on a given domain (typically used to allow
     * cookie access across subdomains). For example, "sencha.com" will create a cookie that can be accessed from any
     * subdomain of sencha.com, including www.sencha.com, support.sencha.com, etc.
     * @param {Boolean} [secure] Specify true to indicate that the cookie should only be accessible via SSL on a page
     * using the HTTPS protocol. Defaults to false. Note that this will only work if the page calling this code uses the
     * HTTPS protocol, otherwise the cookie will be created with default options.
     */
    set : function(name, value){
        var argv = arguments,
            argc = arguments.length,
            expires = (argc > 2) ? argv[2] : null,
            path = (argc > 3) ? argv[3] : '/',
            domain = (argc > 4) ? argv[4] : null,
            secure = (argc > 5) ? argv[5] : false;
            
        document.cookie = name + "=" +
            escape(value) +
            ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) +
            ((path === null) ? "" : ("; path=" + path)) +
            ((domain === null) ? "" : ("; domain=" + domain)) +
            ((secure === true) ? "; secure" : "");
    },

    /**
     * Retrieves cookies that are accessible by the current page. If a cookie does not exist, `get()` returns null. The
     * following example retrieves the cookie called "valid" and stores the String value in the variable validStatus.
     *
     *     var validStatus = Ext.util.Cookies.get("valid");
     *
     * @param {String} name The name of the cookie to get
     * @return {Object} Returns the cookie value for the specified name;
     * null if the cookie name does not exist.
     */
    get : function(name) {
        var parts = document.cookie.split('; '),
            len = parts.length,
            item, i, ret;

        // In modern browsers, a cookie with an empty string will be stored:
        // MyName=
        // In older versions of IE, it will be stored as:
        // MyName
        // So here we iterate over all the parts in an attempt to match the key.
        for (i = 0; i < len; ++i) {
            item = parts[i].split('=');
            if (item[0] === name) {
                ret = item[1];
                return ret ? unescape(ret) : '';
            }
        }
        return null;
    },

    /**
     * Removes a cookie with the provided name from the browser
     * if found by setting its expiration date to sometime in the past.
     * @param {String} name The name of the cookie to remove
     * @param {String} [path] The path for the cookie.
     * This must be included if you included a path while setting the cookie.
     */
    clear : function(name, path){
        if (this.get(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=' + path;
        }
    }
});
Ext.ns('PVE');

console.log("Starting Proxmox VE Manager");

Ext.Ajax.defaultHeaders = {
    'Accept': 'application/json',
};

Ext.define('PVE.Utils', {
 utilities: {

    // this singleton contains miscellaneous utilities

    toolkit: undefined, // (extjs|touch), set inside Toolkit.js

    bus_match: /^(ide|sata|virtio|scsi)(\d+)$/,

    log_severity_hash: {
	0: "panic",
	1: "alert",
	2: "critical",
	3: "error",
	4: "warning",
	5: "notice",
	6: "info",
	7: "debug",
    },

    support_level_hash: {
	'c': gettext('Community'),
	'b': gettext('Basic'),
	's': gettext('Standard'),
	'p': gettext('Premium'),
    },

    noSubKeyHtml: 'You do not have a valid subscription for this server. Please visit '
      +'<a target="_blank" href="https://www.proxmox.com/products/proxmox-ve/subscription-service-plans">'
      +'www.proxmox.com</a> to get a list of available options.',

    kvm_ostypes: {
	'Linux': [
	    { desc: '6.x - 2.6 Kernel', val: 'l26' },
	    { desc: '2.4 Kernel', val: 'l24' },
	],
	'Microsoft Windows': [
	    { desc: '11/2022', val: 'win11' },
	    { desc: '10/2016/2019', val: 'win10' },
	    { desc: '8.x/2012/2012r2', val: 'win8' },
	    { desc: '7/2008r2', val: 'win7' },
	    { desc: 'Vista/2008', val: 'w2k8' },
	    { desc: 'XP/2003', val: 'wxp' },
	    { desc: '2000', val: 'w2k' },
	],
	'Solaris Kernel': [
	    { desc: '-', val: 'solaris' },
	],
	'Other': [
	    { desc: '-', val: 'other' },
	],
    },

    is_windows: function(ostype) {
	for (let entry of PVE.Utils.kvm_ostypes['Microsoft Windows']) {
	    if (entry.val === ostype) {
		return true;
	    }
	}
	return false;
    },

    get_health_icon: function(state, circle) {
	if (circle === undefined) {
	    circle = false;
	}

	if (state === undefined) {
	    state = 'uknown';
	}

	var icon = 'faded fa-question';
	switch (state) {
	    case 'good':
		icon = 'good fa-check';
		break;
	    case 'upgrade':
		icon = 'warning fa-upload';
		break;
	    case 'old':
		icon = 'warning fa-refresh';
		break;
	    case 'warning':
		icon = 'warning fa-exclamation';
		break;
	    case 'critical':
		icon = 'critical fa-times';
		break;
	    default: break;
	}

	if (circle) {
	    icon += '-circle';
	}

	return icon;
    },

    parse_ceph_version: function(service) {
	if (service.ceph_version_short) {
	    return service.ceph_version_short;
	}

	if (service.ceph_version) {
	    var match = service.ceph_version.match(/version (\d+(\.\d+)*)/);
	    if (match) {
		return match[1];
	    }
	}

	return undefined;
    },

    compare_ceph_versions: function(a, b) {
	let avers = [];
	let bvers = [];

	if (a === b) {
	    return 0;
	}

	if (Ext.isArray(a)) {
	    avers = a.slice(); // copy array
	} else {
	    avers = a.toString().split('.');
	}

	if (Ext.isArray(b)) {
	    bvers = b.slice(); // copy array
	} else {
	    bvers = b.toString().split('.');
	}

	for (;;) {
	    let av = avers.shift();
	    let bv = bvers.shift();

	    if (av === undefined && bv === undefined) {
		return 0;
	    } else if (av === undefined) {
		return -1;
	    } else if (bv === undefined) {
		return 1;
	    } else {
		let diff = parseInt(av, 10) - parseInt(bv, 10);
		if (diff !== 0) return diff;
		// else we need to look at the next parts
	    }
	}
    },

    get_ceph_icon_html: function(health, fw) {
	var state = PVE.Utils.map_ceph_health[health];
	var cls = PVE.Utils.get_health_icon(state);
	if (fw) {
	    cls += ' fa-fw';
	}
	return "<i class='fa " + cls + "'></i> ";
    },

    map_ceph_health: {
	'HEALTH_OK': 'good',
	'HEALTH_UPGRADE': 'upgrade',
	'HEALTH_OLD': 'old',
	'HEALTH_WARN': 'warning',
	'HEALTH_ERR': 'critical',
    },

    render_sdn_pending: function(rec, value, key, index) {
	if (rec.data.state === undefined || rec.data.state === null) {
	    return value;
	}

	if (rec.data.state === 'deleted') {
	    if (value === undefined) {
		return ' ';
	    } else {
		return '<div style="text-decoration: line-through;">'+ value +'</div>';
	    }
	} else if (rec.data.pending[key] !== undefined && rec.data.pending[key] !== null) {
	    if (rec.data.pending[key] === 'deleted') {
		return ' ';
	    } else {
		return rec.data.pending[key];
	    }
	}
	return value;
    },

    render_sdn_pending_state: function(rec, value) {
	if (value === undefined || value === null) {
	    return ' ';
	}

	let icon = `<i class="fa fa-fw fa-refresh warning"></i>`;

	if (value === 'deleted') {
	    return '<span>' + icon + value + '</span>';
	}

	let tip = gettext('Pending Changes') + ': <br>';

	for (const [key, keyvalue] of Object.entries(rec.data.pending)) {
	    if ((rec.data[key] !== undefined && rec.data.pending[key] !== rec.data[key]) ||
		rec.data[key] === undefined
	    ) {
		tip += `${key}: ${keyvalue} <br>`;
	    }
	}
	return '<span data-qtip="' + tip + '">'+ icon + value + '</span>';
    },

    render_ceph_health: function(healthObj) {
	var state = {
	    iconCls: PVE.Utils.get_health_icon(),
	    text: '',
	};

	if (!healthObj || !healthObj.status) {
	    return state;
	}

	var health = PVE.Utils.map_ceph_health[healthObj.status];

	state.iconCls = PVE.Utils.get_health_icon(health, true);
	state.text = healthObj.status;

	return state;
    },

    render_zfs_health: function(value) {
	if (typeof value === 'undefined') {
	    return "";
	}
	var iconCls = 'question-circle';
	switch (value) {
	    case 'AVAIL':
	    case 'ONLINE':
		iconCls = 'check-circle good';
		break;
	    case 'REMOVED':
	    case 'DEGRADED':
		iconCls = 'exclamation-circle warning';
		break;
	    case 'UNAVAIL':
	    case 'FAULTED':
	    case 'OFFLINE':
		iconCls = 'times-circle critical';
		break;
	    default: //unknown
	}

	return '<i class="fa fa-' + iconCls + '"></i> ' + value;
    },

    render_pbs_fingerprint: fp => fp.substring(0, 23),

    render_backup_encryption: function(v, meta, record) {
	if (!v) {
	    return gettext('No');
	}

	let tip = '';
	if (v.match(/^[a-fA-F0-9]{2}:/)) { // fingerprint
	    tip = `Key fingerprint ${PVE.Utils.render_pbs_fingerprint(v)}`;
	}
	let icon = `<i class="fa fa-fw fa-lock good"></i>`;
	return `<span data-qtip="${tip}">${icon} ${gettext('Encrypted')}</span>`;
    },

    render_backup_verification: function(v, meta, record) {
	let i = (cls, txt) => `<i class="fa fa-fw fa-${cls}"></i> ${txt}`;
	if (v === undefined || v === null) {
	    return i('question-circle-o warning', gettext('None'));
	}
	let tip = "";
	let txt = gettext('Failed');
	let iconCls = 'times critical';
	if (v.state === 'ok') {
	    txt = gettext('OK');
	    iconCls = 'check good';
	    let now = Date.now() / 1000;
	    let task = Proxmox.Utils.parse_task_upid(v.upid);
	    let verify_time = Proxmox.Utils.render_timestamp(task.starttime);
	    tip = `Last verify task started on ${verify_time}`;
	    if (now - v.starttime > 30 * 24 * 60 * 60) {
		tip = `Last verify task over 30 days ago: ${verify_time}`;
		iconCls = 'check warning';
	    }
	}
	return `<span data-qtip="${tip}"> ${i(iconCls, txt)} </span>`;
    },

    render_backup_status: function(value, meta, record) {
	if (typeof value === 'undefined') {
	    return "";
	}

	let iconCls = 'check-circle good';
	let text = gettext('Yes');

	if (!PVE.Parser.parseBoolean(value.toString())) {
	    iconCls = 'times-circle critical';

	    text = gettext('No');

	    let reason = record.get('reason');
	    if (typeof reason !== 'undefined') {
		if (reason in PVE.Utils.backup_reasons_table) {
		    reason = PVE.Utils.backup_reasons_table[record.get('reason')];
		}
		text = `${text} - ${reason}`;
	    }
	}

	return `<i class="fa fa-${iconCls}"></i> ${text}`;
    },

    render_backup_days_of_week: function(val) {
	var dows = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	var selected = [];
	var cur = -1;
	val.split(',').forEach(function(day) {
	    cur++;
	    var dow = (dows.indexOf(day)+6)%7;
	    if (cur === dow) {
		if (selected.length === 0 || selected[selected.length-1] === 0) {
		    selected.push(1);
		} else {
		    selected[selected.length-1]++;
		}
	    } else {
		while (cur < dow) {
		    cur++;
		    selected.push(0);
		}
		selected.push(1);
	    }
	});

	cur = -1;
	var days = [];
	selected.forEach(function(item) {
	    cur++;
	    if (item > 2) {
		days.push(Ext.Date.dayNames[cur+1] + '-' + Ext.Date.dayNames[(cur+item)%7]);
		cur += item-1;
	    } else if (item === 2) {
		days.push(Ext.Date.dayNames[cur+1]);
		days.push(Ext.Date.dayNames[(cur+2)%7]);
		cur++;
	    } else if (item === 1) {
		days.push(Ext.Date.dayNames[(cur+1)%7]);
	    }
	});
	return days.join(', ');
    },

    render_backup_selection: function(value, metaData, record) {
	let allExceptText = gettext('All except {0}');
	let allText = '-- ' + gettext('All') + ' --';
	if (record.data.all) {
	    if (record.data.exclude) {
		return Ext.String.format(allExceptText, record.data.exclude);
	    }
	    return allText;
	}
	if (record.data.vmid) {
	    return record.data.vmid;
	}

	if (record.data.pool) {
	    return "Pool '"+ record.data.pool + "'";
	}

	return "-";
    },

    backup_reasons_table: {
	'backup=yes': gettext('Enabled'),
	'backup=no': gettext('Disabled'),
	'enabled': gettext('Enabled'),
	'disabled': gettext('Disabled'),
	'not a volume': gettext('Not a volume'),
	'efidisk but no OMVF BIOS': gettext('EFI Disk without OMVF BIOS'),
    },

    renderNotFound: what => Ext.String.format(gettext("No {0} found"), what),

    get_kvm_osinfo: function(value) {
	var info = { base: 'Other' }; // default
	if (value) {
	    Ext.each(Object.keys(PVE.Utils.kvm_ostypes), function(k) {
		Ext.each(PVE.Utils.kvm_ostypes[k], function(e) {
		    if (e.val === value) {
			info = { desc: e.desc, base: k };
		    }
		});
	    });
	}
	return info;
    },

    render_kvm_ostype: function(value) {
	var osinfo = PVE.Utils.get_kvm_osinfo(value);
	if (osinfo.desc && osinfo.desc !== '-') {
	    return osinfo.base + ' ' + osinfo.desc;
	} else {
	    return osinfo.base;
	}
    },

    render_hotplug_features: function(value) {
	var fa = [];

	if (!value || value === '0') {
	    return gettext('Disabled');
	}

	if (value === '1') {
	    value = 'disk,network,usb';
	}

	Ext.each(value.split(','), function(el) {
	    if (el === 'disk') {
		fa.push(gettext('Disk'));
	    } else if (el === 'network') {
		fa.push(gettext('Network'));
	    } else if (el === 'usb') {
		fa.push('USB');
	    } else if (el === 'memory') {
		fa.push(gettext('Memory'));
	    } else if (el === 'cpu') {
		fa.push(gettext('CPU'));
	    } else {
		fa.push(el);
	    }
	});

	return fa.join(', ');
    },

    render_localtime: function(value) {
	if (value === '__default__') {
	    return Proxmox.Utils.defaultText + ' (' + gettext('Enabled for Windows') + ')';
	}
	return Proxmox.Utils.format_boolean(value);
    },

    render_qga_features: function(config) {
	if (!config) {
	    return Proxmox.Utils.defaultText + ' (' + Proxmox.Utils.disabledText + ')';
	}
	let qga = PVE.Parser.parsePropertyString(config, 'enabled');
	if (!PVE.Parser.parseBoolean(qga.enabled)) {
	    return Proxmox.Utils.disabledText;
	}
	delete qga.enabled;

	let agentstring = Proxmox.Utils.enabledText;

	for (const [key, value] of Object.entries(qga)) {
	    let displayText = Proxmox.Utils.disabledText;
	    if (key === 'type') {
		let map = {
		    isa: "ISA",
		    virtio: "VirtIO",
		};
		displayText = map[value] || Proxmox.Utils.unknownText;
	    } else if (PVE.Parser.parseBoolean(value)) {
		displayText = Proxmox.Utils.enabledText;
	    }
	    agentstring += `, ${key}: ${displayText}`;
	}

	return agentstring;
    },

    render_qemu_machine: function(value) {
	return value || Proxmox.Utils.defaultText + ' (i440fx)';
    },

    render_qemu_bios: function(value) {
	if (!value) {
	    return Proxmox.Utils.defaultText + ' (SeaBIOS)';
	} else if (value === 'seabios') {
	    return "SeaBIOS";
	} else if (value === 'ovmf') {
	    return "OVMF (UEFI)";
	} else {
	    return value;
	}
    },

    render_dc_ha_opts: function(value) {
	if (!value) {
	    return Proxmox.Utils.defaultText;
	} else {
	    return PVE.Parser.printPropertyString(value);
	}
    },
    render_as_property_string: v => !v ? Proxmox.Utils.defaultText : PVE.Parser.printPropertyString(v),

    render_scsihw: function(value) {
	if (!value || value === '__default__') {
	    return Proxmox.Utils.defaultText + ' (LSI 53C895A)';
	} else if (value === 'lsi') {
	    return 'LSI 53C895A';
	} else if (value === 'lsi53c810') {
	    return 'LSI 53C810';
	} else if (value === 'megasas') {
	    return 'MegaRAID SAS 8708EM2';
	} else if (value === 'virtio-scsi-pci') {
	    return 'VirtIO SCSI';
	} else if (value === 'virtio-scsi-single') {
	    return 'VirtIO SCSI single';
	} else if (value === 'pvscsi') {
	    return 'VMware PVSCSI';
	} else {
	    return value;
	}
    },

    render_spice_enhancements: function(values) {
	let props = PVE.Parser.parsePropertyString(values);
	if (Ext.Object.isEmpty(props)) {
	    return Proxmox.Utils.noneText;
	}

	let output = [];
	if (PVE.Parser.parseBoolean(props.foldersharing)) {
	    output.push('Folder Sharing: ' + gettext('Enabled'));
	}
	if (props.videostreaming === 'all' || props.videostreaming === 'filter') {
	    output.push('Video Streaming: ' + props.videostreaming);
	}
	return output.join(', ');
    },

    // fixme: auto-generate this
    // for now, please keep in sync with PVE::Tools::kvmkeymaps
    kvm_keymaps: {
	'__default__': Proxmox.Utils.defaultText,
	//ar: 'Arabic',
	da: 'Danish',
	de: 'German',
	'de-ch': 'German (Swiss)',
	'en-gb': 'English (UK)',
	'en-us': 'English (USA)',
	es: 'Spanish',
	//et: 'Estonia',
	fi: 'Finnish',
	//fo: 'Faroe Islands',
	fr: 'French',
	'fr-be': 'French (Belgium)',
	'fr-ca': 'French (Canada)',
	'fr-ch': 'French (Swiss)',
	//hr: 'Croatia',
	hu: 'Hungarian',
	is: 'Icelandic',
	it: 'Italian',
	ja: 'Japanese',
	lt: 'Lithuanian',
	//lv: 'Latvian',
	mk: 'Macedonian',
	nl: 'Dutch',
	//'nl-be': 'Dutch (Belgium)',
	no: 'Norwegian',
	pl: 'Polish',
	pt: 'Portuguese',
	'pt-br': 'Portuguese (Brazil)',
	//ru: 'Russian',
	sl: 'Slovenian',
	sv: 'Swedish',
	//th: 'Thai',
	tr: 'Turkish',
    },

    kvm_vga_drivers: {
	'__default__': Proxmox.Utils.defaultText,
	std: gettext('Standard VGA'),
	vmware: gettext('VMware compatible'),
	qxl: 'SPICE',
	qxl2: 'SPICE dual monitor',
	qxl3: 'SPICE three monitors',
	qxl4: 'SPICE four monitors',
	serial0: gettext('Serial terminal') + ' 0',
	serial1: gettext('Serial terminal') + ' 1',
	serial2: gettext('Serial terminal') + ' 2',
	serial3: gettext('Serial terminal') + ' 3',
	virtio: 'VirtIO-GPU',
	'virtio-gl': 'VirGL GPU',
	none: Proxmox.Utils.noneText,
    },

    render_kvm_language: function(value) {
	if (!value || value === '__default__') {
	    return Proxmox.Utils.defaultText;
	}
	let text = PVE.Utils.kvm_keymaps[value];
	return text ? `${text} (${value})` : value;
    },

    console_map: {
	'__default__': Proxmox.Utils.defaultText + ' (xterm.js)',
	'vv': 'SPICE (remote-viewer)',
	'html5': 'HTML5 (noVNC)',
	'xtermjs': 'xterm.js',
    },

    render_console_viewer: function(value) {
	value = value || '__default__';
	return PVE.Utils.console_map[value] || value;
    },

    render_kvm_vga_driver: function(value) {
	if (!value) {
	    return Proxmox.Utils.defaultText;
	}
	let vga = PVE.Parser.parsePropertyString(value, 'type');
	let text = PVE.Utils.kvm_vga_drivers[vga.type];
	if (!vga.type) {
	    text = Proxmox.Utils.defaultText;
	}
	return text ? `${text} (${value})` : value;
    },

    render_kvm_startup: function(value) {
	var startup = PVE.Parser.parseStartup(value);

	var res = 'order=';
	if (startup.order === undefined) {
	    res += 'any';
	} else {
	    res += startup.order;
	}
	if (startup.up !== undefined) {
	    res += ',up=' + startup.up;
	}
	if (startup.down !== undefined) {
	    res += ',down=' + startup.down;
	}

	return res;
    },

    extractFormActionError: function(action) {
	var msg;
	switch (action.failureType) {
	case Ext.form.action.Action.CLIENT_INVALID:
	    msg = gettext('Form fields may not be submitted with invalid values');
	    break;
	case Ext.form.action.Action.CONNECT_FAILURE:
	    msg = gettext('Connection error');
	    var resp = action.response;
	    if (resp.status && resp.statusText) {
		msg += " " + resp.status + ": " + resp.statusText;
	    }
	    break;
	case Ext.form.action.Action.LOAD_FAILURE:
	case Ext.form.action.Action.SERVER_INVALID:
	    msg = Proxmox.Utils.extractRequestError(action.result, true);
	    break;
	}
	return msg;
    },

    contentTypes: {
	'images': gettext('Disk image'),
	'backup': gettext('VZDump backup file'),
	'vztmpl': gettext('Container template'),
	'iso': gettext('ISO image'),
	'rootdir': gettext('Container'),
	'snippets': gettext('Snippets'),
    },

    volume_is_qemu_backup: function(volid, format) {
	return format === 'pbs-vm' || volid.match(':backup/vzdump-qemu-');
    },

    volume_is_lxc_backup: function(volid, format) {
	return format === 'pbs-ct' || volid.match(':backup/vzdump-(lxc|openvz)-');
    },

    authSchema: {
	ad: {
	    name: gettext('Active Directory Server'),
	    ipanel: 'pveAuthADPanel',
	    syncipanel: 'pveAuthLDAPSyncPanel',
	    add: true,
	    tfa: true,
	    pwchange: true,
	},
	ldap: {
	    name: gettext('LDAP Server'),
	    ipanel: 'pveAuthLDAPPanel',
	    syncipanel: 'pveAuthLDAPSyncPanel',
	    add: true,
	    tfa: true,
	    pwchange: true,
	},
	openid: {
	    name: gettext('OpenID Connect Server'),
	    ipanel: 'pveAuthOpenIDPanel',
	    add: true,
	    tfa: false,
	    pwchange: false,
	    iconCls: 'pmx-itype-icon-openid-logo',
	},
	pam: {
	    name: 'Linux PAM',
	    ipanel: 'pveAuthBasePanel',
	    add: false,
	    tfa: true,
	    pwchange: true,
	},
	pve: {
	    name: 'Proxmox VE authentication server',
	    ipanel: 'pveAuthBasePanel',
	    add: false,
	    tfa: true,
	    pwchange: true,
	},
    },

    storageSchema: {
	dir: {
	    name: Proxmox.Utils.directoryText,
	    ipanel: 'DirInputPanel',
	    faIcon: 'folder',
	    backups: true,
	},
	lvm: {
	    name: 'LVM',
	    ipanel: 'LVMInputPanel',
	    faIcon: 'folder',
	    backups: false,
	},
	lvmthin: {
	    name: 'LVM-Thin',
	    ipanel: 'LvmThinInputPanel',
	    faIcon: 'folder',
	    backups: false,
	},
	btrfs: {
	    name: 'BTRFS',
	    ipanel: 'BTRFSInputPanel',
	    faIcon: 'folder',
	    backups: true,
	},
	nfs: {
	    name: 'NFS',
	    ipanel: 'NFSInputPanel',
	    faIcon: 'building',
	    backups: true,
	},
	cifs: {
	    name: 'SMB/CIFS',
	    ipanel: 'CIFSInputPanel',
	    faIcon: 'building',
	    backups: true,
	},
	glusterfs: {
	    name: 'GlusterFS',
	    ipanel: 'GlusterFsInputPanel',
	    faIcon: 'building',
	    backups: true,
	},
	iscsi: {
	    name: 'iSCSI',
	    ipanel: 'IScsiInputPanel',
	    faIcon: 'building',
	    backups: false,
	},
	cephfs: {
	    name: 'CephFS',
	    ipanel: 'CephFSInputPanel',
	    faIcon: 'building',
	    backups: true,
	},
	pvecephfs: {
	    name: 'CephFS (PVE)',
	    ipanel: 'CephFSInputPanel',
	    hideAdd: true,
	    faIcon: 'building',
	    backups: true,
	},
	rbd: {
	    name: 'RBD',
	    ipanel: 'RBDInputPanel',
	    faIcon: 'building',
	    backups: false,
	},
	pveceph: {
	    name: 'RBD (PVE)',
	    ipanel: 'RBDInputPanel',
	    hideAdd: true,
	    faIcon: 'building',
	    backups: false,
	},
	zfs: {
	    name: 'ZFS over iSCSI',
	    ipanel: 'ZFSInputPanel',
	    faIcon: 'building',
	    backups: false,
	},
	zfspool: {
	    name: 'ZFS',
	    ipanel: 'ZFSPoolInputPanel',
	    faIcon: 'folder',
	    backups: false,
	},
	pbs: {
	    name: 'Proxmox Backup Server',
	    ipanel: 'PBSInputPanel',
	    faIcon: 'floppy-o',
	    backups: true,
	},
	drbd: {
	    name: 'DRBD',
	    hideAdd: true,
	    backups: false,
	},
    },

    sdnvnetSchema: {
	vnet: {
	    name: 'vnet',
	    faIcon: 'folder',
	},
    },

    sdnzoneSchema: {
	zone: {
	     name: 'zone',
	     hideAdd: true,
	},
	simple: {
	    name: 'Simple',
	    ipanel: 'SimpleInputPanel',
	    faIcon: 'th',
	},
	vlan: {
	    name: 'VLAN',
	    ipanel: 'VlanInputPanel',
	    faIcon: 'th',
	},
	qinq: {
	    name: 'QinQ',
	    ipanel: 'QinQInputPanel',
	    faIcon: 'th',
	},
	vxlan: {
	    name: 'VXLAN',
	    ipanel: 'VxlanInputPanel',
	    faIcon: 'th',
	},
	evpn: {
	    name: 'EVPN',
	    ipanel: 'EvpnInputPanel',
	    faIcon: 'th',
	},
    },

    sdncontrollerSchema: {
	controller: {
	     name: 'controller',
	     hideAdd: true,
	},
	evpn: {
	    name: 'evpn',
	    ipanel: 'EvpnInputPanel',
	    faIcon: 'crosshairs',
	},
	bgp: {
	    name: 'bgp',
	    ipanel: 'BgpInputPanel',
	    faIcon: 'crosshairs',
	},
    },

    sdnipamSchema: {
	ipam: {
	     name: 'ipam',
	     hideAdd: true,
	},
	pve: {
	    name: 'PVE',
	    ipanel: 'PVEIpamInputPanel',
	    faIcon: 'th',
	    hideAdd: true,
	},
	netbox: {
	    name: 'Netbox',
	    ipanel: 'NetboxInputPanel',
	    faIcon: 'th',
	},
	phpipam: {
	    name: 'PhpIpam',
	    ipanel: 'PhpIpamInputPanel',
	    faIcon: 'th',
	},
    },

    sdndnsSchema: {
	dns: {
	     name: 'dns',
	     hideAdd: true,
	},
	powerdns: {
	    name: 'powerdns',
	    ipanel: 'PowerdnsInputPanel',
	    faIcon: 'th',
	},
    },

    format_sdnvnet_type: function(value, md, record) {
	var schema = PVE.Utils.sdnvnetSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_sdnzone_type: function(value, md, record) {
	var schema = PVE.Utils.sdnzoneSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_sdncontroller_type: function(value, md, record) {
	var schema = PVE.Utils.sdncontrollerSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_sdnipam_type: function(value, md, record) {
	var schema = PVE.Utils.sdnipamSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_sdndns_type: function(value, md, record) {
	var schema = PVE.Utils.sdndnsSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_storage_type: function(value, md, record) {
	if (value === 'rbd') {
	    value = !record || record.get('monhost') ? 'rbd' : 'pveceph';
	} else if (value === 'cephfs') {
	    value = !record || record.get('monhost') ? 'cephfs' : 'pvecephfs';
	}

	let schema = PVE.Utils.storageSchema[value];
	return schema?.name ?? value;
    },

    format_ha: function(value) {
	var text = Proxmox.Utils.noneText;

	if (value.managed) {
	    text = value.state || Proxmox.Utils.noneText;

	    text += ', ' + Proxmox.Utils.groupText + ': ';
	    text += value.group || Proxmox.Utils.noneText;
	}

	return text;
    },

    format_content_types: function(value) {
	return value.split(',').sort().map(function(ct) {
	    return PVE.Utils.contentTypes[ct] || ct;
	}).join(', ');
    },

    render_storage_content: function(value, metaData, record) {
	var data = record.data;
	if (Ext.isNumber(data.channel) &&
	    Ext.isNumber(data.id) &&
	    Ext.isNumber(data.lun)) {
	    return "CH " +
		Ext.String.leftPad(data.channel, 2, '0') +
		" ID " + data.id + " LUN " + data.lun;
	}
	return data.volid.replace(/^.*?:(.*?\/)?/, '');
    },

    render_serverity: function(value) {
	return PVE.Utils.log_severity_hash[value] || value;
    },

    calculate_hostcpu: function(data) {
	if (!(data.uptime && Ext.isNumeric(data.cpu))) {
	    return -1;
	}

	if (data.type !== 'qemu' && data.type !== 'lxc') {
	    return -1;
	}

	var index = PVE.data.ResourceStore.findExact('id', 'node/' + data.node);
	var node = PVE.data.ResourceStore.getAt(index);
	if (!Ext.isDefined(node) || node === null) {
	    return -1;
	}
	var maxcpu = node.data.maxcpu || 1;

	if (!Ext.isNumeric(maxcpu) && (maxcpu >= 1)) {
	    return -1;
	}

	return (data.cpu/maxcpu) * data.maxcpu;
    },

    render_hostcpu: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!(record.data.uptime && Ext.isNumeric(record.data.cpu))) {
	    return '';
	}

	if (record.data.type !== 'qemu' && record.data.type !== 'lxc') {
	    return '';
	}

	var index = PVE.data.ResourceStore.findExact('id', 'node/' + record.data.node);
	var node = PVE.data.ResourceStore.getAt(index);
	if (!Ext.isDefined(node) || node === null) {
	    return '';
	}
	var maxcpu = node.data.maxcpu || 1;

	if (!Ext.isNumeric(maxcpu) && (maxcpu >= 1)) {
	    return '';
	}

	var per = (record.data.cpu/maxcpu) * record.data.maxcpu * 100;

	return per.toFixed(1) + '% of ' + maxcpu.toString() + (maxcpu > 1 ? 'CPUs' : 'CPU');
    },

    render_bandwidth: function(value) {
	if (!Ext.isNumeric(value)) {
	    return '';
	}

	return Proxmox.Utils.format_size(value) + '/s';
    },

    render_timestamp_human_readable: function(value) {
	return Ext.Date.format(new Date(value * 1000), 'l d F Y H:i:s');
    },

    // render a timestamp or pending
    render_next_event: function(value) {
	if (!value) {
	    return '-';
	}
	let now = new Date(), next = new Date(value * 1000);
	if (next < now) {
	    return gettext('pending');
	}
	return Proxmox.Utils.render_timestamp(value);
    },

    calculate_mem_usage: function(data) {
	if (!Ext.isNumeric(data.mem) ||
	    data.maxmem === 0 ||
	    data.uptime < 1) {
	    return -1;
	}

	return data.mem / data.maxmem;
    },

    calculate_hostmem_usage: function(data) {
	if (data.type !== 'qemu' && data.type !== 'lxc') {
	    return -1;
	}

        var index = PVE.data.ResourceStore.findExact('id', 'node/' + data.node);
	var node = PVE.data.ResourceStore.getAt(index);

        if (!Ext.isDefined(node) || node === null) {
	    return -1;
        }
	var maxmem = node.data.maxmem || 0;

	if (!Ext.isNumeric(data.mem) ||
	    maxmem === 0 ||
	    data.uptime < 1) {
	    return -1;
	}

	return data.mem / maxmem;
    },

    render_mem_usage_percent: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!Ext.isNumeric(value) || value === -1) {
	    return '';
	}
	if (value > 1) {
	    // we got no percentage but bytes
	    var mem = value;
	    var maxmem = record.data.maxmem;
	    if (!record.data.uptime ||
		maxmem === 0 ||
		!Ext.isNumeric(mem)) {
		return '';
	    }

	    return (mem*100/maxmem).toFixed(1) + " %";
	}
	return (value*100).toFixed(1) + " %";
    },

    render_hostmem_usage_percent: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!Ext.isNumeric(record.data.mem) || value === -1) {
	    return '';
	}

	if (record.data.type !== 'qemu' && record.data.type !== 'lxc') {
	    return '';
	}

	var index = PVE.data.ResourceStore.findExact('id', 'node/' + record.data.node);
	var node = PVE.data.ResourceStore.getAt(index);
	var maxmem = node.data.maxmem || 0;

	if (record.data.mem > 1) {
	    // we got no percentage but bytes
	    var mem = record.data.mem;
	    if (!record.data.uptime ||
		maxmem === 0 ||
		!Ext.isNumeric(mem)) {
		return '';
	    }

	    return ((mem*100)/maxmem).toFixed(1) + " %";
	}
	return (value*100).toFixed(1) + " %";
    },

    render_mem_usage: function(value, metaData, record, rowIndex, colIndex, store) {
	var mem = value;
	var maxmem = record.data.maxmem;

	if (!record.data.uptime) {
	    return '';
	}

	if (!(Ext.isNumeric(mem) && maxmem)) {
	    return '';
	}

	return Proxmox.Utils.render_size(value);
    },

    calculate_disk_usage: function(data) {
	if (!Ext.isNumeric(data.disk) ||
	    ((data.type === 'qemu' || data.type === 'lxc') && data.uptime === 0) ||
	    data.maxdisk === 0
	) {
	    return -1;
	}

	return data.disk / data.maxdisk;
    },

    render_disk_usage_percent: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!Ext.isNumeric(value) || value === -1) {
	    return '';
	}

	return (value * 100).toFixed(1) + " %";
    },

    render_disk_usage: function(value, metaData, record, rowIndex, colIndex, store) {
	var disk = value;
	var maxdisk = record.data.maxdisk;
	var type = record.data.type;

	if (!Ext.isNumeric(disk) ||
	    maxdisk === 0 ||
	    ((type === 'qemu' || type === 'lxc') && record.data.uptime === 0)
	) {
	    return '';
	}

	return Proxmox.Utils.render_size(value);
    },

    get_object_icon_class: function(type, record) {
	var status = '';
	var objType = type;

	if (type === 'type') {
	    // for folder view
	    objType = record.groupbyid;
	} else if (record.template) {
	    // templates
	    objType = 'template';
	    status = type;
	} else {
	    // everything else
	    status = record.status + ' ha-' + record.hastate;
	}

	if (record.lock) {
	    status += ' locked lock-' + record.lock;
	}

	var defaults = PVE.tree.ResourceTree.typeDefaults[objType];
	if (defaults && defaults.iconCls) {
	    var retVal = defaults.iconCls + ' ' + status;
	    return retVal;
	}

	return '';
    },

    render_resource_type: function(value, metaData, record, rowIndex, colIndex, store) {
	var cls = PVE.Utils.get_object_icon_class(value, record.data);

	var fa = '<i class="fa-fw x-grid-icon-custom ' + cls + '"></i> ';
	return fa + value;
    },

    render_support_level: function(value, metaData, record) {
	return PVE.Utils.support_level_hash[value] || '-';
    },

    render_upid: function(value, metaData, record) {
	var type = record.data.type;
	var id = record.data.id;

	return Proxmox.Utils.format_task_description(type, id);
    },

    render_optional_url: function(value) {
	if (value && value.match(/^https?:\/\//)) {
	    return '<a target="_blank" href="' + value + '">' + value + '</a>';
	}
	return value;
    },

    render_san: function(value) {
	var names = [];
	if (Ext.isArray(value)) {
	    value.forEach(function(val) {
		if (!Ext.isNumber(val)) {
		    names.push(val);
		}
	    });
	    return names.join('<br>');
	}
	return value;
    },

    render_full_name: function(firstname, metaData, record) {
	var first = firstname || '';
	var last = record.data.lastname || '';
	return Ext.htmlEncode(first + " " + last);
    },

    // expecting the following format:
    // [v2:10.10.10.1:6802/2008,v1:10.10.10.1:6803/2008]
    render_ceph_osd_addr: function(value) {
	value = value.trim();
	if (value.startsWith('[') && value.endsWith(']')) {
	    value = value.slice(1, -1); // remove []
	}
	value = value.replaceAll(',', '\n'); // split IPs in lines
	let retVal = '';
	for (const i of value.matchAll(/^(v[0-9]):(.*):([0-9]*)\/([0-9]*)$/gm)) {
	    retVal += `${i[1]}: ${i[2]}:${i[3]}<br>`;
	}
	return retVal.length < 1 ? value : retVal;
    },

    windowHostname: function() {
	return window.location.hostname.replace(Proxmox.Utils.IP6_bracket_match,
            function(m, addr, offset, original) { return addr; });
    },

    openDefaultConsoleWindow: function(consoles, consoleType, vmid, nodename, vmname, cmd) {
	var dv = PVE.Utils.defaultViewer(consoles, consoleType);
	PVE.Utils.openConsoleWindow(dv, consoleType, vmid, nodename, vmname, cmd);
    },

    openConsoleWindow: function(viewer, consoleType, vmid, nodename, vmname, cmd) {
	if (vmid === undefined && (consoleType === 'kvm' || consoleType === 'lxc')) {
	    throw "missing vmid";
	}
	if (!nodename) {
	    throw "no nodename specified";
	}

	if (viewer === 'html5') {
	    PVE.Utils.openVNCViewer(consoleType, vmid, nodename, vmname, cmd);
	} else if (viewer === 'xtermjs') {
	    Proxmox.Utils.openXtermJsViewer(consoleType, vmid, nodename, vmname, cmd);
	} else if (viewer === 'vv') {
	    let url = '/nodes/' + nodename + '/spiceshell';
	    let params = {
		proxy: PVE.Utils.windowHostname(),
	    };
	    if (consoleType === 'kvm') {
		url = '/nodes/' + nodename + '/qemu/' + vmid.toString() + '/spiceproxy';
	    } else if (consoleType === 'lxc') {
		url = '/nodes/' + nodename + '/lxc/' + vmid.toString() + '/spiceproxy';
	    } else if (consoleType === 'upgrade') {
		params.cmd = 'upgrade';
	    } else if (consoleType === 'cmd') {
		params.cmd = cmd;
	    } else if (consoleType !== 'shell') {
		throw `unknown spice viewer type '${consoleType}'`;
	    }
	    PVE.Utils.openSpiceViewer(url, params);
	} else {
	    throw `unknown viewer type '${viewer}'`;
	}
    },

    defaultViewer: function(consoles, type) {
	var allowSpice, allowXtermjs;

	if (consoles === true) {
	    allowSpice = true;
	    allowXtermjs = true;
	} else if (typeof consoles === 'object') {
	    allowSpice = consoles.spice;
	    allowXtermjs = !!consoles.xtermjs;
	}
	let dv = PVE.UIOptions.options.console || (type === 'kvm' ? 'vv' : 'xtermjs');
	if (dv === 'vv' && !allowSpice) {
	    dv = allowXtermjs ? 'xtermjs' : 'html5';
	} else if (dv === 'xtermjs' && !allowXtermjs) {
	    dv = allowSpice ? 'vv' : 'html5';
	}

	return dv;
    },

    openVNCViewer: function(vmtype, vmid, nodename, vmname, cmd) {
	let scaling = 'off';
	if (Proxmox.Utils.toolkit !== 'touch') {
	    var sp = Ext.state.Manager.getProvider();
	    scaling = sp.get('novnc-scaling', 'off');
	}
	var url = Ext.Object.toQueryString({
	    console: vmtype, // kvm, lxc, upgrade or shell
	    novnc: 1,
	    vmid: vmid,
	    vmname: vmname,
	    node: nodename,
	    resize: scaling,
	    cmd: cmd,
	});
	var nw = window.open("?" + url, '_blank', "innerWidth=745,innerheight=427");
	if (nw) {
	    nw.focus();
	}
    },

    openSpiceViewer: function(url, params) {
	var downloadWithName = function(uri, name) {
	    var link = Ext.DomHelper.append(document.body, {
		tag: 'a',
		href: uri,
		css: 'display:none;visibility:hidden;height:0px;',
	    });

	    // Note: we need to tell Android and Chrome the correct file name extension
	    // but we do not set 'download' tag for other environments, because
	    // It can have strange side effects (additional user prompt on firefox)
	    if (navigator.userAgent.match(/Android|Chrome/i)) {
		link.download = name;
	    }

	    if (link.fireEvent) {
		link.fireEvent('onclick');
	    } else {
		let evt = document.createEvent("MouseEvents");
		evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent(evt);
	    }
	};

	Proxmox.Utils.API2Request({
	    url: url,
	    params: params,
	    method: 'POST',
	    failure: function(response, opts) {
		Ext.Msg.alert('Error', response.htmlStatus);
	    },
	    success: function(response, opts) {
		let cfg = response.result.data;
		let raw = Object.entries(cfg).reduce((acc, [k, v]) => acc + `${k}=${v}\n`, "[virt-viewer]\n");
		let spiceDownload = 'data:application/x-virt-viewer;charset=UTF-8,' + encodeURIComponent(raw);
		downloadWithName(spiceDownload, "pve-spice.vv");
	    },
	});
    },

    openTreeConsole: function(tree, record, item, index, e) {
	e.stopEvent();
	let nodename = record.data.node;
	let vmid = record.data.vmid;
	let vmname = record.data.name;
	if (record.data.type === 'qemu' && !record.data.template) {
	    Proxmox.Utils.API2Request({
		url: `/nodes/${nodename}/qemu/${vmid}/status/current`,
		failure: response => Ext.Msg.alert('Error', response.htmlStatus),
		success: function(response, opts) {
		    let conf = response.result.data;
		    let consoles = {
			spice: !!conf.spice,
			xtermjs: !!conf.serial,
		    };
		    PVE.Utils.openDefaultConsoleWindow(consoles, 'kvm', vmid, nodename, vmname);
		},
	    });
	} else if (record.data.type === 'lxc' && !record.data.template) {
	    PVE.Utils.openDefaultConsoleWindow(true, 'lxc', vmid, nodename, vmname);
	}
    },

    // test automation helper
    call_menu_handler: function(menu, text) {
	let item = menu.query('menuitem').find(el => el.text === text);
	if (item && item.handler) {
	    item.handler();
	}
    },

    createCmdMenu: function(v, record, item, index, event) {
	event.stopEvent();
	if (!(v instanceof Ext.tree.View)) {
	    v.select(record);
	}
	let menu;
	let type = record.data.type;

	if (record.data.template) {
	    if (type === 'qemu' || type === 'lxc') {
		menu = Ext.create('PVE.menu.TemplateMenu', {
		    pveSelNode: record,
		});
	    }
	} else if (type === 'qemu' || type === 'lxc' || type === 'node') {
	    menu = Ext.create('PVE.' + type + '.CmdMenu', {
		pveSelNode: record,
		nodename: record.data.node,
	    });
	} else {
	    return undefined;
	}

	menu.showAt(event.getXY());
	return menu;
    },

    // helper for deleting field which are set to there default values
    delete_if_default: function(values, fieldname, default_val, create) {
	if (values[fieldname] === '' || values[fieldname] === default_val) {
	    if (!create) {
		if (values.delete) {
		    if (Ext.isArray(values.delete)) {
			values.delete.push(fieldname);
		    } else {
			values.delete += ',' + fieldname;
		    }
		} else {
		    values.delete = fieldname;
		}
	    }

	    delete values[fieldname];
	}
    },

    loadSSHKeyFromFile: function(file, callback) {
	// ssh-keygen produces ~ 740 bytes for a 4096 bit RSA key,  current max is 16 kbit, so assume:
	// 740 * 8 for max. 32kbit (5920 bytes), round upwards to 8192 bytes, leaves lots of comment space
	PVE.Utils.loadFile(file, callback, 8192);
    },

    loadFile: function(file, callback, maxSize) {
	maxSize = maxSize || 32 * 1024;
	if (file.size > maxSize) {
	    Ext.Msg.alert(gettext('Error'), `${gettext("Invalid file size")}: ${file.size} > ${maxSize}`);
	    return;
	}
	let reader = new FileReader();
	reader.onload = evt => callback(evt.target.result);
	reader.readAsText(file);
    },

    loadTextFromFile: function(file, callback, maxBytes) {
	let maxSize = maxBytes || 8192;
	if (file.size > maxSize) {
	    Ext.Msg.alert(gettext('Error'), gettext("Invalid file size: ") + file.size);
	    return;
	}
	let reader = new FileReader();
	reader.onload = evt => callback(evt.target.result);
	reader.readAsText(file);
    },

    diskControllerMaxIDs: {
	ide: 4,
	sata: 6,
	scsi: 31,
	virtio: 16,
	unused: 256,
    },

    // types is either undefined (all busses), an array of busses, or a single bus
    forEachBus: function(types, func) {
	let busses = Object.keys(PVE.Utils.diskControllerMaxIDs);

	if (Ext.isArray(types)) {
	    busses = types;
	} else if (Ext.isDefined(types)) {
	    busses = [types];
	}

	// check if we only have valid busses
	for (let i = 0; i < busses.length; i++) {
	    if (!PVE.Utils.diskControllerMaxIDs[busses[i]]) {
		throw "invalid bus: '" + busses[i] + "'";
	    }
	}

	for (let i = 0; i < busses.length; i++) {
	    let count = PVE.Utils.diskControllerMaxIDs[busses[i]];
	    for (let j = 0; j < count; j++) {
		let cont = func(busses[i], j);
		if (!cont && cont !== undefined) {
		    return;
		}
	    }
	}
    },

    mp_counts: {
	mp: 256,
	unused: 256,
    },

    forEachMP: function(func, includeUnused) {
	for (let i = 0; i < PVE.Utils.mp_counts.mp; i++) {
	    let cont = func('mp', i);
	    if (!cont && cont !== undefined) {
		return;
	    }
	}

	if (!includeUnused) {
	    return;
	}

	for (let i = 0; i < PVE.Utils.mp_counts.unused; i++) {
	    let cont = func('unused', i);
	    if (!cont && cont !== undefined) {
		return;
	    }
	}
    },

    hardware_counts: {
	net: 32,
	usb: 14,
	usb_old: 5,
	hostpci: 16,
	audio: 1,
	efidisk: 1,
	serial: 4,
	rng: 1,
	tpmstate: 1,
    },

    // we can have usb6 and up only for specific machine/ostypes
    get_max_usb_count: function(ostype, machine) {
	if (!ostype) {
	    return PVE.Utils.hardware_counts.usb_old;
	}

	let match = /-(\d+).(\d+)/.exec(machine ?? '');
	if (!match || PVE.Utils.qemu_min_version([match[1], match[2]], [7, 1])) {
	    if (ostype === 'l26') {
		return PVE.Utils.hardware_counts.usb;
	    }
	    let os_match = /^win(\d+)$/.exec(ostype);
	    if (os_match && os_match[1] > 7) {
		return PVE.Utils.hardware_counts.usb;
	    }
	}

	return PVE.Utils.hardware_counts.usb_old;
    },

    // parameters are expected to be arrays, e.g. [7,1], [4,0,1]
    // returns true if toCheck is equal or greater than minVersion
    qemu_min_version: function(toCheck, minVersion) {
	let i;
	for (i = 0; i < toCheck.length && i < minVersion.length; i++) {
	    if (toCheck[i] < minVersion[i]) {
		return false;
	    }
	}

	if (minVersion.length > toCheck.length) {
	    for (; i < minVersion.length; i++) {
		if (minVersion[i] !== 0) {
		    return false;
		}
	    }
	}

	return true;
    },

    cleanEmptyObjectKeys: function(obj) {
	for (const propName of Object.keys(obj)) {
	    if (obj[propName] === null || obj[propName] === undefined) {
		delete obj[propName];
	    }
	}
    },

    acmedomain_count: 5,

    add_domain_to_acme: function(acme, domain) {
	if (acme.domains === undefined) {
	    acme.domains = [domain];
	} else {
	    acme.domains.push(domain);
	    acme.domains = acme.domains.filter((value, index, self) => self.indexOf(value) === index);
	}
	return acme;
    },

    remove_domain_from_acme: function(acme, domain) {
	if (acme.domains !== undefined) {
	    acme.domains = acme
		.domains
		.filter((value, index, self) => self.indexOf(value) === index && value !== domain);
	}
	return acme;
    },

    handleStoreErrorOrMask: function(view, store, regex, callback) {
	view.mon(store, 'load', function(proxy, response, success, operation) {
	    if (success) {
		Proxmox.Utils.setErrorMask(view, false);
		return;
	    }
	    let msg;
	    if (operation.error.statusText) {
		if (operation.error.statusText.match(regex)) {
		    callback(view, operation.error);
		    return;
		} else {
		    msg = operation.error.statusText + ' (' + operation.error.status + ')';
		}
	    } else {
		msg = gettext('Connection error');
	    }
	    Proxmox.Utils.setErrorMask(view, msg);
	});
    },

    showCephInstallOrMask: function(container, msg, nodename, callback) {
	if (msg.match(/not (installed|initialized)/i)) {
	    if (Proxmox.UserName === 'root@pam') {
		container.el.mask();
		if (!container.down('pveCephInstallWindow')) {
		    var isInstalled = !!msg.match(/not initialized/i);
		    var win = Ext.create('PVE.ceph.Install', {
			nodename: nodename,
		    });
		    win.getViewModel().set('isInstalled', isInstalled);
		    container.add(win);
		    win.on('close', () => {
			container.el.unmask();
		    });
		    win.show();
		    callback(win);
		}
	    } else {
		container.mask(Ext.String.format(gettext('{0} not installed.') +
		    ' ' + gettext('Log in as root to install.'), 'Ceph'), ['pve-static-mask']);
	    }
	    return true;
	} else {
	    return false;
	}
    },

    monitor_ceph_installed: function(view, rstore, nodename, maskOwnerCt) {
	PVE.Utils.handleStoreErrorOrMask(
	    view,
	    rstore,
	    /not (installed|initialized)/i,
	    (_, error) => {
		nodename = nodename || 'localhost';
		let maskTarget = maskOwnerCt ? view.ownerCt : view;
		rstore.stopUpdate();
		PVE.Utils.showCephInstallOrMask(maskTarget, error.statusText, nodename, win => {
		    view.mon(win, 'cephInstallWindowClosed', () => rstore.startUpdate());
		});
	    },
	);
    },


    propertyStringSet: function(target, source, name, value) {
	if (source) {
	    if (value === undefined) {
		target[name] = source;
	    } else {
		target[name] = value;
	    }
	} else {
	    delete target[name];
	}
    },

    forEachCorosyncLink: function(nodeinfo, cb) {
	let re = /(?:ring|link)(\d+)_addr/;
	Ext.iterate(nodeinfo, (prop, val) => {
	    let match = re.exec(prop);
	    if (match) {
		cb(Number(match[1]), val);
	    }
	});
    },

    cpu_vendor_map: {
	'default': 'QEMU',
	'AuthenticAMD': 'AMD',
	'GenuineIntel': 'Intel',
    },

    cpu_vendor_order: {
	"AMD": 1,
	"Intel": 2,
	"QEMU": 3,
	"Host": 4,
	"_default_": 5, // includes custom models
    },

    verify_ip64_address_list: function(value, with_suffix) {
	for (let addr of value.split(/[ ,;]+/)) {
	    if (addr === '') {
		continue;
	    }

	    if (with_suffix) {
		let parts = addr.split('%');
		addr = parts[0];

		if (parts.length > 2) {
		    return false;
		}

		if (parts.length > 1 && !addr.startsWith('fe80:')) {
		    return false;
		}
	    }

	    if (!Proxmox.Utils.IP64_match.test(addr)) {
		return false;
	    }
	}

	return true;
    },

    sortByPreviousUsage: function(vmconfig, controllerList) {
	if (!controllerList) {
	    controllerList = ['ide', 'virtio', 'scsi', 'sata'];
	}
	let usedControllers = {};
	for (const type of Object.keys(PVE.Utils.diskControllerMaxIDs)) {
	    usedControllers[type] = 0;
	}

	for (const property of Object.keys(vmconfig)) {
	    if (property.match(PVE.Utils.bus_match) && !vmconfig[property].match(/media=cdrom/)) {
		const foundController = property.match(PVE.Utils.bus_match)[1];
		usedControllers[foundController]++;
	    }
	}

	let sortPriority = PVE.qemu.OSDefaults.getDefaults(vmconfig.ostype).busPriority;

	let sortedList = Ext.clone(controllerList);
	sortedList.sort(function(a, b) {
	    if (usedControllers[b] === usedControllers[a]) {
		return sortPriority[b] - sortPriority[a];
	    }
	    return usedControllers[b] - usedControllers[a];
	});

	return sortedList;
    },

    nextFreeDisk: function(controllers, config) {
	for (const controller of controllers) {
	    for (let i = 0; i < PVE.Utils.diskControllerMaxIDs[controller]; i++) {
		let confid = controller + i.toString();
		if (!Ext.isDefined(config[confid])) {
		    return {
			controller,
			id: i,
			confid,
		    };
		}
	    }
	}

	return undefined;
    },

    nextFreeMP: function(type, config) {
	for (let i = 0; i < PVE.Utils.mp_counts[type]; i++) {
	    let confid = `${type}${i}`;
	    if (!Ext.isDefined(config[confid])) {
		return {
		    type,
		    id: i,
		    confid,
		};
	    }
	}

	return undefined;
    },

    escapeNotesTemplate: function(value) {
	let replace = {
	    '\\': '\\\\',
	    '\n': '\\n',
	};
	return value.replace(/(\\|[\n])/g, match => replace[match]);
    },

    unEscapeNotesTemplate: function(value) {
	let replace = {
	    '\\\\': '\\',
	    '\\n': '\n',
	};
	return value.replace(/(\\\\|\\n)/g, match => replace[match]);
    },

    notesTemplateVars: ['cluster', 'guestname', 'node', 'vmid'],

    renderTags: function(tagstext, overrides) {
	let text = '';
	if (tagstext) {
	    let tags = (tagstext.split(/[,; ]/) || []).filter(t => !!t);
	    if (PVE.UIOptions.shouldSortTags()) {
		tags = tags.sort((a, b) => {
		    let alc = a.toLowerCase();
		    let blc = b.toLowerCase();
		    return alc < blc ? -1 : blc < alc ? 1 : a.localeCompare(b);
		});
	    }
	    text += ' ';
	    tags.forEach((tag) => {
		text += Proxmox.Utils.getTagElement(tag, overrides);
	    });
	}
	return text;
    },

    tagCharRegex: /^[a-z0-9+_.-]+$/i,

    verificationStateOrder: {
	'failed': 0,
	'none': 1,
	'ok': 2,
	'__default__': 3,
    },
},

    singleton: true,
    constructor: function() {
	var me = this;
	Ext.apply(me, me.utilities);

	Proxmox.Utils.override_task_descriptions({
	    acmedeactivate: ['ACME Account', gettext('Deactivate')],
	    acmenewcert: ['SRV', gettext('Order Certificate')],
	    acmerefresh: ['ACME Account', gettext('Refresh')],
	    acmeregister: ['ACME Account', gettext('Register')],
	    acmerenew: ['SRV', gettext('Renew Certificate')],
	    acmerevoke: ['SRV', gettext('Revoke Certificate')],
	    acmeupdate: ['ACME Account', gettext('Update')],
	    'auth-realm-sync': [gettext('Realm'), gettext('Sync')],
	    'auth-realm-sync-test': [gettext('Realm'), gettext('Sync Preview')],
	    cephcreatemds: ['Ceph Metadata Server', gettext('Create')],
	    cephcreatemgr: ['Ceph Manager', gettext('Create')],
	    cephcreatemon: ['Ceph Monitor', gettext('Create')],
	    cephcreateosd: ['Ceph OSD', gettext('Create')],
	    cephcreatepool: ['Ceph Pool', gettext('Create')],
	    cephdestroymds: ['Ceph Metadata Server', gettext('Destroy')],
	    cephdestroymgr: ['Ceph Manager', gettext('Destroy')],
	    cephdestroymon: ['Ceph Monitor', gettext('Destroy')],
	    cephdestroyosd: ['Ceph OSD', gettext('Destroy')],
	    cephdestroypool: ['Ceph Pool', gettext('Destroy')],
	    cephdestroyfs: ['CephFS', gettext('Destroy')],
	    cephfscreate: ['CephFS', gettext('Create')],
	    cephsetpool: ['Ceph Pool', gettext('Edit')],
	    cephsetflags: ['', gettext('Change global Ceph flags')],
	    clustercreate: ['', gettext('Create Cluster')],
	    clusterjoin: ['', gettext('Join Cluster')],
	    dircreate: [gettext('Directory Storage'), gettext('Create')],
	    dirremove: [gettext('Directory'), gettext('Remove')],
	    download: [gettext('File'), gettext('Download')],
	    hamigrate: ['HA', gettext('Migrate')],
	    hashutdown: ['HA', gettext('Shutdown')],
	    hastart: ['HA', gettext('Start')],
	    hastop: ['HA', gettext('Stop')],
	    imgcopy: ['', gettext('Copy data')],
	    imgdel: ['', gettext('Erase data')],
	    lvmcreate: [gettext('LVM Storage'), gettext('Create')],
	    lvmremove: ['Volume Group', gettext('Remove')],
	    lvmthincreate: [gettext('LVM-Thin Storage'), gettext('Create')],
	    lvmthinremove: ['Thinpool', gettext('Remove')],
	    migrateall: ['', gettext('Migrate all VMs and Containers')],
	    'move_volume': ['CT', gettext('Move Volume')],
	    'pbs-download': ['VM/CT', gettext('File Restore Download')],
	    pull_file: ['CT', gettext('Pull file')],
	    push_file: ['CT', gettext('Push file')],
	    qmclone: ['VM', gettext('Clone')],
	    qmconfig: ['VM', gettext('Configure')],
	    qmcreate: ['VM', gettext('Create')],
	    qmdelsnapshot: ['VM', gettext('Delete Snapshot')],
	    qmdestroy: ['VM', gettext('Destroy')],
	    qmigrate: ['VM', gettext('Migrate')],
	    qmmove: ['VM', gettext('Move disk')],
	    qmpause: ['VM', gettext('Pause')],
	    qmreboot: ['VM', gettext('Reboot')],
	    qmreset: ['VM', gettext('Reset')],
	    qmrestore: ['VM', gettext('Restore')],
	    qmresume: ['VM', gettext('Resume')],
	    qmrollback: ['VM', gettext('Rollback')],
	    qmshutdown: ['VM', gettext('Shutdown')],
	    qmsnapshot: ['VM', gettext('Snapshot')],
	    qmstart: ['VM', gettext('Start')],
	    qmstop: ['VM', gettext('Stop')],
	    qmsuspend: ['VM', gettext('Hibernate')],
	    qmtemplate: ['VM', gettext('Convert to template')],
	    spiceproxy: ['VM/CT', gettext('Console') + ' (Spice)'],
	    spiceshell: ['', gettext('Shell') + ' (Spice)'],
	    startall: ['', gettext('Start all VMs and Containers')],
	    stopall: ['', gettext('Stop all VMs and Containers')],
	    unknownimgdel: ['', gettext('Destroy image from unknown guest')],
	    wipedisk: ['Device', gettext('Wipe Disk')],
	    vncproxy: ['VM/CT', gettext('Console')],
	    vncshell: ['', gettext('Shell')],
	    vzclone: ['CT', gettext('Clone')],
	    vzcreate: ['CT', gettext('Create')],
	    vzdelsnapshot: ['CT', gettext('Delete Snapshot')],
	    vzdestroy: ['CT', gettext('Destroy')],
	    vzdump: (type, id) => id ? `VM/CT ${id} - ${gettext('Backup')}` : gettext('Backup Job'),
	    vzmigrate: ['CT', gettext('Migrate')],
	    vzmount: ['CT', gettext('Mount')],
	    vzreboot: ['CT', gettext('Reboot')],
	    vzrestore: ['CT', gettext('Restore')],
	    vzresume: ['CT', gettext('Resume')],
	    vzrollback: ['CT', gettext('Rollback')],
	    vzshutdown: ['CT', gettext('Shutdown')],
	    vzsnapshot: ['CT', gettext('Snapshot')],
	    vzstart: ['CT', gettext('Start')],
	    vzstop: ['CT', gettext('Stop')],
	    vzsuspend: ['CT', gettext('Suspend')],
	    vztemplate: ['CT', gettext('Convert to template')],
	    vzumount: ['CT', gettext('Unmount')],
	    zfscreate: [gettext('ZFS Storage'), gettext('Create')],
	    zfsremove: ['ZFS Pool', gettext('Remove')],
	});
    },

});
// Some configuration values are complex strings - so we need parsers/generators for them.
Ext.define('PVE.Parser', {
 statics: {

    // this class only contains static functions

    printACME: function(value) {
	if (Ext.isArray(value.domains)) {
	    value.domains = value.domains.join(';');
	}
	return PVE.Parser.printPropertyString(value);
    },

    parseACME: function(value) {
	if (!value) {
	    return {};
	}

	let res = {};
	try {
	    value.split(',').forEach(property => {
		let [k, v] = property.split('=', 2);
		if (Ext.isDefined(v)) {
		    res[k] = v;
		} else {
		    throw `Failed to parse key-value pair: ${property}`;
		}
	    });
	} catch (err) {
	    console.warn(err);
	    return undefined;
	}

	if (res.domains !== undefined) {
	    res.domains = res.domains.split(/;/);
	}

	return res;
    },

    parseBoolean: function(value, default_value) {
	if (!Ext.isDefined(value)) {
	    return default_value;
	}
	value = value.toLowerCase();
	return value === '1' ||
	       value === 'on' ||
	       value === 'yes' ||
	       value === 'true';
    },

    parsePropertyString: function(value, defaultKey) {
	let res = {};

	if (typeof value !== 'string' || value === '') {
	    return res;
	}

	try {
	    value.split(',').forEach(property => {
		let [k, v] = property.split('=', 2);
		if (Ext.isDefined(v)) {
		    res[k] = v;
		} else if (Ext.isDefined(defaultKey)) {
		    if (Ext.isDefined(res[defaultKey])) {
			throw 'defaultKey may be only defined once in propertyString';
		    }
		    res[defaultKey] = k; // k ist the value in this case
		} else {
		    throw `Failed to parse key-value pair: ${property}`;
		}
	    });
	} catch (err) {
	    console.warn(err);
	    return undefined;
	}

	return res;
    },

    printPropertyString: function(data, defaultKey) {
	var stringparts = [],
	    gotDefaultKeyVal = false,
	    defaultKeyVal;

	Ext.Object.each(data, function(key, value) {
	    if (defaultKey !== undefined && key === defaultKey) {
		gotDefaultKeyVal = true;
		defaultKeyVal = value;
	    } else if (value !== '') {
		stringparts.push(key + '=' + value);
	    }
	});

	stringparts = stringparts.sort();
	if (gotDefaultKeyVal) {
	    stringparts.unshift(defaultKeyVal);
	}

	return stringparts.join(',');
    },

    parseQemuNetwork: function(key, value) {
	if (!(key && value)) {
	    return undefined;
	}

	let res = {},
	    errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return undefined; // continue
	    }

	    let match_res;

	    if ((match_res = p.match(/^(ne2k_pci|e1000|e1000-82540em|e1000-82544gc|e1000-82545em|vmxnet3|rtl8139|pcnet|virtio|ne2k_isa|i82551|i82557b|i82559er)(=([0-9a-f]{2}(:[0-9a-f]{2}){5}))?$/i)) !== null) {
		res.model = match_res[1].toLowerCase();
		if (match_res[3]) {
		    res.macaddr = match_res[3];
		}
	    } else if ((match_res = p.match(/^bridge=(\S+)$/)) !== null) {
		res.bridge = match_res[1];
	    } else if ((match_res = p.match(/^rate=(\d+(\.\d+)?)$/)) !== null) {
		res.rate = match_res[1];
	    } else if ((match_res = p.match(/^tag=(\d+(\.\d+)?)$/)) !== null) {
		res.tag = match_res[1];
	    } else if ((match_res = p.match(/^firewall=(\d+)$/)) !== null) {
		res.firewall = match_res[1];
	    } else if ((match_res = p.match(/^link_down=(\d+)$/)) !== null) {
		res.disconnect = match_res[1];
	    } else if ((match_res = p.match(/^queues=(\d+)$/)) !== null) {
		res.queues = match_res[1];
	    } else if ((match_res = p.match(/^trunks=(\d+(?:-\d+)?(?:;\d+(?:-\d+)?)*)$/)) !== null) {
		res.trunks = match_res[1];
	    } else if ((match_res = p.match(/^mtu=(\d+)$/)) !== null) {
		res.mtu = match_res[1];
	    } else {
		errors = true;
		return false; // break
	    }
	    return undefined; // continue
	});

	if (errors || !res.model) {
	    return undefined;
	}

	return res;
    },

    printQemuNetwork: function(net) {
	var netstr = net.model;
	if (net.macaddr) {
	    netstr += "=" + net.macaddr;
	}
	if (net.bridge) {
	    netstr += ",bridge=" + net.bridge;
	    if (net.tag) {
		netstr += ",tag=" + net.tag;
	    }
	    if (net.firewall) {
		netstr += ",firewall=" + net.firewall;
	    }
	}
	if (net.rate) {
	    netstr += ",rate=" + net.rate;
	}
	if (net.queues) {
	    netstr += ",queues=" + net.queues;
	}
	if (net.disconnect) {
	    netstr += ",link_down=" + net.disconnect;
	}
	if (net.trunks) {
	    netstr += ",trunks=" + net.trunks;
	}
	if (net.mtu) {
	    netstr += ",mtu=" + net.mtu;
	}
	return netstr;
    },

    parseQemuDrive: function(key, value) {
	if (!(key && value)) {
	    return undefined;
	}

	const [, bus, index] = key.match(/^([a-z]+)(\d+)$/);
	if (!bus) {
	    return undefined;
	}
	let res = {
	    'interface': bus,
	    index,
	};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return undefined; // continue
	    }
	    let match = p.match(/^([a-z_]+)=(\S+)$/);
	    if (!match) {
		if (!p.match(/[=]/)) {
		    res.file = p;
		    return undefined; // continue
		}
		errors = true;
		return false; // break
	    }
	    let [, k, v] = match;
	    if (k === 'volume') {
		k = 'file';
	    }

	    if (Ext.isDefined(res[k])) {
		errors = true;
		return false; // break
	    }

	    if (k === 'cache' && v === 'off') {
		v = 'none';
	    }

	    res[k] = v;

	    return undefined; // continue
	});

	if (errors || !res.file) {
	    return undefined;
	}

	return res;
    },

    printQemuDrive: function(drive) {
	var drivestr = drive.file;

	Ext.Object.each(drive, function(key, value) {
	    if (!Ext.isDefined(value) || key === 'file' ||
		key === 'index' || key === 'interface') {
		return; // continue
	    }
	    drivestr += ',' + key + '=' + value;
	});

	return drivestr;
    },

    parseIPConfig: function(key, value) {
	if (!(key && value)) {
	    return undefined; // continue
	}

	let res = {};
	try {
	    value.split(',').forEach(p => {
		if (!p || p.match(/^\s*$/)) {
		    return; // continue
		}

		const match = p.match(/^(ip|gw|ip6|gw6)=(\S+)$/);
		if (!match) {
		    throw `could not parse as IP config: ${p}`;
		}
		let [, k, v] = match;
		res[k] = v;
	    });
	} catch (err) {
	    console.warn(err);
	    return undefined; // continue
	}

	return res;
    },

    printIPConfig: function(cfg) {
	return Object.entries(cfg)
	    .filter(([k, v]) => v && k.match(/^(ip|gw|ip6|gw6)$/))
	    .map(([k, v]) => `${k}=${v}`)
	    .join(',');
    },

    parseLxcNetwork: function(value) {
	if (!value) {
	    return undefined;
	}

	let data = {};
	value.split(',').forEach(p => {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }
	    let match_res = p.match(/^(bridge|hwaddr|mtu|name|ip|ip6|gw|gw6|tag|rate)=(\S+)$/);
	    if (match_res) {
		data[match_res[1]] = match_res[2];
	    } else if ((match_res = p.match(/^firewall=(\d+)$/)) !== null) {
		data.firewall = PVE.Parser.parseBoolean(match_res[1]);
	    } else if ((match_res = p.match(/^link_down=(\d+)$/)) !== null) {
		data.link_down = PVE.Parser.parseBoolean(match_res[1]);
	    } else if (!p.match(/^type=\S+$/)) {
		console.warn(`could not parse LXC network string ${p}`);
	    }
	});

	return data;
    },

    printLxcNetwork: function(config) {
	let knownKeys = {
	    bridge: 1,
	    firewall: 1,
	    gw6: 1,
	    gw: 1,
	    hwaddr: 1,
	    ip6: 1,
	    ip: 1,
	    mtu: 1,
	    name: 1,
	    rate: 1,
	    tag: 1,
	    link_down: 1,
	};
	return Object.entries(config)
	    .filter(([k, v]) => v !== undefined && v !== '' && knownKeys[k])
	    .map(([k, v]) => `${k}=${v}`)
	    .join(',');
    },

    parseLxcMountPoint: function(value) {
	if (!value) {
	    return undefined;
	}

	let res = {};
	let errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return undefined; // continue
	    }
	    let match = p.match(/^([a-z_]+)=(.+)$/);
	    if (!match) {
		if (!p.match(/[=]/)) {
		    res.file = p;
		    return undefined; // continue
		}
		errors = true;
		return false; // break
	    }
	    let [, k, v] = match;
	    if (k === 'volume') {
		k = 'file';
	    }

	    if (Ext.isDefined(res[k])) {
		errors = true;
		return false; // break
	    }

	    res[k] = v;

	    return undefined;
	});

	if (errors || !res.file) {
	    return undefined;
	}

	const match = res.file.match(/^([a-z][a-z0-9\-_.]*[a-z0-9]):/i);
	if (match) {
	    res.storage = match[1];
	    res.type = 'volume';
	} else if (res.file.match(/^\/dev\//)) {
	    res.type = 'device';
	} else {
	    res.type = 'bind';
	}

	return res;
    },

    printLxcMountPoint: function(mp) {
	let drivestr = mp.file;
	for (const [key, value] of Object.entries(mp)) {
	    if (!Ext.isDefined(value) || key === 'file' || key === 'type' || key === 'storage') {
		continue;
	    }
	    drivestr += `,${key}=${value}`;
	}
	return drivestr;
    },

    parseStartup: function(value) {
	if (value === undefined) {
	    return undefined;
	}

	let res = {};
	try {
	    value.split(',').forEach(p => {
		if (!p || p.match(/^\s*$/)) {
		    return; // continue
		}

		let match_res;
		if ((match_res = p.match(/^(order)?=(\d+)$/)) !== null) {
		    res.order = match_res[2];
		} else if ((match_res = p.match(/^up=(\d+)$/)) !== null) {
		    res.up = match_res[1];
		} else if ((match_res = p.match(/^down=(\d+)$/)) !== null) {
		    res.down = match_res[1];
		} else {
		    throw `could not parse startup config ${p}`;
		}
	    });
	} catch (err) {
	    console.warn(err);
	    return undefined;
	}

	return res;
    },

    printStartup: function(startup) {
	let arr = [];
	if (startup.order !== undefined && startup.order !== '') {
	    arr.push('order=' + startup.order);
	}
	if (startup.up !== undefined && startup.up !== '') {
	    arr.push('up=' + startup.up);
	}
	if (startup.down !== undefined && startup.down !== '') {
	    arr.push('down=' + startup.down);
	}

	return arr.join(',');
    },

    parseQemuSmbios1: function(value) {
	let res = value.split(',').reduce((acc, currentValue) => {
	    const [k, v] = currentValue.split(/[=](.+)/);
	    acc[k] = v;
	    return acc;
	}, {});

	if (PVE.Parser.parseBoolean(res.base64, false)) {
	    for (const [k, v] of Object.entries(res)) {
		if (k !== 'uuid') {
		    res[k] = Ext.util.Base64.decode(v);
		}
	    }
	}

	return res;
    },

    printQemuSmbios1: function(data) {
	let base64 = false;
	let datastr = Object.entries(data)
	    .map(([key, value]) => {
		if (value === '') {
		    return undefined;
		}
		if (key !== 'uuid') {
		    base64 = true; // smbios values can be arbitrary, so encode and mark config as such
		    value = Ext.util.Base64.encode(value);
		}
		return `${key}=${value}`;
	    })
	    .filter(v => v !== undefined)
	    .join(',');

	if (base64) {
	    datastr += ',base64=1';
	}
	return datastr;
    },

    parseTfaConfig: function(value) {
	let res = {};
	value.split(',').forEach(p => {
	    const [k, v] = p.split('=', 2);
	    res[k] = v;
	});

	return res;
    },

    parseTfaType: function(value) {
	let match;
	if (!value || !value.length) {
	    return undefined;
	} else if (value === 'x!oath') {
	    return 'totp';
	} else if ((match = value.match(/^x!(.+)$/)) !== null) {
	    return match[1];
	} else {
	    return 1;
	}
    },

    parseQemuCpu: function(value) {
	if (!value) {
	    return {};
	}

	let res = {};
	let errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return undefined; // continue
	    }

	    if (!p.match(/[=]/)) {
		if (Ext.isDefined(res.cpu)) {
		    errors = true;
		    return false; // break
		}
		res.cputype = p;
		return undefined; // continue
	    }

	    let match = p.match(/^([a-z_]+)=(\S+)$/);
	    if (!match || Ext.isDefined(res[match[1]])) {
		errors = true;
		return false; // break
	    }

	    let [, k, v] = match;
	    res[k] = v;

	    return undefined;
	});

	if (errors || !res.cputype) {
	    return undefined;
	}

	return res;
    },

    printQemuCpu: function(cpu) {
	let cpustr = cpu.cputype;
	let optstr = '';

	Ext.Object.each(cpu, function(key, value) {
	    if (!Ext.isDefined(value) || key === 'cputype') {
		return; // continue
	    }
	    optstr += ',' + key + '=' + value;
	});

	if (!cpustr) {
	    if (optstr) {
		return 'kvm64' + optstr;
	    } else {
		return undefined;
	    }
	}

	return cpustr + optstr;
    },

    parseSSHKey: function(key) {
	//                |--- options can have quotes--|     type    key        comment
	let keyre = /^(?:((?:[^\s"]|"(?:\\.|[^"\\])*")+)\s+)?(\S+)\s+(\S+)(?:\s+(.*))?$/;
	let typere = /^(?:(?:sk-)?(?:ssh-(?:dss|rsa|ed25519)|ecdsa-sha2-nistp\d+)(?:@(?:[a-z0-9_-]+\.)+[a-z]{2,})?)$/;

	let m = key.match(keyre);
	if (!m || m.length < 3 || !m[2]) { // [2] is always either type or key
	    return null;
	}
	if (m[1] && m[1].match(typere)) {
	    return {
		type: m[1],
		key: m[2],
		comment: m[3],
	    };
	}
	if (m[2].match(typere)) {
	    return {
		options: m[1],
		type: m[2],
		key: m[3],
		comment: m[4],
	    };
	}
	return null;
    },

    parseACMEPluginData: function(data) {
	let res = {};
	let extradata = [];
	data.split('\n').forEach((line) => {
	    // capture everything after the first = as value
	    let [key, value] = line.split(/[=](.+)/);
	    if (value !== undefined) {
		res[key] = value;
	    } else {
		extradata.push(line);
	    }
	});
	return [res, extradata];
    },
},
});
// Sencha Touch related things

Proxmox.Utils.toolkit = 'touch',

Ext.Ajax.setDisableCaching(false);

// do not send '_dc' parameter
Ext.Ajax.disableCaching = false;
Ext.define('PVE.RestProxy', {
    extend: 'Ext.data.RestProxy',
    alias : 'proxy.pve',

    constructor: function(config) {
	var me = this;

	config = config || {};

	Ext.applyIf(config, {
	    pageParam : null,
	    startParam: null,
	    limitParam: null,
	    groupParam: null,
	    sortParam: null,
	    filterParam: null,
	    noCache : false,
	    reader: {
		type: 'json',
		rootProperty: config.root || 'data'
	    },
	    afterRequest: function(request, success) {
		me.fireEvent('afterload', me, request, success);
		return;
	    }
	});

	me.callParent([config]); 
    }
});

Ext.define('pve-domains', {
    extend: "Ext.data.Model",

    config: {
	fields: [ 'realm', 'type', 'comment', 'default', 'tfa',
		  { 
		      name: 'descr',
		      // Note: We use this in the RealmComboBox.js
		      // (see Bug #125)
		      convert: function(value, record) {
			  var info = record.data;
			  var text;

			  if (value) {
			      return value;
			  }
			  // return realm if there is no comment
			  text = info.comment || info.realm;

			  if (info.tfa) {
			      text += " (+ " + info.tfa + ")";
			  }

			  return text;
		      }
		  }
		],
	proxy: {
	    type: 'pve',
	    url: "/api2/json/access/domains"
	}
    }
});

Ext.define('pve-tasks', {
    extend: 'Ext.data.Model',
    config: {
	fields:  [ 
	    { name: 'starttime', type : 'date', dateFormat: 'timestamp' }, 
	    { name: 'endtime', type : 'date', dateFormat: 'timestamp' }, 
	    { name: 'pid', type: 'int' },
	    'node', 'upid', 'user', 'status', 'type', 'id'
	],
	idProperty: 'upid'
    }
});
Ext.define('PVE.MenuButton', {
    extend: 'Ext.Button',
    alias: 'widget.pveMenuButton',

    menuPanel: undefined,

    createMenuPanel: function() {
	var me = this;

	var data = me.getMenuItems() || [];

	var addHide = function (fn) {
	    return function () {
		if (me.menuPanel) {
		    me.menuPanel.hide();
		    Ext.Viewport.remove(me.menuPanel);
		    me.menuPanel.destroy();
		    me.menuPanel = undefined;
		}
		return fn.apply(this, arguments);
	    };
	};

	var items = [];

	if (me.getPveStdMenu()) {
	    items.push({
		xtype: 'button',
		ui: 'plain',
		text: gettext('Datacenter'),
		handler: addHide(function() {
		    PVE.Workspace.gotoPage('');
		})
	    });
	}

	data.forEach(function(el) {
	    items.push(Ext.apply(el, {
		xtype: 'button',
		ui: 'plain',
		handler: addHide(el.handler)
	    }));
	});

	if (me.getPveStdMenu()) {
	    items.push({ 
		xtype: 'button',
		ui: 'plain',
		text: gettext('Logout'),
		handler: addHide(function() {
		    PVE.Workspace.showLogin();
		})
	    });
	}

	me.menuPanel = Ext.create('Ext.Panel', {
	    modal: true,
	    hideOnMaskTap: true,
	    visible: false,
	    minWidth: 200,
	    layout: {
		type:'vbox',
		align: 'stretch'
	    },
	    items: items
	});

	PVE.Workspace.history.on('change', function() {
	    if (me.menuPanel) {
		Ext.Viewport.remove(me.menuPanel);
		me.menuPanel.destroy();
		me.menuPanel = undefined;
	    }
	});
    },

    config: {
	menuItems: undefined,
	pveStdMenu: false, // add LOGOUT
	handler:  function() {
	    var me = this;

	    if (!me.menuPanel) {
		me.createMenuPanel();
	    }
	    me.menuPanel.showBy(me, 'tr-bc?');
	}
    },

    initialize: function() {
	var me = this;

        this.callParent();

	if (me.getPveStdMenu()) {
	    me.setIconCls('more');
	}

    }
});
Ext.define('PVE.ATitleBar', {
    extend: 'Ext.TitleBar',
    alias: ['widget.pveTitleBar'],

    config: {
	docked: 'top',
	pveReloadButton: true,
	pveBackButton: true,
	pveStdMenu: true // add 'Login' and 'Datacenter' to menu by default
    },

    initialize: function() {
	var me = this;

	me.callParent();

	var items = [];

	if (me.getPveBackButton()) {
	    items.push({
		align: 'left',
		iconCls: 'arrow_left',
		handler: function() {
		    PVE.Workspace.goBack();
		}
	    });
	}

	if (me.getPveReloadButton()) {
	    items.push({
		align: 'right',
		iconCls: 'refresh',
		handler: function() {
		    this.up('pvePage').reload();
		}
	    });
	}

	items.push({
	    xtype: 'pveMenuButton',
	    align: 'right',
	    pveStdMenu: me.getPveStdMenu()
	});

	me.setItems(items);
    }


});
Ext.define('PVE.Page', {
    extend: 'Ext.Container',
    alias: 'widget.pvePage',

    statics: {
	pathMatch: function(loc) {
	    throw "implement this in subclass";
	}
    },

   config: {
	layout: 'vbox',
	appUrl: undefined
   }
});

Ext.define('PVE.ErrorPage', {
    extend: 'Ext.Panel',

    config: {
	html: "no such page",
	padding: 10,
	layout: {
	    type: 'vbox',
	    pack: 'center',
	    align: 'stretch'
	},
	items: [
	    {
		xtype: 'pveTitleBar',
		pveReloadButton: false,
		title: gettext('Error')
	    }
	]
    }
});

Ext.define('PVE.Workspace', { statics: {
    // this class only contains static functions

    loginData: null, // Data from last login call

    appWindow: null,

    history: null,

    pages: [ 
	'PVE.LXCMigrate',
	'PVE.LXCSummary',
	'PVE.QemuMigrate',
	'PVE.QemuSummary',
	'PVE.NodeSummary', 
	'PVE.ClusterTaskList',
	'PVE.NodeTaskList',
	'PVE.TaskViewer',
	'PVE.Datacenter'
    ],

    setHistory: function(h) {
	PVE.Workspace.history = h;

	PVE.Workspace.history.setUpdateUrl(true);

	PVE.Workspace.loadPage(PVE.Workspace.history.getToken());
	PVE.Workspace.history.on('change', function(loc) {
	    PVE.Workspace.loadPage(loc);
	});
    },

    goBack: function() {
	var actions = PVE.Workspace.history.getActions(),
	    lastAction = actions[actions.length - 2];

	var url = '';
	if(lastAction) {
	    actions.pop();
	    url = lastAction.getUrl();
	}

	// use loadPage directly so we don't cause new additions to the history
	PVE.Workspace.loadPage(url);
    },

    __setAppWindow: function(comp, dir) {

	var old = PVE.Workspace.appWindow;

	PVE.Workspace.appWindow = comp;

	if (old) {
	    if (dir === 'noanim') {
		Ext.Viewport.setActiveItem(PVE.Workspace.appWindow);
	    } else {
		var anim = { type: 'slide', direction: dir || 'left' };
		Ext.Viewport.animateActiveItem(PVE.Workspace.appWindow, anim);
	    }
	    // remove old after anim (hack, because anim.after does not work in 2.3.1a)
	    Ext.Function.defer(function(){
		if (comp !== old) {
		    Ext.Viewport.remove(old);
		}
	    }, 500);
	} else {
	    Ext.Viewport.setActiveItem(PVE.Workspace.appWindow);
	}
    },

    updateLoginData: function(loginData) {
	PVE.Workspace.loginData = loginData;

	// also sets the cookie
	Proxmox.Utils.setAuthData(loginData);

	PVE.Workspace.gotoPage('');
    },

    showLogin: function() {
	Proxmox.Utils.authClear();
	Proxmox.UserName = null;
	PVE.Workspace.loginData = null;

	PVE.Workspace.gotoPage('');
    },

    gotoPage: function(loc) {
	var match;

	var old = PVE.Workspace.appWindow;

	if (old.getAppUrl) {
	    var old_loc = old.getAppUrl();
	    if (old_loc !== loc) {
		PVE.Workspace.history.add(Ext.create('Ext.app.Action', { url: loc }));
	    } else {
		PVE.Workspace.loadPage(loc);
	    }
	} else {
	    PVE.Workspace.history.add(Ext.create('Ext.app.Action', { url: loc }));
	}
    },

    loadPage: function(loc) {
	loc = loc || '';

	var comp;

	if (!Proxmox.Utils.authOK()) {
	    comp = Ext.create('PVE.Login', {});
	} else {
	    Ext.Array.each(PVE.Workspace.pages, function(p, index) {
		var c = Ext.ClassManager.get(p);
		var match = c.pathMatch(loc);
		if (match) {
		    comp = Ext.create(p, { appUrl: loc });
		    return false; // stop iteration
		}
	    });
	    if (!comp) {
		comp = Ext.create('PVE.ErrorPage', {});
	    }
	}
	
	PVE.Workspace.__setAppWindow(comp, 'noanim');
    },

    obj_to_kv: function(d, names) {
	var kv = [];
	var done = { digest: 1 };
	var pushItem = function(item) {
	    if (done[item.key]) return;
	    done[item.key] = 1;
	    if (item.value) kv.push(item);
	}

	var keys = Ext.Array.sort(Ext.Object.getKeys(d));
	Ext.Array.each(names, function(k) {
	    if (typeof(k) === 'object') {
		Ext.Array.each(keys, function(n) {
		    if (k.test(n)) {
			pushItem({ key: n, value: d[n] });
		    }
		});
	    } else {

		pushItem({ key: k, value: d[k] });
	    }
	});
	Ext.Array.each(keys, function(k) {
	    pushItem({ key: k, value: d[k] });
	});
	return kv;
    }

}});
Ext.define('PVE.form.NodeSelector', {
    extend: 'Ext.field.Select',
    alias: ['widget.pveNodeSelector'],

    config: {
	autoSelect: false,
	valueField: 'node',
	displayField: 'node',
	store: {
	    fields: [ 'node', 'cpu', 'maxcpu', 'mem', 'maxmem', 'uptime' ],
	    autoLoad: true,
	    proxy: {
		type: 'pve',
		url: '/api2/json/nodes'
	    },
	    sorters: [
		{
		    property : 'node',
		    direction: 'ASC'
		}
	    ]
	},
 	value: ''
    }
});
Ext.define('PVE.form.RealmSelector', {
    extend: 'Ext.field.Select',
    alias: ['widget.pveRealmSelector'],

    config: {
	autoSelect: false,
	valueField: 'realm',
	displayField: 'descr',
	store: { model: 'pve-domains' },
 	value: 'pam'
    },

    needOTP: function(realm) {
	var me = this;

	var realmstore = me.getStore();

	var rec = realmstore.findRecord('realm', realm);

	return rec && rec.data && rec.data.tfa ? rec.data.tfa : undefined;
    },

    initialize: function() {
	var me = this;

	me.callParent();
	
	var realmstore = me.getStore();

	realmstore.load({
	    callback: function(r, o, success) {
		if (success) {
		    var def = me.getValue();
		    if (!def || !realmstore.findRecord('realm', def)) {
			def = 'pam';
			Ext.each(r, function(record) {
			    if (record.get('default')) { 
				def = record.get('realm');
			    }
			});
		    }
		    if (def) {
			me.setValue(def);
		    }
		}
	    }
	});
    }
});
Ext.define('PVE.Login', {
    extend: 'Ext.form.Panel',
    alias: "widget.pveLogin",

    handleTFA: function(username, ticketResponse) {
	let me = this;
	let errlabel = me.down('#signInFailedLabel');

	// set auth cookie with half-loggedin ticket for TFA
	ticketResponse.LoggedOut = true;
	Proxmox.Utils.setAuthData(ticketResponse);

	if (Ext.isDefined(ticketResponse.U2FChallenge)) {
	    Ext.Msg.show({
		title: 'Error - U2F not implemented',
		message: 'The U2F two factor authentication is not yet implemented on mobile.',
		buttons: Ext.MessageBox.CANCEL,
	    });
	    errlabel.show();
	} else {

	    Ext.Msg.show({
		title: 'Two-Factor Authentication',
		message: 'Please enter your OTP verification code:',
		buttons: Ext.MessageBox.OKCANCEL,
		prompt: {
		    xtype: 'tfacode',
		},
		fn: function(buttonId, code) {
		    if (buttonId === "cancel") {
			Proxmox.LoggedOut = false;
			Proxmox.Utils.authClear();
		    } else {
			me.mask({
			    xtype: 'loadmask',
			    message: 'Loading...'
			});
			Proxmox.Utils.API2Request({
			    url: '/api2/extjs/access/tfa',
			    params: { response: code },
			    method: 'POST',
			    timeout: 5000, // it'll delay both success & failure
			    success: function(resp, opts) {
				me.unmask();
				// Fill in what we copy over from the 1st factor:
				let authdata = resp.result.data;
				authdata.CSRFPreventionToken = Proxmox.CSRFPreventionToken;
				authdata.username = username;
				// Finish login, sets real cookie and loads page
				PVE.Workspace.updateLoginData(authdata);
			    },
			    failure: function(resp, opts) {
				me.unmask();
				Proxmox.Utils.authClear();
				errlabel.show();
			    }
			});
		    }
		},
	    });
	}

    },

    config: {
	title: 'Login',
	padding: 10,
	appUrl: 'login',
	items: [
	    {
		xtype: 'image',
		src: '/pve2/images/proxmox_logo.png',
		height: 30,
		width: 209
	    },
	    {
	        xtype: 'fieldset',
	        title: 'Proxmox VE Login',
	        items: [
	            {
	                xtype: 'textfield',
	                placeHolder: gettext('User name'),
	                itemId: 'userNameTextField',
	                name: 'username',
	                required: true
	            },
	            {
	                xtype: 'passwordfield',
	                placeHolder: gettext('Password'),
	                itemId: 'passwordTextField',
	                name: 'password',
	                required: true
	            },
		    {
			xtype: 'pveRealmSelector',
	                itemId: 'realmSelectorField',
			name: 'realm',
		    }
	        ]
	    },
	    {
	        xtype: 'label',
                html: 'Login failed. Please enter the correct credentials.',
	        itemId: 'signInFailedLabel',
	        hidden: true,
	        hideAnimation: 'fadeOut',
	        showAnimation: 'fadeIn',
	        style: 'color:#990000;margin:5px 0px;'
	    },
	    {
	        xtype: 'button',
	        itemId: 'logInButton',
	        ui: 'action',
	        text: 'Log In',
		handler: function() {
		    var form = this.up('formpanel');

		    var usernameField = form.down('#userNameTextField'),
	                passwordField = form.down('#passwordTextField'),
		        realmField = form.down('#realmSelectorField'),
		        errlabel = form.down('#signInFailedLabel');

		    errlabel.hide();

		    var username = usernameField.getValue();
	            var password = passwordField.getValue();
	            var realm = realmField.getValue();

		    Proxmox.Utils.API2Request({
			url: '/access/ticket',
			method: 'POST',
			waitMsgTarget: form,
			params: { username: username, password: password, realm: realm },
			failure: function(response, options) {
			    errlabel.show();
			},
			success: function(response, options) {
			    passwordField.setValue('');

			    let data = response.result.data;
			    if (Ext.isDefined(data.NeedTFA)) {
				form.handleTFA(username, data);
			    } else {
				PVE.Workspace.updateLoginData(data);
			    }
			}
		    });
		}
	    }
	]
    }
});

Ext.define('PVE.field.TFACode', {
    extend: 'Ext.field.Text',
    xtype: 'tfacode',

    config: {
	component: {
	    type: 'number'
	},
	maxLength: 6,
	required: true,
    },
});
Ext.define('PVE.TaskListBase', {
    extend: 'PVE.Page',

    config: {
	baseUrl: undefined,
	items: [
	    {
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('node') + '/tasks/' + 
					       record.get('upid'));
		    }
		},
		itemTpl: [
		    '<div style="vertical-align: middle;">' +
		    '<span>{[this.desc(values)]}</span>',
		    '<span style=" font-size:small; float: right;">' +
		    '{starttime:date("M d H:i:s")} - {endtime:date("H:i:s")}' +
		    '</span></div>',
		    '<small>node: {node}<br /> Status: {[this.status(values)]}</small>',
		    {
			desc: function(values) {
			    return Proxmox.Utils.format_task_description(values.type, values.id);
			},
			status: function(values) {
			    return Ext.String.ellipsis(values.status, 160);
			}
		    }
		]
	    }
	]
    },

    reload: function() {
	var me = this;

	me.store.load();
    },

    initialize: function() {
	var me = this;

	me.store = Ext.create('Ext.data.Store', {
	    model: 'pve-tasks',
	    proxy: {
                type: 'pve',
		url: '/api2/json' + me.getBaseUrl()
	    },
	    sorters: [
		{
		    property : 'starttime',
		    direction: 'DESC'
		}
	    ]
	});

	var list = me.down('list');
	list.setStore(me.store);

	me.reload();
	
	this.callParent();
    }
});

Ext.define('PVE.ClusterTaskList', {
    extend: 'PVE.TaskListBase',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^tasks$/);
	}
    },

    config: {
	baseUrl: '/cluster/tasks'
    },

    initialize: function() {
	var me = this;

	me.down('titlebar').setTitle(gettext('Tasks') + ': ' + gettext('Cluster'));

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	this.callParent();
    }
});

Ext.define('PVE.NodeTaskList', {
    extend: 'PVE.TaskListBase',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/tasks$/);
	}
    },

    nodename: undefined,

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];

	me.setBaseUrl('/nodes/' + me.nodename + '/tasks');

	me.down('titlebar').setTitle(gettext('Tasks') + ': ' + me.nodename);

	this.callParent();
    }
});


Ext.define('PVE.TaskViewer', {
    extend: 'PVE.Page',
    alias: 'widget.pveTaskViewer',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/tasks\/([^\s\/]+)$/);
	}
    },

    nodename: undefined,
    upid: undefined,
    taskInfo: undefined,
    taskStatus: 'running', // assume running

    config: {
	items: [
	    { 
		xtype: 'pveTitleBar'
	    },
	    {
		itemId: 'taskStatus',
		xtype: 'component',
		styleHtmlContent: true,
		style: 'background-color:white;',
		data: [],
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tpl for=".">',
		    '<tr><td>{key}</td><td>{value}</td></tr>',
		    '</tpl>',
		    '</table>'
		]
 	    },
	    {
		xtype: 'component',
		cls: 'dark',
 		padding: 5,
		html: gettext('Log')
	    },
	    {
		itemId: 'taskLog',
		xtype: 'container',
		flex: 1,
		scrollable: 'both',
		styleHtmlContent: true,
		style: 'background-color:white;white-space: pre;font-family: Monospace;',
		data: {},
		tpl: '{text}'
	    }
	]
    },

    reloadLog: function() {
	var me = this;

	var logCmp = me.down('#taskLog');

	Proxmox.Utils.API2Request({
	    url: "/nodes/" + me.nodename + "/tasks/" + me.upid + "/log",
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;

		var text = '';
		Ext.Array.each(d, function(el) {
		    text += Ext.htmlEncode(el.t) + "\n";
		});
		logCmp.setData({ text: text });
	    },
	    failure: function(response) {
		logCmp.setData({ text: response.htmlStatus } );
	    }
	});
    },

    reload: function() {
	var me = this;

	var statusCmp = me.down('#taskStatus');
	var logCmp = me.down('#taskLog');

	Proxmox.Utils.API2Request({
	    url: "/nodes/" + me.nodename + "/tasks/" + me.upid + "/status",
	    method: 'GET',
	    success: function(response) {
		me.reloadLog();

		var d = response.result.data;
		var kv = [];

		kv.push({ key: gettext('Taskstatus'), value: d.status });
		kv.push({ key: gettext('Node'), value: d.node });
		kv.push({ key: gettext('User'), value: d.user });
		kv.push({ key: gettext('Starttime'), value: Proxmox.Utils.render_timestamp(d.starttime) });

		me.setMasked(false);
		statusCmp.setData(kv);
		if (d.status !== 'stopped') {
		    Ext.defer(me.reload, 2000, me);
		}
	    },
	    failure: function(response) {
		me.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	    }
	});
    },

   initialize: function() {
       var me = this;

       var match = me.self.pathMatch(me.getAppUrl());
       if (!match) {
	   throw "pathMatch failed";
       }

       me.nodename = match[1];
       me.upid = match[2];

       me.taskInfo = Proxmox.Utils.parse_task_upid(me.upid);

       me.down('titlebar').setTitle(me.taskInfo.desc);

       me.reload();

	this.callParent();
    }
});
Ext.define('PVE.ClusterInfo', {
    extend: 'Ext.Component',
    alias: 'widget.pveClusterInfo',

    config: {
	style: 'background-color: white;',
	styleHtmlContent: true,
	tpl: [
	    '<table style="margin-bottom:0px;">',
	    '<tr><td>Node:</td><td><b>{local_node}</large></b></tr>',
	    '<tpl if="cluster_name">',
	    '<tr><td>Cluster:</td><td>{cluster_name}</td></tr>',
	    '<tr><td>Members:</td><td>{nodes}</td></tr>',
	    '<tr><td>Quorate:</td><td>{quorate}</td></tr>',
	    '</tpl>',
	    '<tr><td>Version:</td><td>{version}</td></tr>',
	    '</table>',
	]
    },
});

Ext.define('PVE.Datacenter', {
    extend: 'PVE.Page',
    alias: 'widget.pveDatacenter',

    statics: {
	pathMatch: function(loc) {
	    if (loc === '') {
		return [''];
	    }
	}
    },

    config: {
	appUrl: '',
	items: [
	    {
		xtype: 'pveTitleBar',
		title: gettext('Datacenter'),
		pveBackButton: false
	    },
	    {
 		xtype: 'pveClusterInfo'
	    },
            {
                xtype: 'component',
                cls: 'dark',
		padding: 5,
 		html: gettext('Nodes')
            },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		sorters: 'name',
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('name'));
		    } 
		},
		itemTpl: '{name}' +
		    '<br><small>Online: {[Proxmox.Utils.format_boolean(values.online)]}</small>' +
		    '<br><small>Support: {[PVE.Utils.render_support_level(values.level)]}</small>'
	    }
	]	
    },

    reload: function() {
	var me = this;

	var ci = me.down('pveClusterInfo');

	me.setMasked(false);

	me.summary = {};

	Proxmox.Utils.API2Request({
	    url: '/version',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		me.summary.version = d.version;
		ci.setData(me.summary);
	    }
	});

	var list = me.down('list');

	Proxmox.Utils.API2Request({
	    url: '/cluster/status',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		list.setData(d.filter(function(el) { return (el.type === "node"); }));

		d.forEach(function(el) {
		    if (el.type === "node") {
			if (el.local) {
			    me.summary.local_node = el.name;
			}
		    } else if (el.type === "cluster") {
			me.summary.nodes = el.nodes;
			me.summary.quorate = Proxmox.Utils.format_boolean(el.quorate);
			me.summary.cluster_name = el.name;
		    }
		});

		ci.setData(me.summary);
	    },
	    failure: function(response) {
		me.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	    }
	});
    },

    initialize: function() {
	var me = this;

	me.down('pveMenuButton').setMenuItems([
	    {
		text: gettext('Tasks'),
		handler: function() {
		    PVE.Workspace.gotoPage('tasks');
		}
	    }
	]);

	me.reload();
    }

});

Ext.define('PVE.NodeInfo', {
    extend: 'Ext.Component',
    alias: 'widget.pveNodeInfo',

    config: {
	style: 'background-color: white;',
	styleHtmlContent: true,
	data: [],
	tpl: [
	    '<table style="margin-bottom:0px;">',
	    '<tr><td>Version:</td><td>{pveversion}</td></tr>',
	    '<tr><td>Memory:</td><td>{[this.meminfo(values)]}</td></tr>',
	    '<tr><td>CPU:</td><td>{[this.cpuinfo(values)]}</td></tr>',
	    '<tr><td>Uptime:</td><td>{[Proxmox.Utils.format_duration_long(values.uptime)]}</td></tr>',
	    '</table>',
	    {
		meminfo: function(values) {
		    var d = values.memory;
		    if (!d) {
			return '-';
		    }
		    return Proxmox.Utils.format_size(d.used || 0) + " of " + Proxmox.Utils.format_size(d.total);
		},
		cpuinfo: function(values) {
		    if (!values.cpuinfo) {
			return '-';
		    }
		    var per = values.cpu * 100;
		    return per.toFixed(2) + "% (" + values.cpuinfo.cpus + " CPUs)";
		}
	    }
	]
    },
});

Ext.define('PVE.NodeSummary', {
    extend: 'PVE.Page',
    alias: 'widget.pveNodeSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)$/);
	}
    },

    nodename: undefined,

    config: {
	items: [
	    { 
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'pveNodeInfo'
	    },
            {
                xtype: 'component',
                cls: 'dark',
		padding: 5,
 		html: gettext('Virtual machines')
            },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('nodename') + '/' + 
					       record.get('type') + '/' + record.get('vmid'));
		    } 
		},
		grouped: true,
		itemTpl: [
		    '{name}<br>',
		    '<small>',
		    'id: {vmid} ',
		    '<tpl if="uptime">',
		    'cpu: {[this.cpuinfo(values)]} ',
		    'mem: {[this.meminfo(values)]} ',
		    '</tpl>',
		    '</small>',
		    {
			meminfo: function(values) {
			    if (!values.uptime) {
				return '-';
			    }
			    return Proxmox.Utils.format_size(values.mem);
			},
			cpuinfo: function(values) {
			    if (!values.uptime) {
				return '-';
			    }
			    return (values.cpu*100).toFixed(1) + '%';
			}
		    }
		]
	    }
	]
    },

    reload: function() {
 	var me = this;

	var ni = me.down('pveNodeInfo');

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/status',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		if (d.pveversion) {
		    d.pveversion = d.pveversion.replace(/pve\-manager\//, '');
		}
		ni.setData(d);
	    }
	});


	var list = me.down('list');

	list.setMasked(false);

	var error_handler = function(response) {
	    list.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	};

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/lxc',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		d.nodename = me.nodename;
		d.forEach(function(el) { el.type = 'lxc'; el.nodename = me.nodename });
		me.store.each(function(rec) {
		    if (rec.get('type') === 'lxc') {
			rec.destroy();
		    }
		});
		me.store.add(d);
	    },
	    failure: error_handler
	});

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/qemu',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		d.forEach(function(el) { el.type = 'qemu'; el.nodename = me.nodename });
		me.store.each(function(rec) {
		    if (rec.get('type') === 'qemu') {
			rec.destroy();
		    }
		});
		me.store.add(d);
	    },
	    failure: error_handler
	});

    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];

	me.down('titlebar').setTitle(gettext('Node') + ': ' + me.nodename);

	me.down('pveMenuButton').setMenuItems([
	    {
		text: gettext('Tasks'),
		handler: function() {
		    PVE.Workspace.gotoPage('nodes/' + me.nodename + '/tasks');
		}
	    },
	]);

	me.store = Ext.create('Ext.data.Store', {
	    fields: [ 'name', 'vmid', 'nodename', 'type', 'memory', 'uptime', 'mem', 'maxmem', 'cpu', 'cpus'],
	    sorters: ['vmid'],
	    grouper: {
		groupFn: function(record) {
		    return record.get('type');
		}
	    },
	});

	var list = me.down('list');
	list.setStore(me.store);

	me.reload();

	this.callParent();
    }
});
Ext.define('PVE.MigrateBase', {
    extend: 'PVE.Page',

    nodename: undefined,
    vmid: undefined,
    vmtype: undefined, // qemu or lxc

    config: {
	items: [
	    {
		xtype: 'pveTitleBar',
		pveReloadButton: false
	    },
	    { 
		xtype: 'formpanel',
		flex: 1,
		padding: 10,
		items: [
		    {
			xtype: 'fieldset',
			items: [
			    {
				xtype: 'pveNodeSelector',
				placeHolder: gettext('Target node'),
				name: 'target',
				required: true,
			    },
			    {
				xtype: 'checkboxfield',
				name : 'online',
				checked: true,
				label: gettext('Online')
			    }
			]
		    },
		    {
			xtype: 'button',
			itemId: 'migrate',
			ui: 'action',
			text: gettext('Migrate')
		    }
		]
	    }
	]
    },

    initialize: function() {
	var me = this;

	var btn = me.down('#migrate');

	btn.setHandler(function() {
	    var form = this.up('formpanel');
	    var values = form.getValues();
	    
	    if (!values.target) {
		Ext.Msg.alert('Error', 'Please select a target node');
		return;
	    }

	    Proxmox.Utils.API2Request({
		params: { target: values.target, online: values.online ? 1 : 0 },
		url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid + "/migrate",
		method: 'POST',
		failure: function(response, opts) {
		    Ext.Msg.alert('Error', response.htmlStatus);
		},
		success: function(response, options) {
		    var upid = response.result.data;
		    var page = 'nodes/'  + me.nodename + '/tasks/' + upid;
		    PVE.Workspace.gotoPage(page);
		}
	    });
	});
    }
});

Ext.define('PVE.QemuMigrate', {
    extend: 'PVE.MigrateBase',

    vmtype: 'qemu',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/qemu\/(\d+)\/migrate$/);
	}
    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle(gettext('Migrate') + ': VM ' + me.vmid);

	this.callParent();
    }
});

Ext.define('PVE.LXCMigrate', {
    extend: 'PVE.MigrateBase',

    vmtype: 'lxc',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/lxc\/(\d+)\/migrate$/);
	}
    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle(gettext('Migrate') + ': CT ' + me.vmid);

	this.callParent();
    }
});
Ext.define('PVE.VMSummaryBase', {
    extend: 'PVE.Page',

    nodename: undefined,
    vmid: undefined,
    vmtype: undefined, // qemu or lxc

    // defines the key/value config keys do display
    config_keys: undefined,

    vm_command: function(cmd, params) {
	var me = this;

	Proxmox.Utils.API2Request({
	    params: params,
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/status/' + cmd,
	    method: 'POST',
	    success: function(response, opts) {
		var upid = response.result.data;
		var page = 'nodes/' + me.nodename + '/tasks/' + upid;
		PVE.Workspace.gotoPage(page);
	    },
	    failure: function(response, opts) {
		Ext.Msg.alert('Error', response.htmlStatus);
	    }
	});
    },

    config: {
	items: [
	    {
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'component',
		itemId: 'vmstatus',
		styleHtmlContent: true,
		style: 'background-color:white;',
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tr><td>Status:</td><td>{[this.status(values)]}</td></tr>',
		    '<tr><td>Memory:</td><td>{[this.meminfo(values)]}</td></tr>',
		    '<tr><td>CPU:</td><td>{[this.cpuinfo(values)]}</td></tr>',
		    '<tr><td>Uptime:</td><td>{[Proxmox.Utils.format_duration_long' +
			'(values.uptime)]}</td></tr>',
		    '</table>',
		    {
			meminfo: function(values) {
			    if (!Ext.isDefined(values.mem)) {
				return '-';
			    }
			    return Proxmox.Utils.format_size(values.mem || 0) + " of " +
				Proxmox.Utils.format_size(values.maxmem);
			},
			cpuinfo: function(values) {
			    if (!Ext.isDefined(values.cpu)) {
				return '-';
			    }
			    var per = values.cpu * 100;
			    return per.toFixed(2) + "% (" + values.cpus + " CPUs)";
			},
			status: function(values) {
			    return values.qmpstatus ? values.qmpstatus :
				values.status;
			}
		    }
		]
	    },
	    {
		xtype: 'component',
		cls: 'dark',
		padding: 5,
		html: gettext('Configuration')
	    },
	    {
		xtype: 'container',
		scrollable: 'both',
		flex: 1,
		styleHtmlContent: true,
		itemId: 'vmconfig',
		style: 'background-color:white;white-space:pre',
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tpl for=".">',
		    '<tr><td>{key}</td><td>{value}</td></tr>',
		    '</tpl>',
		    '</table>'
		]
	    }
	]
    },

    reload: function() {
	var me = this;

	var vm_stat = me.down('#vmstatus');

	var error_handler = function(response) {
	    me.setMasked({ xtype: 'loadmask', message: response.htmlStatus });
	};

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/status/current',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;

		me.render_menu(d);

		vm_stat.setData(d);
	    },
	    failure: error_handler
	});

	var vm_cfg = me.down('#vmconfig');

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/config',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		var kv = PVE.Workspace.obj_to_kv(d, me.config_keys);
		vm_cfg.setData(kv);
	    },
	    failure: error_handler
	});
    },

    render_menu: function(data) {
	var me = this;

	// use two item arrays for format reasons.
	// display start, stop and migrate by default
	var top_items = [
	    {
		text: gettext('Start'),
		handler: function() {
		    me.vm_command("start", {});
		}
	    },
	    {
		text: gettext('Stop'),
		handler: function() {
		    me.vm_command("stop", {});
		}
	    }
	];

	var bottom_items = [{
	    text: gettext('Migrate'),
	    handler: function() {
		PVE.Workspace.gotoPage('nodes/' + me.nodename + '/' + me.vmtype +
				       '/' + me.vmid +'/migrate');
	    }
	}];

	// use qmpstatus with qemu, as it's exacter
	var vm_status = (me.vmtype === 'qemu') ? data.qmpstatus : data.status;

	if(vm_status === 'running') {

	    top_items.push(
		{
		    text: gettext('Shutdown'),
		    handler: function() {
			me.vm_command("shutdown", {});
		    }
		},
		{
		    text: gettext('Suspend'),
		    handler: function() {
			me.vm_command("suspend", {});
		    }
		}
	    );

	    bottom_items.push({
		text: gettext('Console'),
		handler: function() {
		    var vmtype = me.vmtype === 'qemu' ? 'kvm' : me.vmtype;
		    PVE.Utils.openConsoleWindow('html5', vmtype, me.vmid,
						me.nodename);
		}
	    });

	    if(data.spice || me.vmtype==='lxc') {
		bottom_items.push({
		    text: gettext('Spice'),
		    handler: function() {
			var vmtype = me.vmtype === 'qemu' ? 'kvm' : me.vmtype;
			PVE.Utils.openConsoleWindow('vv', vmtype, me.vmid,
						    me.nodename);
		    }
		});
	    }

	} else if(vm_status === 'paused') {
	    top_items.push({
		text: gettext('Resume'),
		handler: function() {
		    me.vm_command("resume", {});
		}
	    });
	}

	// concat our item arrays and add them to the menu
	me.down('pveMenuButton').setMenuItems(top_items.concat(bottom_items));

    },

    initialize: function() {
	var me = this;

	me.reload();

	this.callParent();
    }
});
Ext.define('PVE.QemuSummary', {
    extend: 'PVE.VMSummaryBase',
    alias: 'widget.pveQemuSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/qemu\/(\d+)$/);
	}
    },

    vmtype: 'qemu',

    config_keys: [
	'name', 'memory', 'sockets', 'cores', 'ostype', 'bootdisk', /^net\d+/,
	/^ide\d+/, /^virtio\d+/, /^sata\d+/, /^scsi\d+/, /^unused\d+/
    ],

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle('VM: ' + me.vmid);

	this.callParent();
    }
});
Ext.define('PVE.LXCSummary', {
    extend: 'PVE.VMSummaryBase',
    alias: 'widget.pveLXCSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/lxc\/(\d+)$/);
	}
    },

    vmtype: 'lxc',

    config_keys: [
	'hostname','ostype', , 'memory', 'swap', 'cpulimit', 'cpuunits',
	/^net\d+/, 'rootfs', /^mp\d+/, 'nameserver', 'searchdomain','description'
    ],

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle('CT: ' + me.vmid);

	this.callParent();
    }
});
Ext.application({

    launch: function() {
	var me = this;

	PVE.Workspace.setHistory(me.getHistory());

	Ext.Ajax.on('requestexception', function(conn, response) {
	    if (response.status === 401) { 
		PVE.Workspace.showLogin();
	    }
	});
    }
});
