function urlEncode(object) {
    var i,value, params = [];

    for (i in object) {
	if (object.hasOwnProperty(i)) {
	    value = object[i];
	    if (value === undefined) value = '';
	    params.push(encodeURIComponent(i) + '=' + encodeURIComponent(String(value)));
	}
    }

    return params.join('&');
}

var msgtimeout;
var severities = {
    normal:  1,
    warning: 2,
    error:   3,
};

function showMsg(message, timeout, severity) {
    var status_bar = document.getElementById('status_bar');
    clearTimeout(msgtimeout);

    status_bar.classList.remove('normal');
    status_bar.classList.remove('warning');
    status_bar.classList.remove('error');

    status_bar.textContent = message;

    severity = severity || severities.normal;

    switch (severity) {
	case severities.normal: 
	    status_bar.classList.add('normal');
	    break;
	case severities.warning: 
	    status_bar.classList.add('warning');
	    break;
	case severities.error: 
	    status_bar.classList.add('error');
	    break;
	default:
	    throw "unknown severity";
    }

    status_bar.classList.add('open');

    if (timeout !== 0) {
	msgtimeout = setTimeout(hideMsg, timeout || 1500);
    }
}

function hideMsg() {
    clearTimeout(msgtimeout);
    status_bar.classList.remove('open');
}

function getQueryParameter(name) {
    var params = location.search.slice(1).split('&');
    var result = "";
    params.forEach(function(param) {
	var components = param.split('=');
	if (components[0] === name) {
	    result = components.slice(1).join('=');
	}
    });
    return result;
}

 
getcookie = key=>((new RegExp((key || '=')+'=(.*?); ','gm')).exec(document.cookie+'; ') ||['',null])[1]

function API2Request(reqOpts) {
    var me = this;

    reqOpts.method = reqOpts.method || 'GET';

    var xhr = new XMLHttpRequest();
 
    xhr.cors = true;
    xhr.useDefaultXhrHeader = false;
    xhr.withCredentials = true;

    xhr.onload = function() {
	var scope = reqOpts.scope || this;
	var result;
	var errmsg;

	if (xhr.readyState === 4) {
	    var ctype = xhr.getResponseHeader('Content-Type');
	    if (xhr.status === 200) {
		if (ctype.match(/application\/json;/)) {
		    result = JSON.parse(xhr.responseText);
		} else {
		    errmsg = 'got unexpected content type ' + ctype;
		}
	    } else {
		errmsg = 'Error ' + xhr.status + ': ' + xhr.statusText;
	    }
	} else {
	    errmsg = 'Connection error - server offline?';
	}

	if (errmsg !== undefined) {
	    if (reqOpts.failure) {
		reqOpts.failure.call(scope, errmsg);
	    }
	} else {
	    if (reqOpts.success) {
		reqOpts.success.call(scope, result);
	    }
	}
	if (reqOpts.callback) {
	    reqOpts.callback.call(scope, errmsg === undefined);
	}
    }

    var data = urlEncode(reqOpts.params || {});

    if (reqOpts.method === 'GET') {
	xhr.open(reqOpts.method, PVE.server + "/api2/json" + reqOpts.url + '?' + data);
    } else {
	xhr.open(reqOpts.method, PVE.server + "/api2/json" + reqOpts.url);
    }
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    if (reqOpts.method === 'POST' || reqOpts.method === 'PUT') {
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
 
	xhr.setRequestHeader('Authorization', 'PVEAuthCookie=' + decodeURIComponent(getcookie('PVEAuthCookie')));
	PVE.CSRFPreventionToken = decodeURIComponent(getcookie('CSRFPreventionToken'));

	xhr.setRequestHeader('CSRFPreventionToken', PVE.CSRFPreventionToken);
	xhr.send(data);
    } else if (reqOpts.method === 'GET') {
	xhr.send();
    } else {
	throw "unknown method";
    }
}

function getTerminalSettings() {
    var res = {};
    var settings = ['fontSize', 'fontFamily', 'letterSpacing', 'lineHeight'];
    if(localStorage) {
	settings.forEach(function(setting) {
	    var val = localStorage.getItem('pve-xterm-' + setting);
	    if (val !== undefined && val !== null) {
		res[setting] = val;
	    }
	});
    }
    return res;
}
