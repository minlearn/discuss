(() => {
  // core/util/logging.js
  var _logLevel = "warn";
  var Debug = () => {
  };
  var Info = () => {
  };
  var Warn = () => {
  };
  var Error2 = () => {
  };
  function initLogging(level) {
    if (typeof level === "undefined") {
      level = _logLevel;
    } else {
      _logLevel = level;
    }
    Debug = Info = Warn = Error2 = () => {
    };
    if (typeof window.console !== "undefined") {
      switch (level) {
        case "debug":
          Debug = console.debug.bind(window.console);
        case "info":
          Info = console.info.bind(window.console);
        case "warn":
          Warn = console.warn.bind(window.console);
        case "error":
          Error2 = console.error.bind(window.console);
        case "none":
          break;
        default:
          throw new window.Error("invalid logging type '" + level + "'");
      }
    }
  }
  initLogging();

  // app/localization.js
  var Localizer = class {
    constructor() {
      this.language = "en";
      this.dictionary = void 0;
    }
    setup(supportedLanguages) {
      this.language = "en";
      let userLanguages;
      if (typeof window.navigator.languages == "object") {
        userLanguages = window.navigator.languages;
      } else {
        userLanguages = [navigator.language || navigator.userLanguage];
      }
      for (let i = 0; i < userLanguages.length; i++) {
        const userLang = userLanguages[i].toLowerCase().replace("_", "-").split("-");
        if (userLang[0] === "en" && (userLang[1] === void 0 || userLang[1] === "us")) {
          return;
        }
        for (let j = 0; j < supportedLanguages.length; j++) {
          const supLang = supportedLanguages[j].toLowerCase().replace("_", "-").split("-");
          if (userLang[0] !== supLang[0]) {
            continue;
          }
          if (userLang[1] !== supLang[1]) {
            continue;
          }
          this.language = supportedLanguages[j];
          return;
        }
        for (let j = 0; j < supportedLanguages.length; j++) {
          const supLang = supportedLanguages[j].toLowerCase().replace("_", "-").split("-");
          if (userLang[0] !== supLang[0]) {
            continue;
          }
          if (supLang[1] !== void 0) {
            continue;
          }
          this.language = supportedLanguages[j];
          return;
        }
      }
    }
    get(id) {
      if (typeof this.dictionary !== "undefined" && this.dictionary[id]) {
        return this.dictionary[id];
      } else {
        return id;
      }
    }
    translateDOM() {
      const self = this;
      function process(elem, enabled) {
        function isAnyOf(searchElement, items) {
          return items.indexOf(searchElement) !== -1;
        }
        function translateString(str) {
          str = str.split("\n").map((s) => s.trim()).join(" ").trim();
          return self.get(str);
        }
        function translateAttribute(elem2, attr) {
          const str = translateString(elem2.getAttribute(attr));
          elem2.setAttribute(attr, str);
        }
        function translateTextNode(node) {
          const str = translateString(node.data);
          node.data = str;
        }
        if (elem.hasAttribute("translate")) {
          if (isAnyOf(elem.getAttribute("translate"), ["", "yes"])) {
            enabled = true;
          } else if (isAnyOf(elem.getAttribute("translate"), ["no"])) {
            enabled = false;
          }
        }
        if (enabled) {
          if (elem.hasAttribute("abbr") && elem.tagName === "TH") {
            translateAttribute(elem, "abbr");
          }
          if (elem.hasAttribute("alt") && isAnyOf(elem.tagName, ["AREA", "IMG", "INPUT"])) {
            translateAttribute(elem, "alt");
          }
          if (elem.hasAttribute("download") && isAnyOf(elem.tagName, ["A", "AREA"])) {
            translateAttribute(elem, "download");
          }
          if (elem.hasAttribute("label") && isAnyOf(elem.tagName, [
            "MENUITEM",
            "MENU",
            "OPTGROUP",
            "OPTION",
            "TRACK"
          ])) {
            translateAttribute(elem, "label");
          }
          if (elem.hasAttribute("placeholder") && isAnyOf(elem.tagName, ["INPUT", "TEXTAREA"])) {
            translateAttribute(elem, "placeholder");
          }
          if (elem.hasAttribute("title")) {
            translateAttribute(elem, "title");
          }
          if (elem.hasAttribute("value") && elem.tagName === "INPUT" && isAnyOf(elem.getAttribute("type"), ["reset", "button", "submit"])) {
            translateAttribute(elem, "value");
          }
        }
        for (let i = 0; i < elem.childNodes.length; i++) {
          const node = elem.childNodes[i];
          if (node.nodeType === node.ELEMENT_NODE) {
            process(node, enabled);
          } else if (node.nodeType === node.TEXT_NODE && enabled) {
            translateTextNode(node);
          }
        }
      }
      process(document.body, true);
    }
  };
  var l10n = new Localizer();
  var localization_default = l10n.get.bind(l10n);

  // core/util/browser.js
  var isTouchDevice = "ontouchstart" in document.documentElement || document.ontouchstart !== void 0 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  window.addEventListener("touchstart", function onFirstTouch() {
    isTouchDevice = true;
    window.removeEventListener("touchstart", onFirstTouch, false);
  }, false);
  var dragThreshold = 10 * (window.devicePixelRatio || 1);
  var _supportsCursorURIs = false;
  try {
    const target = document.createElement("canvas");
    target.style.cursor = 'url("data:image/x-icon;base64,AAACAAEACAgAAAIAAgA4AQAAFgAAACgAAAAIAAAAEAAAAAEAIAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAA==") 2 2, default';
    if (target.style.cursor.indexOf("url") === 0) {
      Info("Data URI scheme cursor supported");
      _supportsCursorURIs = true;
    } else {
      Warn("Data URI scheme cursor not supported");
    }
  } catch (exc) {
    Error2("Data URI scheme cursor test exception: " + exc);
  }
  var supportsCursorURIs = _supportsCursorURIs;
  var _hasScrollbarGutter = true;
  try {
    const container = document.createElement("div");
    container.style.visibility = "hidden";
    container.style.overflow = "scroll";
    document.body.appendChild(container);
    const child = document.createElement("div");
    container.appendChild(child);
    const scrollbarWidth = container.offsetWidth - child.offsetWidth;
    container.parentNode.removeChild(container);
    _hasScrollbarGutter = scrollbarWidth != 0;
  } catch (exc) {
    Error2("Scrollbar test exception: " + exc);
  }
  var hasScrollbarGutter = _hasScrollbarGutter;
  function isMac() {
    return !!/mac/i.exec(navigator.platform);
  }
  function isWindows() {
    return !!/win/i.exec(navigator.platform);
  }
  function isIOS() {
    return !!/ipad/i.exec(navigator.platform) || !!/iphone/i.exec(navigator.platform) || !!/ipod/i.exec(navigator.platform);
  }
  function isAndroid() {
    return !!navigator.userAgent.match("Android ");
  }
  function isChromeOS() {
    return !!navigator.userAgent.match(" CrOS ");
  }
  function isSafari() {
    return !!navigator.userAgent.match("Safari/...") && !navigator.userAgent.match("Chrome/...") && !navigator.userAgent.match("Chromium/...") && !navigator.userAgent.match("Epiphany/...");
  }

  // core/util/events.js
  function getPointerEvent(e2) {
    return e2.changedTouches ? e2.changedTouches[0] : e2.touches ? e2.touches[0] : e2;
  }
  function stopEvent(e2) {
    e2.stopPropagation();
    e2.preventDefault();
  }
  var _captureRecursion = false;
  var _elementForUnflushedEvents = null;
  document.captureElement = null;
  function _captureProxy(e2) {
    if (_captureRecursion)
      return;
    const newEv = new e2.constructor(e2.type, e2);
    _captureRecursion = true;
    if (document.captureElement) {
      document.captureElement.dispatchEvent(newEv);
    } else {
      _elementForUnflushedEvents.dispatchEvent(newEv);
    }
    _captureRecursion = false;
    e2.stopPropagation();
    if (newEv.defaultPrevented) {
      e2.preventDefault();
    }
    if (e2.type === "mouseup") {
      releaseCapture();
    }
  }
  function _capturedElemChanged() {
    const proxyElem = document.getElementById("noVNC_mouse_capture_elem");
    proxyElem.style.cursor = window.getComputedStyle(document.captureElement).cursor;
  }
  var _captureObserver = new MutationObserver(_capturedElemChanged);
  function setCapture(target) {
    if (target.setCapture) {
      target.setCapture();
      document.captureElement = target;
    } else {
      releaseCapture();
      let proxyElem = document.getElementById("noVNC_mouse_capture_elem");
      if (proxyElem === null) {
        proxyElem = document.createElement("div");
        proxyElem.id = "noVNC_mouse_capture_elem";
        proxyElem.style.position = "fixed";
        proxyElem.style.top = "0px";
        proxyElem.style.left = "0px";
        proxyElem.style.width = "100%";
        proxyElem.style.height = "100%";
        proxyElem.style.zIndex = 1e4;
        proxyElem.style.display = "none";
        document.body.appendChild(proxyElem);
        proxyElem.addEventListener("contextmenu", _captureProxy);
        proxyElem.addEventListener("mousemove", _captureProxy);
        proxyElem.addEventListener("mouseup", _captureProxy);
      }
      document.captureElement = target;
      _captureObserver.observe(target, {attributes: true});
      _capturedElemChanged();
      proxyElem.style.display = "";
      window.addEventListener("mousemove", _captureProxy);
      window.addEventListener("mouseup", _captureProxy);
    }
  }
  function releaseCapture() {
    if (document.releaseCapture) {
      document.releaseCapture();
      document.captureElement = null;
    } else {
      if (!document.captureElement) {
        return;
      }
      _elementForUnflushedEvents = document.captureElement;
      document.captureElement = null;
      _captureObserver.disconnect();
      const proxyElem = document.getElementById("noVNC_mouse_capture_elem");
      proxyElem.style.display = "none";
      window.removeEventListener("mousemove", _captureProxy);
      window.removeEventListener("mouseup", _captureProxy);
    }
  }

  // core/input/keysym.js
  var keysym_default = {
    XK_VoidSymbol: 16777215,
    XK_BackSpace: 65288,
    XK_Tab: 65289,
    XK_Linefeed: 65290,
    XK_Clear: 65291,
    XK_Return: 65293,
    XK_Pause: 65299,
    XK_Scroll_Lock: 65300,
    XK_Sys_Req: 65301,
    XK_Escape: 65307,
    XK_Delete: 65535,
    XK_Multi_key: 65312,
    XK_Codeinput: 65335,
    XK_SingleCandidate: 65340,
    XK_MultipleCandidate: 65341,
    XK_PreviousCandidate: 65342,
    XK_Kanji: 65313,
    XK_Muhenkan: 65314,
    XK_Henkan_Mode: 65315,
    XK_Henkan: 65315,
    XK_Romaji: 65316,
    XK_Hiragana: 65317,
    XK_Katakana: 65318,
    XK_Hiragana_Katakana: 65319,
    XK_Zenkaku: 65320,
    XK_Hankaku: 65321,
    XK_Zenkaku_Hankaku: 65322,
    XK_Touroku: 65323,
    XK_Massyo: 65324,
    XK_Kana_Lock: 65325,
    XK_Kana_Shift: 65326,
    XK_Eisu_Shift: 65327,
    XK_Eisu_toggle: 65328,
    XK_Kanji_Bangou: 65335,
    XK_Zen_Koho: 65341,
    XK_Mae_Koho: 65342,
    XK_Home: 65360,
    XK_Left: 65361,
    XK_Up: 65362,
    XK_Right: 65363,
    XK_Down: 65364,
    XK_Prior: 65365,
    XK_Page_Up: 65365,
    XK_Next: 65366,
    XK_Page_Down: 65366,
    XK_End: 65367,
    XK_Begin: 65368,
    XK_Select: 65376,
    XK_Print: 65377,
    XK_Execute: 65378,
    XK_Insert: 65379,
    XK_Undo: 65381,
    XK_Redo: 65382,
    XK_Menu: 65383,
    XK_Find: 65384,
    XK_Cancel: 65385,
    XK_Help: 65386,
    XK_Break: 65387,
    XK_Mode_switch: 65406,
    XK_script_switch: 65406,
    XK_Num_Lock: 65407,
    XK_KP_Space: 65408,
    XK_KP_Tab: 65417,
    XK_KP_Enter: 65421,
    XK_KP_F1: 65425,
    XK_KP_F2: 65426,
    XK_KP_F3: 65427,
    XK_KP_F4: 65428,
    XK_KP_Home: 65429,
    XK_KP_Left: 65430,
    XK_KP_Up: 65431,
    XK_KP_Right: 65432,
    XK_KP_Down: 65433,
    XK_KP_Prior: 65434,
    XK_KP_Page_Up: 65434,
    XK_KP_Next: 65435,
    XK_KP_Page_Down: 65435,
    XK_KP_End: 65436,
    XK_KP_Begin: 65437,
    XK_KP_Insert: 65438,
    XK_KP_Delete: 65439,
    XK_KP_Equal: 65469,
    XK_KP_Multiply: 65450,
    XK_KP_Add: 65451,
    XK_KP_Separator: 65452,
    XK_KP_Subtract: 65453,
    XK_KP_Decimal: 65454,
    XK_KP_Divide: 65455,
    XK_KP_0: 65456,
    XK_KP_1: 65457,
    XK_KP_2: 65458,
    XK_KP_3: 65459,
    XK_KP_4: 65460,
    XK_KP_5: 65461,
    XK_KP_6: 65462,
    XK_KP_7: 65463,
    XK_KP_8: 65464,
    XK_KP_9: 65465,
    XK_F1: 65470,
    XK_F2: 65471,
    XK_F3: 65472,
    XK_F4: 65473,
    XK_F5: 65474,
    XK_F6: 65475,
    XK_F7: 65476,
    XK_F8: 65477,
    XK_F9: 65478,
    XK_F10: 65479,
    XK_F11: 65480,
    XK_L1: 65480,
    XK_F12: 65481,
    XK_L2: 65481,
    XK_F13: 65482,
    XK_L3: 65482,
    XK_F14: 65483,
    XK_L4: 65483,
    XK_F15: 65484,
    XK_L5: 65484,
    XK_F16: 65485,
    XK_L6: 65485,
    XK_F17: 65486,
    XK_L7: 65486,
    XK_F18: 65487,
    XK_L8: 65487,
    XK_F19: 65488,
    XK_L9: 65488,
    XK_F20: 65489,
    XK_L10: 65489,
    XK_F21: 65490,
    XK_R1: 65490,
    XK_F22: 65491,
    XK_R2: 65491,
    XK_F23: 65492,
    XK_R3: 65492,
    XK_F24: 65493,
    XK_R4: 65493,
    XK_F25: 65494,
    XK_R5: 65494,
    XK_F26: 65495,
    XK_R6: 65495,
    XK_F27: 65496,
    XK_R7: 65496,
    XK_F28: 65497,
    XK_R8: 65497,
    XK_F29: 65498,
    XK_R9: 65498,
    XK_F30: 65499,
    XK_R10: 65499,
    XK_F31: 65500,
    XK_R11: 65500,
    XK_F32: 65501,
    XK_R12: 65501,
    XK_F33: 65502,
    XK_R13: 65502,
    XK_F34: 65503,
    XK_R14: 65503,
    XK_F35: 65504,
    XK_R15: 65504,
    XK_Shift_L: 65505,
    XK_Shift_R: 65506,
    XK_Control_L: 65507,
    XK_Control_R: 65508,
    XK_Caps_Lock: 65509,
    XK_Shift_Lock: 65510,
    XK_Meta_L: 65511,
    XK_Meta_R: 65512,
    XK_Alt_L: 65513,
    XK_Alt_R: 65514,
    XK_Super_L: 65515,
    XK_Super_R: 65516,
    XK_Hyper_L: 65517,
    XK_Hyper_R: 65518,
    XK_ISO_Level3_Shift: 65027,
    XK_ISO_Next_Group: 65032,
    XK_ISO_Prev_Group: 65034,
    XK_ISO_First_Group: 65036,
    XK_ISO_Last_Group: 65038,
    XK_space: 32,
    XK_exclam: 33,
    XK_quotedbl: 34,
    XK_numbersign: 35,
    XK_dollar: 36,
    XK_percent: 37,
    XK_ampersand: 38,
    XK_apostrophe: 39,
    XK_quoteright: 39,
    XK_parenleft: 40,
    XK_parenright: 41,
    XK_asterisk: 42,
    XK_plus: 43,
    XK_comma: 44,
    XK_minus: 45,
    XK_period: 46,
    XK_slash: 47,
    XK_0: 48,
    XK_1: 49,
    XK_2: 50,
    XK_3: 51,
    XK_4: 52,
    XK_5: 53,
    XK_6: 54,
    XK_7: 55,
    XK_8: 56,
    XK_9: 57,
    XK_colon: 58,
    XK_semicolon: 59,
    XK_less: 60,
    XK_equal: 61,
    XK_greater: 62,
    XK_question: 63,
    XK_at: 64,
    XK_A: 65,
    XK_B: 66,
    XK_C: 67,
    XK_D: 68,
    XK_E: 69,
    XK_F: 70,
    XK_G: 71,
    XK_H: 72,
    XK_I: 73,
    XK_J: 74,
    XK_K: 75,
    XK_L: 76,
    XK_M: 77,
    XK_N: 78,
    XK_O: 79,
    XK_P: 80,
    XK_Q: 81,
    XK_R: 82,
    XK_S: 83,
    XK_T: 84,
    XK_U: 85,
    XK_V: 86,
    XK_W: 87,
    XK_X: 88,
    XK_Y: 89,
    XK_Z: 90,
    XK_bracketleft: 91,
    XK_backslash: 92,
    XK_bracketright: 93,
    XK_asciicircum: 94,
    XK_underscore: 95,
    XK_grave: 96,
    XK_quoteleft: 96,
    XK_a: 97,
    XK_b: 98,
    XK_c: 99,
    XK_d: 100,
    XK_e: 101,
    XK_f: 102,
    XK_g: 103,
    XK_h: 104,
    XK_i: 105,
    XK_j: 106,
    XK_k: 107,
    XK_l: 108,
    XK_m: 109,
    XK_n: 110,
    XK_o: 111,
    XK_p: 112,
    XK_q: 113,
    XK_r: 114,
    XK_s: 115,
    XK_t: 116,
    XK_u: 117,
    XK_v: 118,
    XK_w: 119,
    XK_x: 120,
    XK_y: 121,
    XK_z: 122,
    XK_braceleft: 123,
    XK_bar: 124,
    XK_braceright: 125,
    XK_asciitilde: 126,
    XK_nobreakspace: 160,
    XK_exclamdown: 161,
    XK_cent: 162,
    XK_sterling: 163,
    XK_currency: 164,
    XK_yen: 165,
    XK_brokenbar: 166,
    XK_section: 167,
    XK_diaeresis: 168,
    XK_copyright: 169,
    XK_ordfeminine: 170,
    XK_guillemotleft: 171,
    XK_notsign: 172,
    XK_hyphen: 173,
    XK_registered: 174,
    XK_macron: 175,
    XK_degree: 176,
    XK_plusminus: 177,
    XK_twosuperior: 178,
    XK_threesuperior: 179,
    XK_acute: 180,
    XK_mu: 181,
    XK_paragraph: 182,
    XK_periodcentered: 183,
    XK_cedilla: 184,
    XK_onesuperior: 185,
    XK_masculine: 186,
    XK_guillemotright: 187,
    XK_onequarter: 188,
    XK_onehalf: 189,
    XK_threequarters: 190,
    XK_questiondown: 191,
    XK_Agrave: 192,
    XK_Aacute: 193,
    XK_Acircumflex: 194,
    XK_Atilde: 195,
    XK_Adiaeresis: 196,
    XK_Aring: 197,
    XK_AE: 198,
    XK_Ccedilla: 199,
    XK_Egrave: 200,
    XK_Eacute: 201,
    XK_Ecircumflex: 202,
    XK_Ediaeresis: 203,
    XK_Igrave: 204,
    XK_Iacute: 205,
    XK_Icircumflex: 206,
    XK_Idiaeresis: 207,
    XK_ETH: 208,
    XK_Eth: 208,
    XK_Ntilde: 209,
    XK_Ograve: 210,
    XK_Oacute: 211,
    XK_Ocircumflex: 212,
    XK_Otilde: 213,
    XK_Odiaeresis: 214,
    XK_multiply: 215,
    XK_Oslash: 216,
    XK_Ooblique: 216,
    XK_Ugrave: 217,
    XK_Uacute: 218,
    XK_Ucircumflex: 219,
    XK_Udiaeresis: 220,
    XK_Yacute: 221,
    XK_THORN: 222,
    XK_Thorn: 222,
    XK_ssharp: 223,
    XK_agrave: 224,
    XK_aacute: 225,
    XK_acircumflex: 226,
    XK_atilde: 227,
    XK_adiaeresis: 228,
    XK_aring: 229,
    XK_ae: 230,
    XK_ccedilla: 231,
    XK_egrave: 232,
    XK_eacute: 233,
    XK_ecircumflex: 234,
    XK_ediaeresis: 235,
    XK_igrave: 236,
    XK_iacute: 237,
    XK_icircumflex: 238,
    XK_idiaeresis: 239,
    XK_eth: 240,
    XK_ntilde: 241,
    XK_ograve: 242,
    XK_oacute: 243,
    XK_ocircumflex: 244,
    XK_otilde: 245,
    XK_odiaeresis: 246,
    XK_division: 247,
    XK_oslash: 248,
    XK_ooblique: 248,
    XK_ugrave: 249,
    XK_uacute: 250,
    XK_ucircumflex: 251,
    XK_udiaeresis: 252,
    XK_yacute: 253,
    XK_thorn: 254,
    XK_ydiaeresis: 255,
    XK_Hangul: 65329,
    XK_Hangul_Hanja: 65332,
    XK_Hangul_Jeonja: 65336,
    XF86XK_ModeLock: 269025025,
    XF86XK_MonBrightnessUp: 269025026,
    XF86XK_MonBrightnessDown: 269025027,
    XF86XK_KbdLightOnOff: 269025028,
    XF86XK_KbdBrightnessUp: 269025029,
    XF86XK_KbdBrightnessDown: 269025030,
    XF86XK_Standby: 269025040,
    XF86XK_AudioLowerVolume: 269025041,
    XF86XK_AudioMute: 269025042,
    XF86XK_AudioRaiseVolume: 269025043,
    XF86XK_AudioPlay: 269025044,
    XF86XK_AudioStop: 269025045,
    XF86XK_AudioPrev: 269025046,
    XF86XK_AudioNext: 269025047,
    XF86XK_HomePage: 269025048,
    XF86XK_Mail: 269025049,
    XF86XK_Start: 269025050,
    XF86XK_Search: 269025051,
    XF86XK_AudioRecord: 269025052,
    XF86XK_Calculator: 269025053,
    XF86XK_Memo: 269025054,
    XF86XK_ToDoList: 269025055,
    XF86XK_Calendar: 269025056,
    XF86XK_PowerDown: 269025057,
    XF86XK_ContrastAdjust: 269025058,
    XF86XK_RockerUp: 269025059,
    XF86XK_RockerDown: 269025060,
    XF86XK_RockerEnter: 269025061,
    XF86XK_Back: 269025062,
    XF86XK_Forward: 269025063,
    XF86XK_Stop: 269025064,
    XF86XK_Refresh: 269025065,
    XF86XK_PowerOff: 269025066,
    XF86XK_WakeUp: 269025067,
    XF86XK_Eject: 269025068,
    XF86XK_ScreenSaver: 269025069,
    XF86XK_WWW: 269025070,
    XF86XK_Sleep: 269025071,
    XF86XK_Favorites: 269025072,
    XF86XK_AudioPause: 269025073,
    XF86XK_AudioMedia: 269025074,
    XF86XK_MyComputer: 269025075,
    XF86XK_VendorHome: 269025076,
    XF86XK_LightBulb: 269025077,
    XF86XK_Shop: 269025078,
    XF86XK_History: 269025079,
    XF86XK_OpenURL: 269025080,
    XF86XK_AddFavorite: 269025081,
    XF86XK_HotLinks: 269025082,
    XF86XK_BrightnessAdjust: 269025083,
    XF86XK_Finance: 269025084,
    XF86XK_Community: 269025085,
    XF86XK_AudioRewind: 269025086,
    XF86XK_BackForward: 269025087,
    XF86XK_Launch0: 269025088,
    XF86XK_Launch1: 269025089,
    XF86XK_Launch2: 269025090,
    XF86XK_Launch3: 269025091,
    XF86XK_Launch4: 269025092,
    XF86XK_Launch5: 269025093,
    XF86XK_Launch6: 269025094,
    XF86XK_Launch7: 269025095,
    XF86XK_Launch8: 269025096,
    XF86XK_Launch9: 269025097,
    XF86XK_LaunchA: 269025098,
    XF86XK_LaunchB: 269025099,
    XF86XK_LaunchC: 269025100,
    XF86XK_LaunchD: 269025101,
    XF86XK_LaunchE: 269025102,
    XF86XK_LaunchF: 269025103,
    XF86XK_ApplicationLeft: 269025104,
    XF86XK_ApplicationRight: 269025105,
    XF86XK_Book: 269025106,
    XF86XK_CD: 269025107,
    XF86XK_Calculater: 269025108,
    XF86XK_Clear: 269025109,
    XF86XK_Close: 269025110,
    XF86XK_Copy: 269025111,
    XF86XK_Cut: 269025112,
    XF86XK_Display: 269025113,
    XF86XK_DOS: 269025114,
    XF86XK_Documents: 269025115,
    XF86XK_Excel: 269025116,
    XF86XK_Explorer: 269025117,
    XF86XK_Game: 269025118,
    XF86XK_Go: 269025119,
    XF86XK_iTouch: 269025120,
    XF86XK_LogOff: 269025121,
    XF86XK_Market: 269025122,
    XF86XK_Meeting: 269025123,
    XF86XK_MenuKB: 269025125,
    XF86XK_MenuPB: 269025126,
    XF86XK_MySites: 269025127,
    XF86XK_New: 269025128,
    XF86XK_News: 269025129,
    XF86XK_OfficeHome: 269025130,
    XF86XK_Open: 269025131,
    XF86XK_Option: 269025132,
    XF86XK_Paste: 269025133,
    XF86XK_Phone: 269025134,
    XF86XK_Q: 269025136,
    XF86XK_Reply: 269025138,
    XF86XK_Reload: 269025139,
    XF86XK_RotateWindows: 269025140,
    XF86XK_RotationPB: 269025141,
    XF86XK_RotationKB: 269025142,
    XF86XK_Save: 269025143,
    XF86XK_ScrollUp: 269025144,
    XF86XK_ScrollDown: 269025145,
    XF86XK_ScrollClick: 269025146,
    XF86XK_Send: 269025147,
    XF86XK_Spell: 269025148,
    XF86XK_SplitScreen: 269025149,
    XF86XK_Support: 269025150,
    XF86XK_TaskPane: 269025151,
    XF86XK_Terminal: 269025152,
    XF86XK_Tools: 269025153,
    XF86XK_Travel: 269025154,
    XF86XK_UserPB: 269025156,
    XF86XK_User1KB: 269025157,
    XF86XK_User2KB: 269025158,
    XF86XK_Video: 269025159,
    XF86XK_WheelButton: 269025160,
    XF86XK_Word: 269025161,
    XF86XK_Xfer: 269025162,
    XF86XK_ZoomIn: 269025163,
    XF86XK_ZoomOut: 269025164,
    XF86XK_Away: 269025165,
    XF86XK_Messenger: 269025166,
    XF86XK_WebCam: 269025167,
    XF86XK_MailForward: 269025168,
    XF86XK_Pictures: 269025169,
    XF86XK_Music: 269025170,
    XF86XK_Battery: 269025171,
    XF86XK_Bluetooth: 269025172,
    XF86XK_WLAN: 269025173,
    XF86XK_UWB: 269025174,
    XF86XK_AudioForward: 269025175,
    XF86XK_AudioRepeat: 269025176,
    XF86XK_AudioRandomPlay: 269025177,
    XF86XK_Subtitle: 269025178,
    XF86XK_AudioCycleTrack: 269025179,
    XF86XK_CycleAngle: 269025180,
    XF86XK_FrameBack: 269025181,
    XF86XK_FrameForward: 269025182,
    XF86XK_Time: 269025183,
    XF86XK_Select: 269025184,
    XF86XK_View: 269025185,
    XF86XK_TopMenu: 269025186,
    XF86XK_Red: 269025187,
    XF86XK_Green: 269025188,
    XF86XK_Yellow: 269025189,
    XF86XK_Blue: 269025190,
    XF86XK_Suspend: 269025191,
    XF86XK_Hibernate: 269025192,
    XF86XK_TouchpadToggle: 269025193,
    XF86XK_TouchpadOn: 269025200,
    XF86XK_TouchpadOff: 269025201,
    XF86XK_AudioMicMute: 269025202,
    XF86XK_Switch_VT_1: 269024769,
    XF86XK_Switch_VT_2: 269024770,
    XF86XK_Switch_VT_3: 269024771,
    XF86XK_Switch_VT_4: 269024772,
    XF86XK_Switch_VT_5: 269024773,
    XF86XK_Switch_VT_6: 269024774,
    XF86XK_Switch_VT_7: 269024775,
    XF86XK_Switch_VT_8: 269024776,
    XF86XK_Switch_VT_9: 269024777,
    XF86XK_Switch_VT_10: 269024778,
    XF86XK_Switch_VT_11: 269024779,
    XF86XK_Switch_VT_12: 269024780,
    XF86XK_Ungrab: 269024800,
    XF86XK_ClearGrab: 269024801,
    XF86XK_Next_VMode: 269024802,
    XF86XK_Prev_VMode: 269024803,
    XF86XK_LogWindowTree: 269024804,
    XF86XK_LogGrabInfo: 269024805
  };

  // core/input/keysymdef.js
  var codepoints = {
    256: 960,
    257: 992,
    258: 451,
    259: 483,
    260: 417,
    261: 433,
    262: 454,
    263: 486,
    264: 710,
    265: 742,
    266: 709,
    267: 741,
    268: 456,
    269: 488,
    270: 463,
    271: 495,
    272: 464,
    273: 496,
    274: 938,
    275: 954,
    278: 972,
    279: 1004,
    280: 458,
    281: 490,
    282: 460,
    283: 492,
    284: 728,
    285: 760,
    286: 683,
    287: 699,
    288: 725,
    289: 757,
    290: 939,
    291: 955,
    292: 678,
    293: 694,
    294: 673,
    295: 689,
    296: 933,
    297: 949,
    298: 975,
    299: 1007,
    302: 967,
    303: 999,
    304: 681,
    305: 697,
    308: 684,
    309: 700,
    310: 979,
    311: 1011,
    312: 930,
    313: 453,
    314: 485,
    315: 934,
    316: 950,
    317: 421,
    318: 437,
    321: 419,
    322: 435,
    323: 465,
    324: 497,
    325: 977,
    326: 1009,
    327: 466,
    328: 498,
    330: 957,
    331: 959,
    332: 978,
    333: 1010,
    336: 469,
    337: 501,
    338: 5052,
    339: 5053,
    340: 448,
    341: 480,
    342: 931,
    343: 947,
    344: 472,
    345: 504,
    346: 422,
    347: 438,
    348: 734,
    349: 766,
    350: 426,
    351: 442,
    352: 425,
    353: 441,
    354: 478,
    355: 510,
    356: 427,
    357: 443,
    358: 940,
    359: 956,
    360: 989,
    361: 1021,
    362: 990,
    363: 1022,
    364: 733,
    365: 765,
    366: 473,
    367: 505,
    368: 475,
    369: 507,
    370: 985,
    371: 1017,
    376: 5054,
    377: 428,
    378: 444,
    379: 431,
    380: 447,
    381: 430,
    382: 446,
    402: 2294,
    466: 16777681,
    711: 439,
    728: 418,
    729: 511,
    731: 434,
    733: 445,
    901: 1966,
    902: 1953,
    904: 1954,
    905: 1955,
    906: 1956,
    908: 1959,
    910: 1960,
    911: 1963,
    912: 1974,
    913: 1985,
    914: 1986,
    915: 1987,
    916: 1988,
    917: 1989,
    918: 1990,
    919: 1991,
    920: 1992,
    921: 1993,
    922: 1994,
    923: 1995,
    924: 1996,
    925: 1997,
    926: 1998,
    927: 1999,
    928: 2e3,
    929: 2001,
    931: 2002,
    932: 2004,
    933: 2005,
    934: 2006,
    935: 2007,
    936: 2008,
    937: 2009,
    938: 1957,
    939: 1961,
    940: 1969,
    941: 1970,
    942: 1971,
    943: 1972,
    944: 1978,
    945: 2017,
    946: 2018,
    947: 2019,
    948: 2020,
    949: 2021,
    950: 2022,
    951: 2023,
    952: 2024,
    953: 2025,
    954: 2026,
    955: 2027,
    956: 2028,
    957: 2029,
    958: 2030,
    959: 2031,
    960: 2032,
    961: 2033,
    962: 2035,
    963: 2034,
    964: 2036,
    965: 2037,
    966: 2038,
    967: 2039,
    968: 2040,
    969: 2041,
    970: 1973,
    971: 1977,
    972: 1975,
    973: 1976,
    974: 1979,
    1025: 1715,
    1026: 1713,
    1027: 1714,
    1028: 1716,
    1029: 1717,
    1030: 1718,
    1031: 1719,
    1032: 1720,
    1033: 1721,
    1034: 1722,
    1035: 1723,
    1036: 1724,
    1038: 1726,
    1039: 1727,
    1040: 1761,
    1041: 1762,
    1042: 1783,
    1043: 1767,
    1044: 1764,
    1045: 1765,
    1046: 1782,
    1047: 1786,
    1048: 1769,
    1049: 1770,
    1050: 1771,
    1051: 1772,
    1052: 1773,
    1053: 1774,
    1054: 1775,
    1055: 1776,
    1056: 1778,
    1057: 1779,
    1058: 1780,
    1059: 1781,
    1060: 1766,
    1061: 1768,
    1062: 1763,
    1063: 1790,
    1064: 1787,
    1065: 1789,
    1066: 1791,
    1067: 1785,
    1068: 1784,
    1069: 1788,
    1070: 1760,
    1071: 1777,
    1072: 1729,
    1073: 1730,
    1074: 1751,
    1075: 1735,
    1076: 1732,
    1077: 1733,
    1078: 1750,
    1079: 1754,
    1080: 1737,
    1081: 1738,
    1082: 1739,
    1083: 1740,
    1084: 1741,
    1085: 1742,
    1086: 1743,
    1087: 1744,
    1088: 1746,
    1089: 1747,
    1090: 1748,
    1091: 1749,
    1092: 1734,
    1093: 1736,
    1094: 1731,
    1095: 1758,
    1096: 1755,
    1097: 1757,
    1098: 1759,
    1099: 1753,
    1100: 1752,
    1101: 1756,
    1102: 1728,
    1103: 1745,
    1105: 1699,
    1106: 1697,
    1107: 1698,
    1108: 1700,
    1109: 1701,
    1110: 1702,
    1111: 1703,
    1112: 1704,
    1113: 1705,
    1114: 1706,
    1115: 1707,
    1116: 1708,
    1118: 1710,
    1119: 1711,
    1168: 1725,
    1169: 1709,
    1488: 3296,
    1489: 3297,
    1490: 3298,
    1491: 3299,
    1492: 3300,
    1493: 3301,
    1494: 3302,
    1495: 3303,
    1496: 3304,
    1497: 3305,
    1498: 3306,
    1499: 3307,
    1500: 3308,
    1501: 3309,
    1502: 3310,
    1503: 3311,
    1504: 3312,
    1505: 3313,
    1506: 3314,
    1507: 3315,
    1508: 3316,
    1509: 3317,
    1510: 3318,
    1511: 3319,
    1512: 3320,
    1513: 3321,
    1514: 3322,
    1548: 1452,
    1563: 1467,
    1567: 1471,
    1569: 1473,
    1570: 1474,
    1571: 1475,
    1572: 1476,
    1573: 1477,
    1574: 1478,
    1575: 1479,
    1576: 1480,
    1577: 1481,
    1578: 1482,
    1579: 1483,
    1580: 1484,
    1581: 1485,
    1582: 1486,
    1583: 1487,
    1584: 1488,
    1585: 1489,
    1586: 1490,
    1587: 1491,
    1588: 1492,
    1589: 1493,
    1590: 1494,
    1591: 1495,
    1592: 1496,
    1593: 1497,
    1594: 1498,
    1600: 1504,
    1601: 1505,
    1602: 1506,
    1603: 1507,
    1604: 1508,
    1605: 1509,
    1606: 1510,
    1607: 1511,
    1608: 1512,
    1609: 1513,
    1610: 1514,
    1611: 1515,
    1612: 1516,
    1613: 1517,
    1614: 1518,
    1615: 1519,
    1616: 1520,
    1617: 1521,
    1618: 1522,
    3585: 3489,
    3586: 3490,
    3587: 3491,
    3588: 3492,
    3589: 3493,
    3590: 3494,
    3591: 3495,
    3592: 3496,
    3593: 3497,
    3594: 3498,
    3595: 3499,
    3596: 3500,
    3597: 3501,
    3598: 3502,
    3599: 3503,
    3600: 3504,
    3601: 3505,
    3602: 3506,
    3603: 3507,
    3604: 3508,
    3605: 3509,
    3606: 3510,
    3607: 3511,
    3608: 3512,
    3609: 3513,
    3610: 3514,
    3611: 3515,
    3612: 3516,
    3613: 3517,
    3614: 3518,
    3615: 3519,
    3616: 3520,
    3617: 3521,
    3618: 3522,
    3619: 3523,
    3620: 3524,
    3621: 3525,
    3622: 3526,
    3623: 3527,
    3624: 3528,
    3625: 3529,
    3626: 3530,
    3627: 3531,
    3628: 3532,
    3629: 3533,
    3630: 3534,
    3631: 3535,
    3632: 3536,
    3633: 3537,
    3634: 3538,
    3635: 3539,
    3636: 3540,
    3637: 3541,
    3638: 3542,
    3639: 3543,
    3640: 3544,
    3641: 3545,
    3642: 3546,
    3647: 3551,
    3648: 3552,
    3649: 3553,
    3650: 3554,
    3651: 3555,
    3652: 3556,
    3653: 3557,
    3654: 3558,
    3655: 3559,
    3656: 3560,
    3657: 3561,
    3658: 3562,
    3659: 3563,
    3660: 3564,
    3661: 3565,
    3664: 3568,
    3665: 3569,
    3666: 3570,
    3667: 3571,
    3668: 3572,
    3669: 3573,
    3670: 3574,
    3671: 3575,
    3672: 3576,
    3673: 3577,
    8194: 2722,
    8195: 2721,
    8196: 2723,
    8197: 2724,
    8199: 2725,
    8200: 2726,
    8201: 2727,
    8202: 2728,
    8210: 2747,
    8211: 2730,
    8212: 2729,
    8213: 1967,
    8215: 3295,
    8216: 2768,
    8217: 2769,
    8218: 2813,
    8220: 2770,
    8221: 2771,
    8222: 2814,
    8224: 2801,
    8225: 2802,
    8226: 2790,
    8229: 2735,
    8230: 2734,
    8240: 2773,
    8242: 2774,
    8243: 2775,
    8248: 2812,
    8254: 1150,
    8361: 3839,
    8364: 8364,
    8453: 2744,
    8470: 1712,
    8471: 2811,
    8478: 2772,
    8482: 2761,
    8531: 2736,
    8532: 2737,
    8533: 2738,
    8534: 2739,
    8535: 2740,
    8536: 2741,
    8537: 2742,
    8538: 2743,
    8539: 2755,
    8540: 2756,
    8541: 2757,
    8542: 2758,
    8592: 2299,
    8593: 2300,
    8594: 2301,
    8595: 2302,
    8658: 2254,
    8660: 2253,
    8706: 2287,
    8711: 2245,
    8728: 3018,
    8730: 2262,
    8733: 2241,
    8734: 2242,
    8743: 2270,
    8744: 2271,
    8745: 2268,
    8746: 2269,
    8747: 2239,
    8756: 2240,
    8764: 2248,
    8771: 2249,
    8773: 16785992,
    8800: 2237,
    8801: 2255,
    8804: 2236,
    8805: 2238,
    8834: 2266,
    8835: 2267,
    8866: 3068,
    8867: 3036,
    8868: 3010,
    8869: 3022,
    8968: 3027,
    8970: 3012,
    8981: 2810,
    8992: 2212,
    8993: 2213,
    9109: 3020,
    9115: 2219,
    9117: 2220,
    9118: 2221,
    9120: 2222,
    9121: 2215,
    9123: 2216,
    9124: 2217,
    9126: 2218,
    9128: 2223,
    9132: 2224,
    9143: 2209,
    9146: 2543,
    9147: 2544,
    9148: 2546,
    9149: 2547,
    9225: 2530,
    9226: 2533,
    9227: 2537,
    9228: 2531,
    9229: 2532,
    9251: 2732,
    9252: 2536,
    9472: 2211,
    9474: 2214,
    9484: 2210,
    9488: 2539,
    9492: 2541,
    9496: 2538,
    9500: 2548,
    9508: 2549,
    9516: 2551,
    9524: 2550,
    9532: 2542,
    9618: 2529,
    9642: 2791,
    9643: 2785,
    9644: 2779,
    9645: 2786,
    9646: 2783,
    9647: 2767,
    9650: 2792,
    9651: 2787,
    9654: 2781,
    9655: 2765,
    9660: 2793,
    9661: 2788,
    9664: 2780,
    9665: 2764,
    9670: 2528,
    9675: 2766,
    9679: 2782,
    9702: 2784,
    9734: 2789,
    9742: 2809,
    9747: 2762,
    9756: 2794,
    9758: 2795,
    9792: 2808,
    9794: 2807,
    9827: 2796,
    9829: 2798,
    9830: 2797,
    9837: 2806,
    9839: 2805,
    10003: 2803,
    10007: 2804,
    10013: 2777,
    10016: 2800,
    10216: 2748,
    10217: 2750,
    12289: 1188,
    12290: 1185,
    12300: 1186,
    12301: 1187,
    12443: 1246,
    12444: 1247,
    12449: 1191,
    12450: 1201,
    12451: 1192,
    12452: 1202,
    12453: 1193,
    12454: 1203,
    12455: 1194,
    12456: 1204,
    12457: 1195,
    12458: 1205,
    12459: 1206,
    12461: 1207,
    12463: 1208,
    12465: 1209,
    12467: 1210,
    12469: 1211,
    12471: 1212,
    12473: 1213,
    12475: 1214,
    12477: 1215,
    12479: 1216,
    12481: 1217,
    12483: 1199,
    12484: 1218,
    12486: 1219,
    12488: 1220,
    12490: 1221,
    12491: 1222,
    12492: 1223,
    12493: 1224,
    12494: 1225,
    12495: 1226,
    12498: 1227,
    12501: 1228,
    12504: 1229,
    12507: 1230,
    12510: 1231,
    12511: 1232,
    12512: 1233,
    12513: 1234,
    12514: 1235,
    12515: 1196,
    12516: 1236,
    12517: 1197,
    12518: 1237,
    12519: 1198,
    12520: 1238,
    12521: 1239,
    12522: 1240,
    12523: 1241,
    12524: 1242,
    12525: 1243,
    12527: 1244,
    12530: 1190,
    12531: 1245,
    12539: 1189,
    12540: 1200
  };
  var keysymdef_default = {
    lookup(u) {
      if (u >= 32 && u <= 255) {
        return u;
      }
      const keysym = codepoints[u];
      if (keysym !== void 0) {
        return keysym;
      }
      return 16777216 | u;
    }
  };

  // core/input/vkeys.js
  var vkeys_default = {
    8: "Backspace",
    9: "Tab",
    10: "NumpadClear",
    13: "Enter",
    16: "ShiftLeft",
    17: "ControlLeft",
    18: "AltLeft",
    19: "Pause",
    20: "CapsLock",
    21: "Lang1",
    25: "Lang2",
    27: "Escape",
    28: "Convert",
    29: "NonConvert",
    32: "Space",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    41: "Select",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    47: "Help",
    48: "Digit0",
    49: "Digit1",
    50: "Digit2",
    51: "Digit3",
    52: "Digit4",
    53: "Digit5",
    54: "Digit6",
    55: "Digit7",
    56: "Digit8",
    57: "Digit9",
    91: "MetaLeft",
    92: "MetaRight",
    93: "ContextMenu",
    95: "Sleep",
    96: "Numpad0",
    97: "Numpad1",
    98: "Numpad2",
    99: "Numpad3",
    100: "Numpad4",
    101: "Numpad5",
    102: "Numpad6",
    103: "Numpad7",
    104: "Numpad8",
    105: "Numpad9",
    106: "NumpadMultiply",
    107: "NumpadAdd",
    108: "NumpadDecimal",
    109: "NumpadSubtract",
    110: "NumpadDecimal",
    111: "NumpadDivide",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",
    144: "NumLock",
    145: "ScrollLock",
    166: "BrowserBack",
    167: "BrowserForward",
    168: "BrowserRefresh",
    169: "BrowserStop",
    170: "BrowserSearch",
    171: "BrowserFavorites",
    172: "BrowserHome",
    173: "AudioVolumeMute",
    174: "AudioVolumeDown",
    175: "AudioVolumeUp",
    176: "MediaTrackNext",
    177: "MediaTrackPrevious",
    178: "MediaStop",
    179: "MediaPlayPause",
    180: "LaunchMail",
    181: "MediaSelect",
    182: "LaunchApp1",
    183: "LaunchApp2",
    225: "AltRight"
  };

  // core/input/fixedkeys.js
  var fixedkeys_default = {
    Backspace: "Backspace",
    AltLeft: "Alt",
    AltRight: "Alt",
    CapsLock: "CapsLock",
    ContextMenu: "ContextMenu",
    ControlLeft: "Control",
    ControlRight: "Control",
    Enter: "Enter",
    MetaLeft: "Meta",
    MetaRight: "Meta",
    ShiftLeft: "Shift",
    ShiftRight: "Shift",
    Tab: "Tab",
    Delete: "Delete",
    End: "End",
    Help: "Help",
    Home: "Home",
    Insert: "Insert",
    PageDown: "PageDown",
    PageUp: "PageUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowUp: "ArrowUp",
    NumLock: "NumLock",
    NumpadBackspace: "Backspace",
    NumpadClear: "Clear",
    Escape: "Escape",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F13: "F13",
    F14: "F14",
    F15: "F15",
    F16: "F16",
    F17: "F17",
    F18: "F18",
    F19: "F19",
    F20: "F20",
    F21: "F21",
    F22: "F22",
    F23: "F23",
    F24: "F24",
    F25: "F25",
    F26: "F26",
    F27: "F27",
    F28: "F28",
    F29: "F29",
    F30: "F30",
    F31: "F31",
    F32: "F32",
    F33: "F33",
    F34: "F34",
    F35: "F35",
    PrintScreen: "PrintScreen",
    ScrollLock: "ScrollLock",
    Pause: "Pause",
    BrowserBack: "BrowserBack",
    BrowserFavorites: "BrowserFavorites",
    BrowserForward: "BrowserForward",
    BrowserHome: "BrowserHome",
    BrowserRefresh: "BrowserRefresh",
    BrowserSearch: "BrowserSearch",
    BrowserStop: "BrowserStop",
    Eject: "Eject",
    LaunchApp1: "LaunchMyComputer",
    LaunchApp2: "LaunchCalendar",
    LaunchMail: "LaunchMail",
    MediaPlayPause: "MediaPlay",
    MediaStop: "MediaStop",
    MediaTrackNext: "MediaTrackNext",
    MediaTrackPrevious: "MediaTrackPrevious",
    Power: "Power",
    Sleep: "Sleep",
    AudioVolumeDown: "AudioVolumeDown",
    AudioVolumeMute: "AudioVolumeMute",
    AudioVolumeUp: "AudioVolumeUp",
    WakeUp: "WakeUp"
  };

  // core/input/domkeytable.js
  var DOMKeyTable = {};
  function addStandard(key, standard) {
    if (standard === void 0)
      throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable)
      throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [standard, standard, standard, standard];
  }
  function addLeftRight(key, left, right) {
    if (left === void 0)
      throw new Error('Undefined keysym for key "' + key + '"');
    if (right === void 0)
      throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable)
      throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [left, left, right, left];
  }
  function addNumpad(key, standard, numpad) {
    if (standard === void 0)
      throw new Error('Undefined keysym for key "' + key + '"');
    if (numpad === void 0)
      throw new Error('Undefined keysym for key "' + key + '"');
    if (key in DOMKeyTable)
      throw new Error('Duplicate entry for key "' + key + '"');
    DOMKeyTable[key] = [standard, standard, standard, numpad];
  }
  addLeftRight("Alt", keysym_default.XK_Alt_L, keysym_default.XK_Alt_R);
  addStandard("AltGraph", keysym_default.XK_ISO_Level3_Shift);
  addStandard("CapsLock", keysym_default.XK_Caps_Lock);
  addLeftRight("Control", keysym_default.XK_Control_L, keysym_default.XK_Control_R);
  addLeftRight("Meta", keysym_default.XK_Super_L, keysym_default.XK_Super_R);
  addStandard("NumLock", keysym_default.XK_Num_Lock);
  addStandard("ScrollLock", keysym_default.XK_Scroll_Lock);
  addLeftRight("Shift", keysym_default.XK_Shift_L, keysym_default.XK_Shift_R);
  addNumpad("Enter", keysym_default.XK_Return, keysym_default.XK_KP_Enter);
  addStandard("Tab", keysym_default.XK_Tab);
  addNumpad(" ", keysym_default.XK_space, keysym_default.XK_KP_Space);
  addNumpad("ArrowDown", keysym_default.XK_Down, keysym_default.XK_KP_Down);
  addNumpad("ArrowLeft", keysym_default.XK_Left, keysym_default.XK_KP_Left);
  addNumpad("ArrowRight", keysym_default.XK_Right, keysym_default.XK_KP_Right);
  addNumpad("ArrowUp", keysym_default.XK_Up, keysym_default.XK_KP_Up);
  addNumpad("End", keysym_default.XK_End, keysym_default.XK_KP_End);
  addNumpad("Home", keysym_default.XK_Home, keysym_default.XK_KP_Home);
  addNumpad("PageDown", keysym_default.XK_Next, keysym_default.XK_KP_Next);
  addNumpad("PageUp", keysym_default.XK_Prior, keysym_default.XK_KP_Prior);
  addStandard("Backspace", keysym_default.XK_BackSpace);
  addNumpad("Clear", keysym_default.XK_Clear, keysym_default.XK_KP_Begin);
  addStandard("Copy", keysym_default.XF86XK_Copy);
  addStandard("Cut", keysym_default.XF86XK_Cut);
  addNumpad("Delete", keysym_default.XK_Delete, keysym_default.XK_KP_Delete);
  addNumpad("Insert", keysym_default.XK_Insert, keysym_default.XK_KP_Insert);
  addStandard("Paste", keysym_default.XF86XK_Paste);
  addStandard("Redo", keysym_default.XK_Redo);
  addStandard("Undo", keysym_default.XK_Undo);
  addStandard("Cancel", keysym_default.XK_Cancel);
  addStandard("ContextMenu", keysym_default.XK_Menu);
  addStandard("Escape", keysym_default.XK_Escape);
  addStandard("Execute", keysym_default.XK_Execute);
  addStandard("Find", keysym_default.XK_Find);
  addStandard("Help", keysym_default.XK_Help);
  addStandard("Pause", keysym_default.XK_Pause);
  addStandard("Select", keysym_default.XK_Select);
  addStandard("ZoomIn", keysym_default.XF86XK_ZoomIn);
  addStandard("ZoomOut", keysym_default.XF86XK_ZoomOut);
  addStandard("BrightnessDown", keysym_default.XF86XK_MonBrightnessDown);
  addStandard("BrightnessUp", keysym_default.XF86XK_MonBrightnessUp);
  addStandard("Eject", keysym_default.XF86XK_Eject);
  addStandard("LogOff", keysym_default.XF86XK_LogOff);
  addStandard("Power", keysym_default.XF86XK_PowerOff);
  addStandard("PowerOff", keysym_default.XF86XK_PowerDown);
  addStandard("PrintScreen", keysym_default.XK_Print);
  addStandard("Hibernate", keysym_default.XF86XK_Hibernate);
  addStandard("Standby", keysym_default.XF86XK_Standby);
  addStandard("WakeUp", keysym_default.XF86XK_WakeUp);
  addStandard("AllCandidates", keysym_default.XK_MultipleCandidate);
  addStandard("Alphanumeric", keysym_default.XK_Eisu_toggle);
  addStandard("CodeInput", keysym_default.XK_Codeinput);
  addStandard("Compose", keysym_default.XK_Multi_key);
  addStandard("Convert", keysym_default.XK_Henkan);
  addStandard("GroupFirst", keysym_default.XK_ISO_First_Group);
  addStandard("GroupLast", keysym_default.XK_ISO_Last_Group);
  addStandard("GroupNext", keysym_default.XK_ISO_Next_Group);
  addStandard("GroupPrevious", keysym_default.XK_ISO_Prev_Group);
  addStandard("NonConvert", keysym_default.XK_Muhenkan);
  addStandard("PreviousCandidate", keysym_default.XK_PreviousCandidate);
  addStandard("SingleCandidate", keysym_default.XK_SingleCandidate);
  addStandard("HangulMode", keysym_default.XK_Hangul);
  addStandard("HanjaMode", keysym_default.XK_Hangul_Hanja);
  addStandard("JunjaMode", keysym_default.XK_Hangul_Jeonja);
  addStandard("Eisu", keysym_default.XK_Eisu_toggle);
  addStandard("Hankaku", keysym_default.XK_Hankaku);
  addStandard("Hiragana", keysym_default.XK_Hiragana);
  addStandard("HiraganaKatakana", keysym_default.XK_Hiragana_Katakana);
  addStandard("KanaMode", keysym_default.XK_Kana_Shift);
  addStandard("KanjiMode", keysym_default.XK_Kanji);
  addStandard("Katakana", keysym_default.XK_Katakana);
  addStandard("Romaji", keysym_default.XK_Romaji);
  addStandard("Zenkaku", keysym_default.XK_Zenkaku);
  addStandard("ZenkakuHankaku", keysym_default.XK_Zenkaku_Hankaku);
  addStandard("F1", keysym_default.XK_F1);
  addStandard("F2", keysym_default.XK_F2);
  addStandard("F3", keysym_default.XK_F3);
  addStandard("F4", keysym_default.XK_F4);
  addStandard("F5", keysym_default.XK_F5);
  addStandard("F6", keysym_default.XK_F6);
  addStandard("F7", keysym_default.XK_F7);
  addStandard("F8", keysym_default.XK_F8);
  addStandard("F9", keysym_default.XK_F9);
  addStandard("F10", keysym_default.XK_F10);
  addStandard("F11", keysym_default.XK_F11);
  addStandard("F12", keysym_default.XK_F12);
  addStandard("F13", keysym_default.XK_F13);
  addStandard("F14", keysym_default.XK_F14);
  addStandard("F15", keysym_default.XK_F15);
  addStandard("F16", keysym_default.XK_F16);
  addStandard("F17", keysym_default.XK_F17);
  addStandard("F18", keysym_default.XK_F18);
  addStandard("F19", keysym_default.XK_F19);
  addStandard("F20", keysym_default.XK_F20);
  addStandard("F21", keysym_default.XK_F21);
  addStandard("F22", keysym_default.XK_F22);
  addStandard("F23", keysym_default.XK_F23);
  addStandard("F24", keysym_default.XK_F24);
  addStandard("F25", keysym_default.XK_F25);
  addStandard("F26", keysym_default.XK_F26);
  addStandard("F27", keysym_default.XK_F27);
  addStandard("F28", keysym_default.XK_F28);
  addStandard("F29", keysym_default.XK_F29);
  addStandard("F30", keysym_default.XK_F30);
  addStandard("F31", keysym_default.XK_F31);
  addStandard("F32", keysym_default.XK_F32);
  addStandard("F33", keysym_default.XK_F33);
  addStandard("F34", keysym_default.XK_F34);
  addStandard("F35", keysym_default.XK_F35);
  addStandard("Close", keysym_default.XF86XK_Close);
  addStandard("MailForward", keysym_default.XF86XK_MailForward);
  addStandard("MailReply", keysym_default.XF86XK_Reply);
  addStandard("MailSend", keysym_default.XF86XK_Send);
  addStandard("MediaFastForward", keysym_default.XF86XK_AudioForward);
  addStandard("MediaPause", keysym_default.XF86XK_AudioPause);
  addStandard("MediaPlay", keysym_default.XF86XK_AudioPlay);
  addStandard("MediaRecord", keysym_default.XF86XK_AudioRecord);
  addStandard("MediaRewind", keysym_default.XF86XK_AudioRewind);
  addStandard("MediaStop", keysym_default.XF86XK_AudioStop);
  addStandard("MediaTrackNext", keysym_default.XF86XK_AudioNext);
  addStandard("MediaTrackPrevious", keysym_default.XF86XK_AudioPrev);
  addStandard("New", keysym_default.XF86XK_New);
  addStandard("Open", keysym_default.XF86XK_Open);
  addStandard("Print", keysym_default.XK_Print);
  addStandard("Save", keysym_default.XF86XK_Save);
  addStandard("SpellCheck", keysym_default.XF86XK_Spell);
  addStandard("AudioVolumeDown", keysym_default.XF86XK_AudioLowerVolume);
  addStandard("AudioVolumeUp", keysym_default.XF86XK_AudioRaiseVolume);
  addStandard("AudioVolumeMute", keysym_default.XF86XK_AudioMute);
  addStandard("MicrophoneVolumeMute", keysym_default.XF86XK_AudioMicMute);
  addStandard("LaunchApplication1", keysym_default.XF86XK_MyComputer);
  addStandard("LaunchApplication2", keysym_default.XF86XK_Calculator);
  addStandard("LaunchCalendar", keysym_default.XF86XK_Calendar);
  addStandard("LaunchMail", keysym_default.XF86XK_Mail);
  addStandard("LaunchMediaPlayer", keysym_default.XF86XK_AudioMedia);
  addStandard("LaunchMusicPlayer", keysym_default.XF86XK_Music);
  addStandard("LaunchPhone", keysym_default.XF86XK_Phone);
  addStandard("LaunchScreenSaver", keysym_default.XF86XK_ScreenSaver);
  addStandard("LaunchSpreadsheet", keysym_default.XF86XK_Excel);
  addStandard("LaunchWebBrowser", keysym_default.XF86XK_WWW);
  addStandard("LaunchWebCam", keysym_default.XF86XK_WebCam);
  addStandard("LaunchWordProcessor", keysym_default.XF86XK_Word);
  addStandard("BrowserBack", keysym_default.XF86XK_Back);
  addStandard("BrowserFavorites", keysym_default.XF86XK_Favorites);
  addStandard("BrowserForward", keysym_default.XF86XK_Forward);
  addStandard("BrowserHome", keysym_default.XF86XK_HomePage);
  addStandard("BrowserRefresh", keysym_default.XF86XK_Refresh);
  addStandard("BrowserSearch", keysym_default.XF86XK_Search);
  addStandard("BrowserStop", keysym_default.XF86XK_Stop);
  addStandard("Dimmer", keysym_default.XF86XK_BrightnessAdjust);
  addStandard("MediaAudioTrack", keysym_default.XF86XK_AudioCycleTrack);
  addStandard("RandomToggle", keysym_default.XF86XK_AudioRandomPlay);
  addStandard("SplitScreenToggle", keysym_default.XF86XK_SplitScreen);
  addStandard("Subtitle", keysym_default.XF86XK_Subtitle);
  addStandard("VideoModeNext", keysym_default.XF86XK_Next_VMode);
  addNumpad("=", keysym_default.XK_equal, keysym_default.XK_KP_Equal);
  addNumpad("+", keysym_default.XK_plus, keysym_default.XK_KP_Add);
  addNumpad("-", keysym_default.XK_minus, keysym_default.XK_KP_Subtract);
  addNumpad("*", keysym_default.XK_asterisk, keysym_default.XK_KP_Multiply);
  addNumpad("/", keysym_default.XK_slash, keysym_default.XK_KP_Divide);
  addNumpad(".", keysym_default.XK_period, keysym_default.XK_KP_Decimal);
  addNumpad(",", keysym_default.XK_comma, keysym_default.XK_KP_Separator);
  addNumpad("0", keysym_default.XK_0, keysym_default.XK_KP_0);
  addNumpad("1", keysym_default.XK_1, keysym_default.XK_KP_1);
  addNumpad("2", keysym_default.XK_2, keysym_default.XK_KP_2);
  addNumpad("3", keysym_default.XK_3, keysym_default.XK_KP_3);
  addNumpad("4", keysym_default.XK_4, keysym_default.XK_KP_4);
  addNumpad("5", keysym_default.XK_5, keysym_default.XK_KP_5);
  addNumpad("6", keysym_default.XK_6, keysym_default.XK_KP_6);
  addNumpad("7", keysym_default.XK_7, keysym_default.XK_KP_7);
  addNumpad("8", keysym_default.XK_8, keysym_default.XK_KP_8);
  addNumpad("9", keysym_default.XK_9, keysym_default.XK_KP_9);
  var domkeytable_default = DOMKeyTable;

  // core/input/util.js
  function getKeycode(evt) {
    if (evt.code) {
      switch (evt.code) {
        case "OSLeft":
          return "MetaLeft";
        case "OSRight":
          return "MetaRight";
      }
      return evt.code;
    }
    if (evt.keyCode in vkeys_default) {
      let code = vkeys_default[evt.keyCode];
      if (isMac() && code === "ContextMenu") {
        code = "MetaRight";
      }
      if (evt.location === 2) {
        switch (code) {
          case "ShiftLeft":
            return "ShiftRight";
          case "ControlLeft":
            return "ControlRight";
          case "AltLeft":
            return "AltRight";
        }
      }
      if (evt.location === 3) {
        switch (code) {
          case "Delete":
            return "NumpadDecimal";
          case "Insert":
            return "Numpad0";
          case "End":
            return "Numpad1";
          case "ArrowDown":
            return "Numpad2";
          case "PageDown":
            return "Numpad3";
          case "ArrowLeft":
            return "Numpad4";
          case "ArrowRight":
            return "Numpad6";
          case "Home":
            return "Numpad7";
          case "ArrowUp":
            return "Numpad8";
          case "PageUp":
            return "Numpad9";
          case "Enter":
            return "NumpadEnter";
        }
      }
      return code;
    }
    return "Unidentified";
  }
  function getKey(evt) {
    if (evt.key !== void 0) {
      switch (evt.key) {
        case "OS":
          return "Meta";
        case "LaunchMyComputer":
          return "LaunchApplication1";
        case "LaunchCalculator":
          return "LaunchApplication2";
      }
      switch (evt.key) {
        case "UIKeyInputUpArrow":
          return "ArrowUp";
        case "UIKeyInputDownArrow":
          return "ArrowDown";
        case "UIKeyInputLeftArrow":
          return "ArrowLeft";
        case "UIKeyInputRightArrow":
          return "ArrowRight";
        case "UIKeyInputEscape":
          return "Escape";
      }
      if (evt.key === "\0" && evt.code === "NumpadDecimal") {
        return "Delete";
      }
      return evt.key;
    }
    const code = getKeycode(evt);
    if (code in fixedkeys_default) {
      return fixedkeys_default[code];
    }
    if (evt.charCode) {
      return String.fromCharCode(evt.charCode);
    }
    return "Unidentified";
  }
  function getKeysym(evt) {
    const key = getKey(evt);
    if (key === "Unidentified") {
      return null;
    }
    if (key in domkeytable_default) {
      let location2 = evt.location;
      if (key === "Meta" && location2 === 0) {
        location2 = 2;
      }
      if (key === "Clear" && location2 === 3) {
        let code = getKeycode(evt);
        if (code === "NumLock") {
          location2 = 0;
        }
      }
      if (location2 === void 0 || location2 > 3) {
        location2 = 0;
      }
      if (key === "Meta") {
        let code = getKeycode(evt);
        if (code === "AltLeft") {
          return keysym_default.XK_Meta_L;
        } else if (code === "AltRight") {
          return keysym_default.XK_Meta_R;
        }
      }
      if (key === "Clear") {
        let code = getKeycode(evt);
        if (code === "NumLock") {
          return keysym_default.XK_Num_Lock;
        }
      }
      if (isWindows()) {
        switch (key) {
          case "Zenkaku":
          case "Hankaku":
            return keysym_default.XK_Zenkaku_Hankaku;
          case "Romaji":
          case "KanaMode":
            return keysym_default.XK_Romaji;
        }
      }
      return domkeytable_default[key][location2];
    }
    if (key.length !== 1) {
      return null;
    }
    const codepoint = key.charCodeAt();
    if (codepoint) {
      return keysymdef_default.lookup(codepoint);
    }
    return null;
  }

  // core/input/keyboard.js
  var Keyboard = class {
    constructor(target) {
      this._target = target || null;
      this._keyDownList = {};
      this._altGrArmed = false;
      this._eventHandlers = {
        keyup: this._handleKeyUp.bind(this),
        keydown: this._handleKeyDown.bind(this),
        blur: this._allKeysUp.bind(this)
      };
      this.onkeyevent = () => {
      };
    }
    _sendKeyEvent(keysym, code, down) {
      if (down) {
        this._keyDownList[code] = keysym;
      } else {
        if (!(code in this._keyDownList)) {
          return;
        }
        delete this._keyDownList[code];
      }
      Debug("onkeyevent " + (down ? "down" : "up") + ", keysym: " + keysym, ", code: " + code);
      this.onkeyevent(keysym, code, down);
    }
    _getKeyCode(e2) {
      const code = getKeycode(e2);
      if (code !== "Unidentified") {
        return code;
      }
      if (e2.keyCode) {
        if (e2.keyCode !== 229) {
          return "Platform" + e2.keyCode;
        }
      }
      if (e2.keyIdentifier) {
        if (e2.keyIdentifier.substr(0, 2) !== "U+") {
          return e2.keyIdentifier;
        }
        const codepoint = parseInt(e2.keyIdentifier.substr(2), 16);
        const char = String.fromCharCode(codepoint).toUpperCase();
        return "Platform" + char.charCodeAt();
      }
      return "Unidentified";
    }
    _handleKeyDown(e2) {
      const code = this._getKeyCode(e2);
      let keysym = getKeysym(e2);
      if (this._altGrArmed) {
        this._altGrArmed = false;
        clearTimeout(this._altGrTimeout);
        if (code === "AltRight" && e2.timeStamp - this._altGrCtrlTime < 50) {
          keysym = keysym_default.XK_ISO_Level3_Shift;
        } else {
          this._sendKeyEvent(keysym_default.XK_Control_L, "ControlLeft", true);
        }
      }
      if (code === "Unidentified") {
        if (keysym) {
          this._sendKeyEvent(keysym, code, true);
          this._sendKeyEvent(keysym, code, false);
        }
        stopEvent(e2);
        return;
      }
      if (isMac() || isIOS()) {
        switch (keysym) {
          case keysym_default.XK_Super_L:
            keysym = keysym_default.XK_Alt_L;
            break;
          case keysym_default.XK_Super_R:
            keysym = keysym_default.XK_Super_L;
            break;
          case keysym_default.XK_Alt_L:
            keysym = keysym_default.XK_Mode_switch;
            break;
          case keysym_default.XK_Alt_R:
            keysym = keysym_default.XK_ISO_Level3_Shift;
            break;
        }
      }
      if (code in this._keyDownList) {
        keysym = this._keyDownList[code];
      }
      if ((isMac() || isIOS()) && (e2.metaKey && code !== "MetaLeft" && code !== "MetaRight")) {
        this._sendKeyEvent(keysym, code, true);
        this._sendKeyEvent(keysym, code, false);
        stopEvent(e2);
        return;
      }
      if ((isMac() || isIOS()) && code === "CapsLock") {
        this._sendKeyEvent(keysym_default.XK_Caps_Lock, "CapsLock", true);
        this._sendKeyEvent(keysym_default.XK_Caps_Lock, "CapsLock", false);
        stopEvent(e2);
        return;
      }
      const jpBadKeys = [
        keysym_default.XK_Zenkaku_Hankaku,
        keysym_default.XK_Eisu_toggle,
        keysym_default.XK_Katakana,
        keysym_default.XK_Hiragana,
        keysym_default.XK_Romaji
      ];
      if (isWindows() && jpBadKeys.includes(keysym)) {
        this._sendKeyEvent(keysym, code, true);
        this._sendKeyEvent(keysym, code, false);
        stopEvent(e2);
        return;
      }
      stopEvent(e2);
      if (code === "ControlLeft" && isWindows() && !("ControlLeft" in this._keyDownList)) {
        this._altGrArmed = true;
        this._altGrTimeout = setTimeout(this._handleAltGrTimeout.bind(this), 100);
        this._altGrCtrlTime = e2.timeStamp;
        return;
      }
      this._sendKeyEvent(keysym, code, true);
    }
    _handleKeyUp(e2) {
      stopEvent(e2);
      const code = this._getKeyCode(e2);
      if (this._altGrArmed) {
        this._altGrArmed = false;
        clearTimeout(this._altGrTimeout);
        this._sendKeyEvent(keysym_default.XK_Control_L, "ControlLeft", true);
      }
      if ((isMac() || isIOS()) && code === "CapsLock") {
        this._sendKeyEvent(keysym_default.XK_Caps_Lock, "CapsLock", true);
        this._sendKeyEvent(keysym_default.XK_Caps_Lock, "CapsLock", false);
        return;
      }
      this._sendKeyEvent(this._keyDownList[code], code, false);
      if (isWindows() && (code === "ShiftLeft" || code === "ShiftRight")) {
        if ("ShiftRight" in this._keyDownList) {
          this._sendKeyEvent(this._keyDownList["ShiftRight"], "ShiftRight", false);
        }
        if ("ShiftLeft" in this._keyDownList) {
          this._sendKeyEvent(this._keyDownList["ShiftLeft"], "ShiftLeft", false);
        }
      }
    }
    _handleAltGrTimeout() {
      this._altGrArmed = false;
      clearTimeout(this._altGrTimeout);
      this._sendKeyEvent(keysym_default.XK_Control_L, "ControlLeft", true);
    }
    _allKeysUp() {
      Debug(">> Keyboard.allKeysUp");
      for (let code in this._keyDownList) {
        this._sendKeyEvent(this._keyDownList[code], code, false);
      }
      Debug("<< Keyboard.allKeysUp");
    }
    grab() {
      this._target.addEventListener("keydown", this._eventHandlers.keydown);
      this._target.addEventListener("keyup", this._eventHandlers.keyup);
      window.addEventListener("blur", this._eventHandlers.blur);
    }
    ungrab() {
      this._target.removeEventListener("keydown", this._eventHandlers.keydown);
      this._target.removeEventListener("keyup", this._eventHandlers.keyup);
      window.removeEventListener("blur", this._eventHandlers.blur);
      this._allKeysUp();
    }
  };
  var keyboard_default = Keyboard;

  // core/util/int.js
  function toUnsigned32bit(toConvert) {
    return toConvert >>> 0;
  }
  function toSigned32bit(toConvert) {
    return toConvert | 0;
  }

  // core/util/strings.js
  function decodeUTF8(utf8string, allowLatin1 = false) {
    try {
      return decodeURIComponent(escape(utf8string));
    } catch (e2) {
      if (e2 instanceof URIError) {
        if (allowLatin1) {
          return utf8string;
        }
      }
      throw e2;
    }
  }
  function encodeUTF8(DOMString) {
    return unescape(encodeURIComponent(DOMString));
  }

  // core/util/element.js
  function clientToElement(x, y, elem) {
    const bounds = elem.getBoundingClientRect();
    let pos = {x: 0, y: 0};
    if (x < bounds.left) {
      pos.x = 0;
    } else if (x >= bounds.right) {
      pos.x = bounds.width - 1;
    } else {
      pos.x = x - bounds.left;
    }
    if (y < bounds.top) {
      pos.y = 0;
    } else if (y >= bounds.bottom) {
      pos.y = bounds.height - 1;
    } else {
      pos.y = y - bounds.top;
    }
    return pos;
  }

  // core/util/eventtarget.js
  var EventTargetMixin = class {
    constructor() {
      this._listeners = new Map();
    }
    addEventListener(type, callback) {
      if (!this._listeners.has(type)) {
        this._listeners.set(type, new Set());
      }
      this._listeners.get(type).add(callback);
    }
    removeEventListener(type, callback) {
      if (this._listeners.has(type)) {
        this._listeners.get(type).delete(callback);
      }
    }
    dispatchEvent(event) {
      if (!this._listeners.has(event.type)) {
        return true;
      }
      this._listeners.get(event.type).forEach((callback) => callback.call(this, event));
      return !event.defaultPrevented;
    }
  };
  var eventtarget_default = EventTargetMixin;

  // core/base64.js
  var base64_default = {
    toBase64Table: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(""),
    base64Pad: "=",
    encode(data) {
      "use strict";
      let result = "";
      const length = data.length;
      const lengthpad = length % 3;
      for (let i = 0; i < length - 2; i += 3) {
        result += this.toBase64Table[data[i] >> 2];
        result += this.toBase64Table[((data[i] & 3) << 4) + (data[i + 1] >> 4)];
        result += this.toBase64Table[((data[i + 1] & 15) << 2) + (data[i + 2] >> 6)];
        result += this.toBase64Table[data[i + 2] & 63];
      }
      const j = length - lengthpad;
      if (lengthpad === 2) {
        result += this.toBase64Table[data[j] >> 2];
        result += this.toBase64Table[((data[j] & 3) << 4) + (data[j + 1] >> 4)];
        result += this.toBase64Table[(data[j + 1] & 15) << 2];
        result += this.toBase64Table[64];
      } else if (lengthpad === 1) {
        result += this.toBase64Table[data[j] >> 2];
        result += this.toBase64Table[(data[j] & 3) << 4];
        result += this.toBase64Table[64];
        result += this.toBase64Table[64];
      }
      return result;
    },
    toBinaryTable: [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      62,
      -1,
      -1,
      -1,
      63,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      -1,
      -1,
      -1,
      0,
      -1,
      -1,
      -1,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      -1,
      -1,
      -1,
      -1,
      -1
    ],
    decode(data, offset = 0) {
      let dataLength = data.indexOf("=") - offset;
      if (dataLength < 0) {
        dataLength = data.length - offset;
      }
      const resultLength = (dataLength >> 2) * 3 + Math.floor(dataLength % 4 / 1.5);
      const result = new Array(resultLength);
      let leftbits = 0;
      let leftdata = 0;
      for (let idx = 0, i = offset; i < data.length; i++) {
        const c2 = this.toBinaryTable[data.charCodeAt(i) & 127];
        const padding = data.charAt(i) === this.base64Pad;
        if (c2 === -1) {
          Error2("Illegal character code " + data.charCodeAt(i) + " at position " + i);
          continue;
        }
        leftdata = leftdata << 6 | c2;
        leftbits += 6;
        if (leftbits >= 8) {
          leftbits -= 8;
          if (!padding) {
            result[idx++] = leftdata >> leftbits & 255;
          }
          leftdata &= (1 << leftbits) - 1;
        }
      }
      if (leftbits) {
        const err2 = new Error("Corrupted base64 string");
        err2.name = "Base64-Error";
        throw err2;
      }
      return result;
    }
  };

  // core/display.js
  var Display = class {
    constructor(target) {
      this._drawCtx = null;
      this._renderQ = [];
      this._flushing = false;
      this._fbWidth = 0;
      this._fbHeight = 0;
      this._prevDrawStyle = "";
      Debug(">> Display.constructor");
      this._target = target;
      if (!this._target) {
        throw new Error("Target must be set");
      }
      if (typeof this._target === "string") {
        throw new Error("target must be a DOM element");
      }
      if (!this._target.getContext) {
        throw new Error("no getContext method");
      }
      this._targetCtx = this._target.getContext("2d");
      this._viewportLoc = {x: 0, y: 0, w: this._target.width, h: this._target.height};
      this._backbuffer = document.createElement("canvas");
      this._drawCtx = this._backbuffer.getContext("2d");
      this._damageBounds = {
        left: 0,
        top: 0,
        right: this._backbuffer.width,
        bottom: this._backbuffer.height
      };
      Debug("User Agent: " + navigator.userAgent);
      Debug("<< Display.constructor");
      this._scale = 1;
      this._clipViewport = false;
      this.onflush = () => {
      };
    }
    get scale() {
      return this._scale;
    }
    set scale(scale) {
      this._rescale(scale);
    }
    get clipViewport() {
      return this._clipViewport;
    }
    set clipViewport(viewport) {
      this._clipViewport = viewport;
      const vp = this._viewportLoc;
      this.viewportChangeSize(vp.w, vp.h);
      this.viewportChangePos(0, 0);
    }
    get width() {
      return this._fbWidth;
    }
    get height() {
      return this._fbHeight;
    }
    viewportChangePos(deltaX, deltaY) {
      const vp = this._viewportLoc;
      deltaX = Math.floor(deltaX);
      deltaY = Math.floor(deltaY);
      if (!this._clipViewport) {
        deltaX = -vp.w;
        deltaY = -vp.h;
      }
      const vx2 = vp.x + vp.w - 1;
      const vy2 = vp.y + vp.h - 1;
      if (deltaX < 0 && vp.x + deltaX < 0) {
        deltaX = -vp.x;
      }
      if (vx2 + deltaX >= this._fbWidth) {
        deltaX -= vx2 + deltaX - this._fbWidth + 1;
      }
      if (vp.y + deltaY < 0) {
        deltaY = -vp.y;
      }
      if (vy2 + deltaY >= this._fbHeight) {
        deltaY -= vy2 + deltaY - this._fbHeight + 1;
      }
      if (deltaX === 0 && deltaY === 0) {
        return;
      }
      Debug("viewportChange deltaX: " + deltaX + ", deltaY: " + deltaY);
      vp.x += deltaX;
      vp.y += deltaY;
      this._damage(vp.x, vp.y, vp.w, vp.h);
      this.flip();
    }
    viewportChangeSize(width, height) {
      if (!this._clipViewport || typeof width === "undefined" || typeof height === "undefined") {
        Debug("Setting viewport to full display region");
        width = this._fbWidth;
        height = this._fbHeight;
      }
      width = Math.floor(width);
      height = Math.floor(height);
      if (width > this._fbWidth) {
        width = this._fbWidth;
      }
      if (height > this._fbHeight) {
        height = this._fbHeight;
      }
      const vp = this._viewportLoc;
      if (vp.w !== width || vp.h !== height) {
        vp.w = width;
        vp.h = height;
        const canvas = this._target;
        canvas.width = width;
        canvas.height = height;
        this.viewportChangePos(0, 0);
        this._damage(vp.x, vp.y, vp.w, vp.h);
        this.flip();
        this._rescale(this._scale);
      }
    }
    absX(x) {
      if (this._scale === 0) {
        return 0;
      }
      return toSigned32bit(x / this._scale + this._viewportLoc.x);
    }
    absY(y) {
      if (this._scale === 0) {
        return 0;
      }
      return toSigned32bit(y / this._scale + this._viewportLoc.y);
    }
    resize(width, height) {
      this._prevDrawStyle = "";
      this._fbWidth = width;
      this._fbHeight = height;
      const canvas = this._backbuffer;
      if (canvas.width !== width || canvas.height !== height) {
        let saveImg = null;
        if (canvas.width > 0 && canvas.height > 0) {
          saveImg = this._drawCtx.getImageData(0, 0, canvas.width, canvas.height);
        }
        if (canvas.width !== width) {
          canvas.width = width;
        }
        if (canvas.height !== height) {
          canvas.height = height;
        }
        if (saveImg) {
          this._drawCtx.putImageData(saveImg, 0, 0);
        }
      }
      const vp = this._viewportLoc;
      this.viewportChangeSize(vp.w, vp.h);
      this.viewportChangePos(0, 0);
    }
    getImageData() {
      return this._drawCtx.getImageData(0, 0, this.width, this.height);
    }
    toDataURL(type, encoderOptions) {
      return this._backbuffer.toDataURL(type, encoderOptions);
    }
    toBlob(callback, type, quality) {
      return this._backbuffer.toBlob(callback, type, quality);
    }
    _damage(x, y, w, h) {
      if (x < this._damageBounds.left) {
        this._damageBounds.left = x;
      }
      if (y < this._damageBounds.top) {
        this._damageBounds.top = y;
      }
      if (x + w > this._damageBounds.right) {
        this._damageBounds.right = x + w;
      }
      if (y + h > this._damageBounds.bottom) {
        this._damageBounds.bottom = y + h;
      }
    }
    flip(fromQueue) {
      if (this._renderQ.length !== 0 && !fromQueue) {
        this._renderQPush({
          type: "flip"
        });
      } else {
        let x = this._damageBounds.left;
        let y = this._damageBounds.top;
        let w = this._damageBounds.right - x;
        let h = this._damageBounds.bottom - y;
        let vx = x - this._viewportLoc.x;
        let vy = y - this._viewportLoc.y;
        if (vx < 0) {
          w += vx;
          x -= vx;
          vx = 0;
        }
        if (vy < 0) {
          h += vy;
          y -= vy;
          vy = 0;
        }
        if (vx + w > this._viewportLoc.w) {
          w = this._viewportLoc.w - vx;
        }
        if (vy + h > this._viewportLoc.h) {
          h = this._viewportLoc.h - vy;
        }
        if (w > 0 && h > 0) {
          this._targetCtx.drawImage(this._backbuffer, x, y, w, h, vx, vy, w, h);
        }
        this._damageBounds.left = this._damageBounds.top = 65535;
        this._damageBounds.right = this._damageBounds.bottom = 0;
      }
    }
    pending() {
      return this._renderQ.length > 0;
    }
    flush() {
      if (this._renderQ.length === 0) {
        this.onflush();
      } else {
        this._flushing = true;
      }
    }
    fillRect(x, y, width, height, color, fromQueue) {
      if (this._renderQ.length !== 0 && !fromQueue) {
        this._renderQPush({
          type: "fill",
          x,
          y,
          width,
          height,
          color
        });
      } else {
        this._setFillColor(color);
        this._drawCtx.fillRect(x, y, width, height);
        this._damage(x, y, width, height);
      }
    }
    copyImage(oldX, oldY, newX, newY, w, h, fromQueue) {
      if (this._renderQ.length !== 0 && !fromQueue) {
        this._renderQPush({
          type: "copy",
          oldX,
          oldY,
          x: newX,
          y: newY,
          width: w,
          height: h
        });
      } else {
        this._drawCtx.mozImageSmoothingEnabled = false;
        this._drawCtx.webkitImageSmoothingEnabled = false;
        this._drawCtx.msImageSmoothingEnabled = false;
        this._drawCtx.imageSmoothingEnabled = false;
        this._drawCtx.drawImage(this._backbuffer, oldX, oldY, w, h, newX, newY, w, h);
        this._damage(newX, newY, w, h);
      }
    }
    imageRect(x, y, width, height, mime, arr) {
      if (width === 0 || height === 0) {
        return;
      }
      const img = new Image();
      img.src = "data: " + mime + ";base64," + base64_default.encode(arr);
      this._renderQPush({
        type: "img",
        img,
        x,
        y,
        width,
        height
      });
    }
    blitImage(x, y, width, height, arr, offset, fromQueue) {
      if (this._renderQ.length !== 0 && !fromQueue) {
        const newArr = new Uint8Array(width * height * 4);
        newArr.set(new Uint8Array(arr.buffer, 0, newArr.length));
        this._renderQPush({
          type: "blit",
          data: newArr,
          x,
          y,
          width,
          height
        });
      } else {
        let data = new Uint8ClampedArray(arr.buffer, arr.byteOffset + offset, width * height * 4);
        let img = new ImageData(data, width, height);
        this._drawCtx.putImageData(img, x, y);
        this._damage(x, y, width, height);
      }
    }
    drawImage(img, x, y) {
      this._drawCtx.drawImage(img, x, y);
      this._damage(x, y, img.width, img.height);
    }
    autoscale(containerWidth, containerHeight) {
      let scaleRatio;
      if (containerWidth === 0 || containerHeight === 0) {
        scaleRatio = 0;
      } else {
        const vp = this._viewportLoc;
        const targetAspectRatio = containerWidth / containerHeight;
        const fbAspectRatio = vp.w / vp.h;
        if (fbAspectRatio >= targetAspectRatio) {
          scaleRatio = containerWidth / vp.w;
        } else {
          scaleRatio = containerHeight / vp.h;
        }
      }
      this._rescale(scaleRatio);
    }
    _rescale(factor) {
      this._scale = factor;
      const vp = this._viewportLoc;
      const width = factor * vp.w + "px";
      const height = factor * vp.h + "px";
      if (this._target.style.width !== width || this._target.style.height !== height) {
        this._target.style.width = width;
        this._target.style.height = height;
      }
    }
    _setFillColor(color) {
      const newStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      if (newStyle !== this._prevDrawStyle) {
        this._drawCtx.fillStyle = newStyle;
        this._prevDrawStyle = newStyle;
      }
    }
    _renderQPush(action) {
      this._renderQ.push(action);
      if (this._renderQ.length === 1) {
        this._scanRenderQ();
      }
    }
    _resumeRenderQ() {
      this.removeEventListener("load", this._noVNCDisplay._resumeRenderQ);
      this._noVNCDisplay._scanRenderQ();
    }
    _scanRenderQ() {
      let ready = true;
      while (ready && this._renderQ.length > 0) {
        const a2 = this._renderQ[0];
        switch (a2.type) {
          case "flip":
            this.flip(true);
            break;
          case "copy":
            this.copyImage(a2.oldX, a2.oldY, a2.x, a2.y, a2.width, a2.height, true);
            break;
          case "fill":
            this.fillRect(a2.x, a2.y, a2.width, a2.height, a2.color, true);
            break;
          case "blit":
            this.blitImage(a2.x, a2.y, a2.width, a2.height, a2.data, 0, true);
            break;
          case "img":
            if (a2.img.complete) {
              if (a2.img.width !== a2.width || a2.img.height !== a2.height) {
                Error2("Decoded image has incorrect dimensions. Got " + a2.img.width + "x" + a2.img.height + ". Expected " + a2.width + "x" + a2.height + ".");
                return;
              }
              this.drawImage(a2.img, a2.x, a2.y);
            } else {
              a2.img._noVNCDisplay = this;
              a2.img.addEventListener("load", this._resumeRenderQ);
              ready = false;
            }
            break;
        }
        if (ready) {
          this._renderQ.shift();
        }
      }
      if (this._renderQ.length === 0 && this._flushing) {
        this._flushing = false;
        this.onflush();
      }
    }
  };
  var display_default = Display;

  // vendor/pako/lib/utils/common.js
  function arraySet(dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  }
  var Buf8 = Uint8Array;
  var Buf16 = Uint16Array;
  var Buf32 = Int32Array;

  // vendor/pako/lib/zlib/adler32.js
  function adler32(adler, buf, len, pos) {
    var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  }

  // vendor/pako/lib/zlib/crc32.js
  function makeTable() {
    var c2, table = [];
    for (var n = 0; n < 256; n++) {
      c2 = n;
      for (var k = 0; k < 8; k++) {
        c2 = c2 & 1 ? 3988292384 ^ c2 >>> 1 : c2 >>> 1;
      }
      table[n] = c2;
    }
    return table;
  }
  var crcTable = makeTable();

  // vendor/pako/lib/zlib/inffast.js
  var BAD = 30;
  var TYPE = 12;
  function inflate_fast(strm, start) {
    var state;
    var _in;
    var last;
    var _out;
    var beg;
    var end;
    var dmax;
    var wsize;
    var whave;
    var wnext;
    var s_window;
    var hold;
    var bits;
    var lcode;
    var dcode;
    var lmask;
    var dmask;
    var here;
    var op;
    var len;
    var dist;
    var from;
    var from_source;
    var input, output;
    state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  }

  // vendor/pako/lib/zlib/inftrees.js
  var MAXBITS = 15;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var lbase = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ];
  var lext = [
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ];
  var dbase = [
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ];
  var dext = [
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    var len = 0;
    var sym = 0;
    var min = 0, max = 0;
    var root = 0;
    var curr = 0;
    var drop = 0;
    var left = 0;
    var used = 0;
    var huff = 0;
    var incr;
    var fill;
    var low;
    var mask;
    var next;
    var base = null;
    var base_index = 0;
    var end;
    var count = new Buf16(MAXBITS + 1);
    var offs = new Buf16(MAXBITS + 1);
    var extra = null;
    var extra_index = 0;
    var here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES) {
      base = extra = work;
      end = 19;
    } else if (type === LENS) {
      base = lbase;
      base_index -= 257;
      extra = lext;
      extra_index -= 257;
      end = 256;
    } else {
      base = dbase;
      extra = dext;
      end = -1;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] < end) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] > end) {
        here_op = extra[extra_index + work[sym]];
        here_val = base[base_index + work[sym]];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  }

  // vendor/pako/lib/zlib/inflate.js
  var CODES2 = 0;
  var LENS2 = 1;
  var DISTS2 = 2;
  var Z_FINISH = 4;
  var Z_BLOCK = 5;
  var Z_TREES = 6;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_MEM_ERROR = -4;
  var Z_BUF_ERROR = -5;
  var Z_DEFLATED = 8;
  var HEAD = 1;
  var FLAGS = 2;
  var TIME = 3;
  var OS = 4;
  var EXLEN = 5;
  var EXTRA = 6;
  var NAME = 7;
  var COMMENT = 8;
  var HCRC = 9;
  var DICTID = 10;
  var DICT = 11;
  var TYPE2 = 12;
  var TYPEDO = 13;
  var STORED = 14;
  var COPY_ = 15;
  var COPY = 16;
  var TABLE = 17;
  var LENLENS = 18;
  var CODELENS = 19;
  var LEN_ = 20;
  var LEN = 21;
  var LENEXT = 22;
  var DIST = 23;
  var DISTEXT = 24;
  var MATCH = 25;
  var LIT = 26;
  var CHECK = 27;
  var LENGTH = 28;
  var DONE = 29;
  var BAD2 = 30;
  var MEM = 31;
  var SYNC = 32;
  var ENOUGH_LENS2 = 852;
  var ENOUGH_DISTS2 = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  function zswap32(q) {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  }
  function InflateState() {
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Buf16(320);
    this.work = new Buf16(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  function inflateResetKeep(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Buf32(ENOUGH_LENS2);
    state.distcode = state.distdyn = new Buf32(ENOUGH_DISTS2);
    state.sane = 1;
    state.back = -1;
    return Z_OK;
  }
  function inflateReset(strm) {
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  }
  function inflateReset2(strm, windowBits) {
    var wrap;
    var state;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 1;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  }
  function inflateInit2(strm, windowBits) {
    var ret;
    var state;
    if (!strm) {
      return Z_STREAM_ERROR;
    }
    state = new InflateState();
    strm.state = state;
    state.window = null;
    ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK) {
      strm.state = null;
    }
    return ret;
  }
  function inflateInit(strm) {
    return inflateInit2(strm, DEF_WBITS);
  }
  var virgin = true;
  var lenfix;
  var distfix;
  function fixedtables(state) {
    if (virgin) {
      var sym;
      lenfix = new Buf32(512);
      distfix = new Buf32(32);
      sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inflate_table(LENS2, state.lens, 0, 288, lenfix, 0, state.work, {bits: 9});
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inflate_table(DISTS2, state.lens, 0, 32, distfix, 0, state.work, {bits: 5});
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  }
  function updatewindow(strm, src, end, copy) {
    var dist;
    var state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Buf8(state.wsize);
    }
    if (copy >= state.wsize) {
      arraySet(state.window, src, end - state.wsize, state.wsize, 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      arraySet(state.window, src, end - copy, dist, state.wnext);
      copy -= dist;
      if (copy) {
        arraySet(state.window, src, end - copy, copy, 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  }
  function inflate(strm, flush) {
    var state;
    var input, output;
    var next;
    var put;
    var have, left;
    var hold;
    var bits;
    var _in, _out;
    var copy;
    var from;
    var from_source;
    var here = 0;
    var here_bits, here_op, here_val;
    var last_bits, last_op, last_val;
    var len;
    var ret;
    var hbuf = new Buf8(4);
    var opts;
    var n;
    var order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR;
    }
    state = strm.state;
    if (state.mode === TYPE2) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK;
    inf_leave:
      for (; ; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = makeTable(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            state.flags = 0;
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD2;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD2;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            } else if (len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD2;
              break;
            }
            state.dmax = 1 << len;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE2;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD2;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD2;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = makeTable(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = makeTable(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = makeTable(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = makeTable(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Array(state.head.extra_len);
                  }
                  arraySet(state.head.extra, input, next, copy, len);
                }
                if (state.flags & 512) {
                  state.check = makeTable(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = makeTable(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512) {
                state.check = makeTable(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD2;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE2;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE2;
          case TYPE2:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD2;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD2;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state.mode = COPY;
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              arraySet(output, input, next, copy, put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE2;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD2;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = {bits: state.lenbits};
            ret = inflate_table(CODES2, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD2;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD2;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD2;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD2) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD2;
              break;
            }
            state.lenbits = 9;
            opts = {bits: state.lenbits};
            ret = inflate_table(LENS2, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD2;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = {bits: state.distbits};
            ret = inflate_table(DISTS2, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD2;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inflate_fast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE2) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE2;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD2;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          case DIST:
            for (; ; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD2;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD2;
              break;
            }
            state.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD2;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (_out) {
                strm.adler = state.check = state.flags ? makeTable(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
              }
              _out = left;
              if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD2;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD2;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          case DONE:
            ret = Z_STREAM_END;
            break inf_leave;
          case BAD2:
            ret = Z_DATA_ERROR;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR;
          case SYNC:
          default:
            return Z_STREAM_ERROR;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD2 && (state.mode < CHECK || flush !== Z_FINISH)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) {
      strm.adler = state.check = state.flags ? makeTable(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE2 ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  }

  // vendor/pako/lib/zlib/zstream.js
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }

  // core/inflator.js
  var Inflate = class {
    constructor() {
      this.strm = new ZStream();
      this.chunkSize = 1024 * 10 * 10;
      this.strm.output = new Uint8Array(this.chunkSize);
      this.windowBits = 5;
      inflateInit(this.strm, this.windowBits);
    }
    setInput(data) {
      if (!data) {
        this.strm.input = null;
        this.strm.avail_in = 0;
        this.strm.next_in = 0;
      } else {
        this.strm.input = data;
        this.strm.avail_in = this.strm.input.length;
        this.strm.next_in = 0;
      }
    }
    inflate(expected) {
      if (expected > this.chunkSize) {
        this.chunkSize = expected;
        this.strm.output = new Uint8Array(this.chunkSize);
      }
      this.strm.next_out = 0;
      this.strm.avail_out = expected;
      let ret = inflate(this.strm, 0);
      if (ret < 0) {
        throw new Error("zlib inflate failed");
      }
      if (this.strm.next_out != expected) {
        throw new Error("Incomplete zlib block");
      }
      return new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
    }
    reset() {
      inflateReset(this.strm);
    }
  };
  var inflator_default = Inflate;

  // vendor/pako/lib/zlib/trees.js
  var Z_FIXED = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN = 2;
  function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
  var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES + 2) * 2);
  zero(static_ltree);
  var static_dtree = new Array(D_CODES * 2);
  zero(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero(_dist_code);
  var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
  zero(_length_code);
  var base_length = new Array(LENGTH_CODES);
  zero(base_length);
  var base_dist = new Array(D_CODES);
  zero(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  }
  function put_short(s, w) {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  }
  function send_bits(s, value, length) {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  }
  function send_code(s, c2, tree) {
    send_bits(s, tree[c2 * 2], tree[c2 * 2 + 1]);
  }
  function bi_reverse(code, len) {
    var res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  }
  function bi_flush(s) {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  }
  function gen_bitlen(s, desc) {
    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var extra = desc.stat_desc.extra_bits;
    var base = desc.stat_desc.extra_base;
    var max_length = desc.stat_desc.max_length;
    var h;
    var n, m;
    var bits;
    var xbits;
    var f2;
    var overflow = 0;
    for (bits = 0; bits <= MAX_BITS; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f2 = tree[n * 2];
      s.opt_len += f2 * (bits + xbits);
      if (has_stree) {
        s.static_len += f2 * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  }
  function gen_codes(tree, max_code, bl_count) {
    var next_code = new Array(MAX_BITS + 1);
    var code = 0;
    var bits;
    var n;
    for (bits = 1; bits <= MAX_BITS; bits++) {
      next_code[bits] = code = code + bl_count[bits - 1] << 1;
    }
    for (n = 0; n <= max_code; n++) {
      var len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  }
  function tr_static_init() {
    var n;
    var bits;
    var length;
    var code;
    var dist;
    var bl_count = new Array(MAX_BITS + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (; code < D_CODES; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0; bits <= MAX_BITS; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES + 1, bl_count);
    for (n = 0; n < D_CODES; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
  }
  function init_block(s) {
    var n;
    for (n = 0; n < L_CODES; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
  }
  function bi_windup(s) {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  }
  function copy_block(s, buf, len, header) {
    bi_windup(s);
    if (header) {
      put_short(s, len);
      put_short(s, ~len);
    }
    arraySet(s.pending_buf, s.window, buf, len, s.pending);
    s.pending += len;
  }
  function smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  }
  function pqdownheap(s, tree, k) {
    var v = s.heap[k];
    var j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  }
  function compress_block(s, ltree, dtree) {
    var dist;
    var lc;
    var lx = 0;
    var code;
    var extra;
    if (s.last_lit !== 0) {
      do {
        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
        lc = s.pending_buf[s.l_buf + lx];
        lx++;
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (lx < s.last_lit);
    }
    send_code(s, END_BLOCK, ltree);
  }
  function build_tree(s, desc) {
    var tree = desc.dyn_tree;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var elems = desc.stat_desc.elems;
    var n, m;
    var max_code = -1;
    var node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[1];
      s.heap[1] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1);
      m = s.heap[1];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[1] = node++;
      pqdownheap(s, tree, 1);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  }
  function scan_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function send_tree(s, tree, max_code) {
    var n;
    var prevlen = -1;
    var curlen;
    var nextlen = tree[0 * 2 + 1];
    var count = 0;
    var max_count = 7;
    var min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }
  function build_bl_tree(s) {
    var max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  }
  function send_all_trees(s, lcodes, dcodes, blcodes) {
    var rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  }
  function detect_data_type(s) {
    var black_mask = 4093624447;
    var n;
    for (n = 0; n <= 31; n++, black_mask >>>= 1) {
      if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  }
  var static_init_done = false;
  function _tr_init(s) {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  }
  function _tr_stored_block(s, buf, stored_len, last) {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    copy_block(s, buf, stored_len, true);
  }
  function _tr_align(s) {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  }
  function _tr_flush_block(s, buf, stored_len, last) {
    var opt_lenb, static_lenb;
    var max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  }
  function _tr_tally(s, dist, lc) {
    s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
    s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
    s.last_lit++;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.last_lit === s.lit_bufsize - 1;
  }

  // vendor/pako/lib/zlib/messages.js
  var messages_default = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
  };

  // vendor/pako/lib/zlib/deflate.js
  var Z_NO_FLUSH = 0;
  var Z_PARTIAL_FLUSH = 1;
  var Z_FULL_FLUSH = 3;
  var Z_FINISH2 = 4;
  var Z_BLOCK2 = 5;
  var Z_OK2 = 0;
  var Z_STREAM_END2 = 1;
  var Z_STREAM_ERROR2 = -2;
  var Z_BUF_ERROR2 = -5;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_FILTERED = 1;
  var Z_HUFFMAN_ONLY = 2;
  var Z_RLE = 3;
  var Z_FIXED2 = 4;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_UNKNOWN2 = 2;
  var Z_DEFLATED2 = 8;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS2 = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES2 = 29;
  var LITERALS2 = 256;
  var L_CODES2 = LITERALS2 + 1 + LENGTH_CODES2;
  var D_CODES2 = 30;
  var BL_CODES2 = 19;
  var HEAP_SIZE2 = 2 * L_CODES2 + 1;
  var MAX_BITS2 = 15;
  var MIN_MATCH2 = 3;
  var MAX_MATCH2 = 258;
  var MIN_LOOKAHEAD = MAX_MATCH2 + MIN_MATCH2 + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  function err(strm, errorCode) {
    strm.msg = messages_default[errorCode];
    return errorCode;
  }
  function rank(f2) {
    return (f2 << 1) - (f2 > 4 ? 9 : 0);
  }
  function zero2(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  function flush_pending(strm) {
    var s = strm.state;
    var len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  }
  function flush_block_only(s, last) {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  }
  function put_byte(s, b2) {
    s.pending_buf[s.pending++] = b2;
  }
  function putShortMSB(s, b2) {
    s.pending_buf[s.pending++] = b2 >>> 8 & 255;
    s.pending_buf[s.pending++] = b2 & 255;
  }
  function read_buf(strm, buf, start, size) {
    var len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    arraySet(buf, strm.input, strm.next_in, len, start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = makeTable(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  }
  function longest_match(s, cur_match) {
    var chain_length = s.max_chain_length;
    var scan = s.strstart;
    var match;
    var len;
    var best_len = s.prev_length;
    var nice_match = s.nice_match;
    var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    var _win = s.window;
    var wmask = s.w_mask;
    var prev = s.prev;
    var strend = s.strstart + MAX_MATCH2;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH2 - (strend - scan);
      scan = strend - MAX_MATCH2;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  }
  function fill_window(s) {
    var _w_size = s.w_size;
    var p, n, m, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        arraySet(s.window, s.window, _w_size, _w_size, 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        n = s.hash_size;
        p = n;
        do {
          m = s.head[--p];
          s.head[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        n = _w_size;
        p = n;
        do {
          m = s.prev[--p];
          s.prev[p] = m >= _w_size ? m - _w_size : 0;
        } while (--n);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH2) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
        while (s.insert) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH2 - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH2) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  }
  function deflate_stored(s, flush) {
    var max_block_size = 65535;
    if (max_block_size > s.pending_buf_size - 5) {
      max_block_size = s.pending_buf_size - 5;
    }
    for (; ; ) {
      if (s.lookahead <= 1) {
        fill_window(s);
        if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.strstart += s.lookahead;
      s.lookahead = 0;
      var max_start = s.block_start + max_block_size;
      if (s.strstart === 0 || s.strstart >= max_start) {
        s.lookahead = s.strstart - max_start;
        s.strstart = max_start;
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH2) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.strstart > s.block_start) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_NEED_MORE;
  }
  function deflate_fast(s, flush) {
    var hash_head;
    var bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH2) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH2 - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH2) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH2);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH2) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH2 - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH2 - 1 ? s.strstart : MIN_MATCH2 - 1;
    if (flush === Z_FINISH2) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_slow(s, flush) {
    var hash_head;
    var bflush;
    var max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH2) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH2 - 1]) & s.hash_mask;
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH2 - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH2 && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH2 - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH2 && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH2;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH2);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH2 - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH2 - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH2 - 1 ? s.strstart : MIN_MATCH2 - 1;
    if (flush === Z_FINISH2) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_rle(s, flush) {
    var bflush;
    var prev;
    var scan, strend;
    var _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH2) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH2 && flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH2 && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH2;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH2 - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH2) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH2);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH2) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function deflate_huff(s, flush) {
    var bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH2) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.last_lit) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table;
  configuration_table = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
  ];
  function lm_init(s) {
    s.window_size = 2 * s.w_size;
    zero2(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH2 - 1;
    s.match_available = 0;
    s.ins_h = 0;
  }
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Buf16(HEAP_SIZE2 * 2);
    this.dyn_dtree = new Buf16((2 * D_CODES2 + 1) * 2);
    this.bl_tree = new Buf16((2 * BL_CODES2 + 1) * 2);
    zero2(this.dyn_ltree);
    zero2(this.dyn_dtree);
    zero2(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Buf16(MAX_BITS2 + 1);
    this.heap = new Buf16(2 * L_CODES2 + 1);
    zero2(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Buf16(2 * L_CODES2 + 1);
    zero2(this.depth);
    this.l_buf = 0;
    this.lit_bufsize = 0;
    this.last_lit = 0;
    this.d_buf = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  function deflateResetKeep(strm) {
    var s;
    if (!strm || !strm.state) {
      return err(strm, Z_STREAM_ERROR2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN2;
    s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = s.wrap ? INIT_STATE : BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = Z_NO_FLUSH;
    _tr_init(s);
    return Z_OK2;
  }
  function deflateReset(strm) {
    var ret = deflateResetKeep(strm);
    if (ret === Z_OK2) {
      lm_init(strm.state);
    }
    return ret;
  }
  function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
    if (!strm) {
      return Z_STREAM_ERROR2;
    }
    var wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED2) {
      return err(strm, Z_STREAM_ERROR2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    var s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH2 - 1) / MIN_MATCH2);
    s.window = new Buf8(s.w_size * 2);
    s.head = new Buf16(s.hash_size);
    s.prev = new Buf16(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Buf8(s.pending_buf_size);
    s.d_buf = 1 * s.lit_bufsize;
    s.l_buf = (1 + 2) * s.lit_bufsize;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  }
  function deflateInit(strm, level) {
    return deflateInit2(strm, level, Z_DEFLATED2, MAX_WBITS2, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
  }
  function deflate(strm, flush) {
    var old_flush, s;
    var beg, val;
    if (!strm || !strm.state || flush > Z_BLOCK2 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR2) : Z_STREAM_ERROR2;
    }
    s = strm.state;
    if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH2) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR2 : Z_STREAM_ERROR2);
    }
    s.strm = strm;
    old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.status === INIT_STATE) {
      if (s.wrap === 2) {
        strm.adler = 0;
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) {
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
        } else {
          put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
          put_byte(s, s.gzhead.time & 255);
          put_byte(s, s.gzhead.time >> 8 & 255);
          put_byte(s, s.gzhead.time >> 16 & 255);
          put_byte(s, s.gzhead.time >> 24 & 255);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, s.gzhead.os & 255);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 255);
            put_byte(s, s.gzhead.extra.length >> 8 & 255);
          }
          if (s.gzhead.hcrc) {
            strm.adler = makeTable(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      } else {
        var header = Z_DEFLATED2 + (s.w_bits - 8 << 4) << 8;
        var level_flags = -1;
        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;
        s.status = BUSY_STATE;
        putShortMSB(s, header);
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        strm.adler = 1;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        beg = s.pending;
        while (s.gzindex < (s.gzhead.extra.length & 65535)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              break;
            }
          }
          put_byte(s, s.gzhead.extra[s.gzindex] & 255);
          s.gzindex++;
        }
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      } else {
        s.status = NAME_STATE;
      }
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      } else {
        s.status = COMMENT_STATE;
      }
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        beg = s.pending;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            beg = s.pending;
            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = makeTable(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        if (val === 0) {
          s.status = HCRC_STATE;
        }
      } else {
        s.status = HCRC_STATE;
      }
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
        }
        if (s.pending + 2 <= s.pending_buf_size) {
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          strm.adler = 0;
          s.status = BUSY_STATE;
        }
      } else {
        s.status = BUSY_STATE;
      }
    }
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK2;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH2) {
      return err(strm, Z_BUF_ERROR2);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR2);
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
      var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK2;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK2) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH) {
            zero2(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK2;
        }
      }
    }
    if (flush !== Z_FINISH2) {
      return Z_OK2;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END2;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK2 : Z_STREAM_END2;
  }

  // core/deflator.js
  var Deflator = class {
    constructor() {
      this.strm = new ZStream();
      this.chunkSize = 1024 * 10 * 10;
      this.outputBuffer = new Uint8Array(this.chunkSize);
      this.windowBits = 5;
      deflateInit(this.strm, this.windowBits);
    }
    deflate(inData) {
      this.strm.input = inData;
      this.strm.avail_in = this.strm.input.length;
      this.strm.next_in = 0;
      this.strm.output = this.outputBuffer;
      this.strm.avail_out = this.chunkSize;
      this.strm.next_out = 0;
      let lastRet = deflate(this.strm, Z_FULL_FLUSH);
      let outData = new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
      if (lastRet < 0) {
        throw new Error("zlib deflate failed");
      }
      if (this.strm.avail_in > 0) {
        let chunks = [outData];
        let totalLen = outData.length;
        do {
          this.strm.output = new Uint8Array(this.chunkSize);
          this.strm.next_out = 0;
          this.strm.avail_out = this.chunkSize;
          lastRet = deflate(this.strm, Z_FULL_FLUSH);
          if (lastRet < 0) {
            throw new Error("zlib deflate failed");
          }
          let chunk = new Uint8Array(this.strm.output.buffer, 0, this.strm.next_out);
          totalLen += chunk.length;
          chunks.push(chunk);
        } while (this.strm.avail_in > 0);
        let newData = new Uint8Array(totalLen);
        let offset = 0;
        for (let i = 0; i < chunks.length; i++) {
          newData.set(chunks[i], offset);
          offset += chunks[i].length;
        }
        outData = newData;
      }
      this.strm.input = null;
      this.strm.avail_in = 0;
      this.strm.next_in = 0;
      return outData;
    }
  };
  var deflator_default = Deflator;

  // core/input/gesturehandler.js
  var GH_NOGESTURE = 0;
  var GH_ONETAP = 1;
  var GH_TWOTAP = 2;
  var GH_THREETAP = 4;
  var GH_DRAG = 8;
  var GH_LONGPRESS = 16;
  var GH_TWODRAG = 32;
  var GH_PINCH = 64;
  var GH_INITSTATE = 127;
  var GH_MOVE_THRESHOLD = 50;
  var GH_ANGLE_THRESHOLD = 90;
  var GH_MULTITOUCH_TIMEOUT = 250;
  var GH_TAP_TIMEOUT = 1e3;
  var GH_LONGPRESS_TIMEOUT = 1e3;
  var GH_TWOTOUCH_TIMEOUT = 50;
  var GestureHandler = class {
    constructor() {
      this._target = null;
      this._state = GH_INITSTATE;
      this._tracked = [];
      this._ignored = [];
      this._waitingRelease = false;
      this._releaseStart = 0;
      this._longpressTimeoutId = null;
      this._twoTouchTimeoutId = null;
      this._boundEventHandler = this._eventHandler.bind(this);
    }
    attach(target) {
      this.detach();
      this._target = target;
      this._target.addEventListener("touchstart", this._boundEventHandler);
      this._target.addEventListener("touchmove", this._boundEventHandler);
      this._target.addEventListener("touchend", this._boundEventHandler);
      this._target.addEventListener("touchcancel", this._boundEventHandler);
    }
    detach() {
      if (!this._target) {
        return;
      }
      this._stopLongpressTimeout();
      this._stopTwoTouchTimeout();
      this._target.removeEventListener("touchstart", this._boundEventHandler);
      this._target.removeEventListener("touchmove", this._boundEventHandler);
      this._target.removeEventListener("touchend", this._boundEventHandler);
      this._target.removeEventListener("touchcancel", this._boundEventHandler);
      this._target = null;
    }
    _eventHandler(e2) {
      let fn;
      e2.stopPropagation();
      e2.preventDefault();
      switch (e2.type) {
        case "touchstart":
          fn = this._touchStart;
          break;
        case "touchmove":
          fn = this._touchMove;
          break;
        case "touchend":
        case "touchcancel":
          fn = this._touchEnd;
          break;
      }
      for (let i = 0; i < e2.changedTouches.length; i++) {
        let touch = e2.changedTouches[i];
        fn.call(this, touch.identifier, touch.clientX, touch.clientY);
      }
    }
    _touchStart(id, x, y) {
      if (this._hasDetectedGesture() || this._state === GH_NOGESTURE) {
        this._ignored.push(id);
        return;
      }
      if (this._tracked.length > 0 && Date.now() - this._tracked[0].started > GH_MULTITOUCH_TIMEOUT) {
        this._state = GH_NOGESTURE;
        this._ignored.push(id);
        return;
      }
      if (this._waitingRelease) {
        this._state = GH_NOGESTURE;
        this._ignored.push(id);
        return;
      }
      this._tracked.push({
        id,
        started: Date.now(),
        active: true,
        firstX: x,
        firstY: y,
        lastX: x,
        lastY: y,
        angle: 0
      });
      switch (this._tracked.length) {
        case 1:
          this._startLongpressTimeout();
          break;
        case 2:
          this._state &= ~(GH_ONETAP | GH_DRAG | GH_LONGPRESS);
          this._stopLongpressTimeout();
          break;
        case 3:
          this._state &= ~(GH_TWOTAP | GH_TWODRAG | GH_PINCH);
          break;
        default:
          this._state = GH_NOGESTURE;
      }
    }
    _touchMove(id, x, y) {
      let touch = this._tracked.find((t) => t.id === id);
      if (touch === void 0) {
        return;
      }
      touch.lastX = x;
      touch.lastY = y;
      let deltaX = x - touch.firstX;
      let deltaY = y - touch.firstY;
      if (touch.firstX !== touch.lastX || touch.firstY !== touch.lastY) {
        touch.angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      }
      if (!this._hasDetectedGesture()) {
        if (Math.hypot(deltaX, deltaY) < GH_MOVE_THRESHOLD) {
          return;
        }
        this._state &= ~(GH_ONETAP | GH_TWOTAP | GH_THREETAP | GH_LONGPRESS);
        this._stopLongpressTimeout();
        if (this._tracked.length !== 1) {
          this._state &= ~GH_DRAG;
        }
        if (this._tracked.length !== 2) {
          this._state &= ~(GH_TWODRAG | GH_PINCH);
        }
        if (this._tracked.length === 2) {
          let prevTouch = this._tracked.find((t) => t.id !== id);
          let prevDeltaMove = Math.hypot(prevTouch.firstX - prevTouch.lastX, prevTouch.firstY - prevTouch.lastY);
          if (prevDeltaMove > GH_MOVE_THRESHOLD) {
            let deltaAngle = Math.abs(touch.angle - prevTouch.angle);
            deltaAngle = Math.abs((deltaAngle + 180) % 360 - 180);
            if (deltaAngle > GH_ANGLE_THRESHOLD) {
              this._state &= ~GH_TWODRAG;
            } else {
              this._state &= ~GH_PINCH;
            }
            if (this._isTwoTouchTimeoutRunning()) {
              this._stopTwoTouchTimeout();
            }
          } else if (!this._isTwoTouchTimeoutRunning()) {
            this._startTwoTouchTimeout();
          }
        }
        if (!this._hasDetectedGesture()) {
          return;
        }
        this._pushEvent("gesturestart");
      }
      this._pushEvent("gesturemove");
    }
    _touchEnd(id, x, y) {
      if (this._ignored.indexOf(id) !== -1) {
        this._ignored.splice(this._ignored.indexOf(id), 1);
        if (this._ignored.length === 0 && this._tracked.length === 0) {
          this._state = GH_INITSTATE;
          this._waitingRelease = false;
        }
        return;
      }
      if (!this._hasDetectedGesture() && this._isTwoTouchTimeoutRunning()) {
        this._stopTwoTouchTimeout();
        this._state = GH_NOGESTURE;
      }
      if (!this._hasDetectedGesture()) {
        this._state &= ~(GH_DRAG | GH_TWODRAG | GH_PINCH);
        this._state &= ~GH_LONGPRESS;
        this._stopLongpressTimeout();
        if (!this._waitingRelease) {
          this._releaseStart = Date.now();
          this._waitingRelease = true;
          switch (this._tracked.length) {
            case 1:
              this._state &= ~(GH_TWOTAP | GH_THREETAP);
              break;
            case 2:
              this._state &= ~(GH_ONETAP | GH_THREETAP);
              break;
          }
        }
      }
      if (this._waitingRelease) {
        if (Date.now() - this._releaseStart > GH_MULTITOUCH_TIMEOUT) {
          this._state = GH_NOGESTURE;
        }
        if (this._tracked.some((t) => Date.now() - t.started > GH_TAP_TIMEOUT)) {
          this._state = GH_NOGESTURE;
        }
        let touch = this._tracked.find((t) => t.id === id);
        touch.active = false;
        if (this._hasDetectedGesture()) {
          this._pushEvent("gesturestart");
        } else {
          if (this._state !== GH_NOGESTURE) {
            return;
          }
        }
      }
      if (this._hasDetectedGesture()) {
        this._pushEvent("gestureend");
      }
      for (let i = 0; i < this._tracked.length; i++) {
        if (this._tracked[i].active) {
          this._ignored.push(this._tracked[i].id);
        }
      }
      this._tracked = [];
      this._state = GH_NOGESTURE;
      if (this._ignored.indexOf(id) !== -1) {
        this._ignored.splice(this._ignored.indexOf(id), 1);
      }
      if (this._ignored.length === 0) {
        this._state = GH_INITSTATE;
        this._waitingRelease = false;
      }
    }
    _hasDetectedGesture() {
      if (this._state === GH_NOGESTURE) {
        return false;
      }
      if (this._state & this._state - 1) {
        return false;
      }
      if (this._state & (GH_ONETAP | GH_TWOTAP | GH_THREETAP)) {
        if (this._tracked.some((t) => t.active)) {
          return false;
        }
      }
      return true;
    }
    _startLongpressTimeout() {
      this._stopLongpressTimeout();
      this._longpressTimeoutId = setTimeout(() => this._longpressTimeout(), GH_LONGPRESS_TIMEOUT);
    }
    _stopLongpressTimeout() {
      clearTimeout(this._longpressTimeoutId);
      this._longpressTimeoutId = null;
    }
    _longpressTimeout() {
      if (this._hasDetectedGesture()) {
        throw new Error("A longpress gesture failed, conflict with a different gesture");
      }
      this._state = GH_LONGPRESS;
      this._pushEvent("gesturestart");
    }
    _startTwoTouchTimeout() {
      this._stopTwoTouchTimeout();
      this._twoTouchTimeoutId = setTimeout(() => this._twoTouchTimeout(), GH_TWOTOUCH_TIMEOUT);
    }
    _stopTwoTouchTimeout() {
      clearTimeout(this._twoTouchTimeoutId);
      this._twoTouchTimeoutId = null;
    }
    _isTwoTouchTimeoutRunning() {
      return this._twoTouchTimeoutId !== null;
    }
    _twoTouchTimeout() {
      if (this._tracked.length === 0) {
        throw new Error("A pinch or two drag gesture failed, no tracked touches");
      }
      let avgM = this._getAverageMovement();
      let avgMoveH = Math.abs(avgM.x);
      let avgMoveV = Math.abs(avgM.y);
      let avgD = this._getAverageDistance();
      let deltaTouchDistance = Math.abs(Math.hypot(avgD.first.x, avgD.first.y) - Math.hypot(avgD.last.x, avgD.last.y));
      if (avgMoveV < deltaTouchDistance && avgMoveH < deltaTouchDistance) {
        this._state = GH_PINCH;
      } else {
        this._state = GH_TWODRAG;
      }
      this._pushEvent("gesturestart");
      this._pushEvent("gesturemove");
    }
    _pushEvent(type) {
      let detail = {type: this._stateToGesture(this._state)};
      let avg = this._getPosition();
      let pos = avg.last;
      if (type === "gesturestart") {
        pos = avg.first;
      }
      switch (this._state) {
        case GH_TWODRAG:
        case GH_PINCH:
          pos = avg.first;
          break;
      }
      detail["clientX"] = pos.x;
      detail["clientY"] = pos.y;
      if (this._state === GH_PINCH) {
        let distance = this._getAverageDistance();
        if (type === "gesturestart") {
          detail["magnitudeX"] = distance.first.x;
          detail["magnitudeY"] = distance.first.y;
        } else {
          detail["magnitudeX"] = distance.last.x;
          detail["magnitudeY"] = distance.last.y;
        }
      } else if (this._state === GH_TWODRAG) {
        if (type === "gesturestart") {
          detail["magnitudeX"] = 0;
          detail["magnitudeY"] = 0;
        } else {
          let movement = this._getAverageMovement();
          detail["magnitudeX"] = movement.x;
          detail["magnitudeY"] = movement.y;
        }
      }
      let gev = new CustomEvent(type, {detail});
      this._target.dispatchEvent(gev);
    }
    _stateToGesture(state) {
      switch (state) {
        case GH_ONETAP:
          return "onetap";
        case GH_TWOTAP:
          return "twotap";
        case GH_THREETAP:
          return "threetap";
        case GH_DRAG:
          return "drag";
        case GH_LONGPRESS:
          return "longpress";
        case GH_TWODRAG:
          return "twodrag";
        case GH_PINCH:
          return "pinch";
      }
      throw new Error("Unknown gesture state: " + state);
    }
    _getPosition() {
      if (this._tracked.length === 0) {
        throw new Error("Failed to get gesture position, no tracked touches");
      }
      let size = this._tracked.length;
      let fx = 0, fy = 0, lx = 0, ly = 0;
      for (let i = 0; i < this._tracked.length; i++) {
        fx += this._tracked[i].firstX;
        fy += this._tracked[i].firstY;
        lx += this._tracked[i].lastX;
        ly += this._tracked[i].lastY;
      }
      return {
        first: {
          x: fx / size,
          y: fy / size
        },
        last: {
          x: lx / size,
          y: ly / size
        }
      };
    }
    _getAverageMovement() {
      if (this._tracked.length === 0) {
        throw new Error("Failed to get gesture movement, no tracked touches");
      }
      let totalH, totalV;
      totalH = totalV = 0;
      let size = this._tracked.length;
      for (let i = 0; i < this._tracked.length; i++) {
        totalH += this._tracked[i].lastX - this._tracked[i].firstX;
        totalV += this._tracked[i].lastY - this._tracked[i].firstY;
      }
      return {
        x: totalH / size,
        y: totalV / size
      };
    }
    _getAverageDistance() {
      if (this._tracked.length === 0) {
        throw new Error("Failed to get gesture distance, no tracked touches");
      }
      let first = this._tracked[0];
      let last = this._tracked[this._tracked.length - 1];
      let fdx = Math.abs(last.firstX - first.firstX);
      let fdy = Math.abs(last.firstY - first.firstY);
      let ldx = Math.abs(last.lastX - first.lastX);
      let ldy = Math.abs(last.lastY - first.lastY);
      return {
        first: {x: fdx, y: fdy},
        last: {x: ldx, y: ldy}
      };
    }
  };
  var gesturehandler_default = GestureHandler;

  // core/util/cursor.js
  var useFallback = !supportsCursorURIs || isTouchDevice;
  var Cursor = class {
    constructor() {
      this._target = null;
      this._showLocalCursor = false;
      this._canvas = document.createElement("canvas");
      if (useFallback) {
        this._canvas.style.position = "fixed";
        this._canvas.style.zIndex = "65535";
        this._canvas.style.pointerEvents = "none";
        this._canvas.style.userSelect = "none";
        this._canvas.style.WebkitUserSelect = "none";
        this._canvas.style.visibility = "hidden";
      }
      this._position = {x: 0, y: 0};
      this._hotSpot = {x: 0, y: 0};
      this._eventHandlers = {
        mouseover: this._handleMouseOver.bind(this),
        mouseleave: this._handleMouseLeave.bind(this),
        mousemove: this._handleMouseMove.bind(this),
        mouseup: this._handleMouseUp.bind(this)
      };
    }
    attach(target) {
      if (this._target) {
        this.detach();
      }
      this._target = target;
      if (useFallback) {
        document.body.appendChild(this._canvas);
        const options = {capture: true, passive: true};
        this._target.addEventListener("mouseover", this._eventHandlers.mouseover, options);
        this._target.addEventListener("mouseleave", this._eventHandlers.mouseleave, options);
        this._target.addEventListener("mousemove", this._eventHandlers.mousemove, options);
        this._target.addEventListener("mouseup", this._eventHandlers.mouseup, options);
      }
      this.clear();
    }
    detach() {
      if (!this._target) {
        return;
      }
      if (useFallback) {
        const options = {capture: true, passive: true};
        this._target.removeEventListener("mouseover", this._eventHandlers.mouseover, options);
        this._target.removeEventListener("mouseleave", this._eventHandlers.mouseleave, options);
        this._target.removeEventListener("mousemove", this._eventHandlers.mousemove, options);
        this._target.removeEventListener("mouseup", this._eventHandlers.mouseup, options);
        document.body.removeChild(this._canvas);
      }
      this._target = null;
    }
    change(rgba, hotx, hoty, w, h) {
      if (w === 0 || h === 0) {
        this.clear();
        return;
      }
      this._position.x = this._position.x + this._hotSpot.x - hotx;
      this._position.y = this._position.y + this._hotSpot.y - hoty;
      this._hotSpot.x = hotx;
      this._hotSpot.y = hoty;
      let ctx = this._canvas.getContext("2d");
      this._canvas.width = w;
      this._canvas.height = h;
      let img = new ImageData(new Uint8ClampedArray(rgba), w, h);
      ctx.clearRect(0, 0, w, h);
      ctx.putImageData(img, 0, 0);
      if (useFallback) {
        this._updatePosition();
      } else {
        let url = this._canvas.toDataURL();
        this._target.style.cursor = "url(" + url + ")" + hotx + " " + hoty + ", default";
      }
    }
    clear() {
      this._target.style.cursor = this._showLocalCursor ? "default" : "none";
      this._canvas.width = 0;
      this._canvas.height = 0;
      this._position.x = this._position.x + this._hotSpot.x;
      this._position.y = this._position.y + this._hotSpot.y;
      this._hotSpot.x = 0;
      this._hotSpot.y = 0;
    }
    move(clientX, clientY) {
      if (!useFallback) {
        return;
      }
      if (window.visualViewport) {
        this._position.x = clientX + window.visualViewport.offsetLeft;
        this._position.y = clientY + window.visualViewport.offsetTop;
      } else {
        this._position.x = clientX;
        this._position.y = clientY;
      }
      this._updatePosition();
      let target = document.elementFromPoint(clientX, clientY);
      this._updateVisibility(target);
    }
    setLocalCursor(cursor) {
      this._showLocalCursor = cursor;
      this._updateLocalCursor();
    }
    _handleMouseOver(event) {
      this._handleMouseMove(event);
    }
    _handleMouseLeave(event) {
      this._updateVisibility(event.relatedTarget);
    }
    _handleMouseMove(event) {
      this._updateVisibility(event.target);
      this._position.x = event.clientX - this._hotSpot.x;
      this._position.y = event.clientY - this._hotSpot.y;
      this._updatePosition();
    }
    _handleMouseUp(event) {
      let target = document.elementFromPoint(event.clientX, event.clientY);
      this._updateVisibility(target);
      if (this._captureIsActive()) {
        window.setTimeout(() => {
          if (!this._target) {
            return;
          }
          target = document.elementFromPoint(event.clientX, event.clientY);
          this._updateVisibility(target);
        }, 0);
      }
    }
    _updateLocalCursor() {
      if (this._target)
        this._target.style.cursor = this._showLocalCursor ? "default" : "none";
    }
    _showCursor() {
      if (this._canvas.style.visibility === "hidden") {
        this._canvas.style.visibility = "";
      }
    }
    _hideCursor() {
      if (this._canvas.style.visibility !== "hidden") {
        this._canvas.style.visibility = "hidden";
      }
    }
    _shouldShowCursor(target) {
      if (!target) {
        return false;
      }
      if (target === this._target) {
        return true;
      }
      if (!this._target.contains(target)) {
        return false;
      }
      if (window.getComputedStyle(target).cursor !== "none") {
        return false;
      }
      return true;
    }
    _updateVisibility(target) {
      if (this._captureIsActive()) {
        target = document.captureElement;
      }
      if (this._shouldShowCursor(target)) {
        this._showCursor();
      } else {
        this._hideCursor();
      }
    }
    _updatePosition() {
      this._canvas.style.left = this._position.x + "px";
      this._canvas.style.top = this._position.y + "px";
    }
    _captureIsActive() {
      return document.captureElement && document.documentElement.contains(document.captureElement);
    }
  };
  var cursor_default = Cursor;

  // core/websock.js
  var MAX_RQ_GROW_SIZE = 40 * 1024 * 1024;
  var DataChannel = {
    CONNECTING: "connecting",
    OPEN: "open",
    CLOSING: "closing",
    CLOSED: "closed"
  };
  var ReadyStates = {
    CONNECTING: [WebSocket.CONNECTING, DataChannel.CONNECTING],
    OPEN: [WebSocket.OPEN, DataChannel.OPEN],
    CLOSING: [WebSocket.CLOSING, DataChannel.CLOSING],
    CLOSED: [WebSocket.CLOSED, DataChannel.CLOSED]
  };
  var rawChannelProps = [
    "send",
    "close",
    "binaryType",
    "onerror",
    "onmessage",
    "onopen",
    "protocol",
    "readyState"
  ];
  var Websock = class {
    constructor() {
      this._websocket = null;
      this._rQi = 0;
      this._rQlen = 0;
      this._rQbufferSize = 1024 * 1024 * 4;
      this._rQ = null;
      this._sQbufferSize = 1024 * 10;
      this._sQlen = 0;
      this._sQ = null;
      this._eventHandlers = {
        message: () => {
        },
        open: () => {
        },
        close: () => {
        },
        error: () => {
        }
      };
    }
    get readyState() {
      let subState;
      if (this._websocket === null) {
        return "unused";
      }
      subState = this._websocket.readyState;
      if (ReadyStates.CONNECTING.includes(subState)) {
        return "connecting";
      } else if (ReadyStates.OPEN.includes(subState)) {
        return "open";
      } else if (ReadyStates.CLOSING.includes(subState)) {
        return "closing";
      } else if (ReadyStates.CLOSED.includes(subState)) {
        return "closed";
      }
      return "unknown";
    }
    get sQ() {
      return this._sQ;
    }
    get rQ() {
      return this._rQ;
    }
    get rQi() {
      return this._rQi;
    }
    set rQi(val) {
      this._rQi = val;
    }
    get rQlen() {
      return this._rQlen - this._rQi;
    }
    rQpeek8() {
      return this._rQ[this._rQi];
    }
    rQskipBytes(bytes) {
      this._rQi += bytes;
    }
    rQshift8() {
      return this._rQshift(1);
    }
    rQshift16() {
      return this._rQshift(2);
    }
    rQshift32() {
      return this._rQshift(4);
    }
    _rQshift(bytes) {
      let res = 0;
      for (let byte = bytes - 1; byte >= 0; byte--) {
        res += this._rQ[this._rQi++] << byte * 8;
      }
      return res;
    }
    rQshiftStr(len) {
      if (typeof len === "undefined") {
        len = this.rQlen;
      }
      let str = "";
      for (let i = 0; i < len; i += 4096) {
        let part = this.rQshiftBytes(Math.min(4096, len - i));
        str += String.fromCharCode.apply(null, part);
      }
      return str;
    }
    rQshiftBytes(len) {
      if (typeof len === "undefined") {
        len = this.rQlen;
      }
      this._rQi += len;
      return new Uint8Array(this._rQ.buffer, this._rQi - len, len);
    }
    rQshiftTo(target, len) {
      if (len === void 0) {
        len = this.rQlen;
      }
      target.set(new Uint8Array(this._rQ.buffer, this._rQi, len));
      this._rQi += len;
    }
    rQslice(start, end = this.rQlen) {
      return new Uint8Array(this._rQ.buffer, this._rQi + start, end - start);
    }
    rQwait(msg, num, goback) {
      if (this.rQlen < num) {
        if (goback) {
          if (this._rQi < goback) {
            throw new Error("rQwait cannot backup " + goback + " bytes");
          }
          this._rQi -= goback;
        }
        return true;
      }
      return false;
    }
    flush() {
      if (this._sQlen > 0 && this.readyState === "open") {
        this._websocket.send(this._encodeMessage());
        this._sQlen = 0;
      }
    }
    send(arr) {
      this._sQ.set(arr, this._sQlen);
      this._sQlen += arr.length;
      this.flush();
    }
    sendString(str) {
      this.send(str.split("").map((chr) => chr.charCodeAt(0)));
    }
    off(evt) {
      this._eventHandlers[evt] = () => {
      };
    }
    on(evt, handler) {
      this._eventHandlers[evt] = handler;
    }
    _allocateBuffers() {
      this._rQ = new Uint8Array(this._rQbufferSize);
      this._sQ = new Uint8Array(this._sQbufferSize);
    }
    init() {
      this._allocateBuffers();
      this._rQi = 0;
      this._websocket = null;
    }
    open(uri, protocols) {
      this.attach(new WebSocket(uri, protocols));
    }
    attach(rawChannel) {
      this.init();
      const channelProps = [...Object.keys(rawChannel), ...Object.getOwnPropertyNames(Object.getPrototypeOf(rawChannel))];
      for (let i = 0; i < rawChannelProps.length; i++) {
        const prop = rawChannelProps[i];
        if (channelProps.indexOf(prop) < 0) {
          throw new Error("Raw channel missing property: " + prop);
        }
      }
      this._websocket = rawChannel;
      this._websocket.binaryType = "arraybuffer";
      this._websocket.onmessage = this._recvMessage.bind(this);
      this._websocket.onopen = () => {
        Debug(">> WebSock.onopen");
        if (this._websocket.protocol) {
          Info("Server choose sub-protocol: " + this._websocket.protocol);
        }
        this._eventHandlers.open();
        Debug("<< WebSock.onopen");
      };
      this._websocket.onclose = (e2) => {
        Debug(">> WebSock.onclose");
        this._eventHandlers.close(e2);
        Debug("<< WebSock.onclose");
      };
      this._websocket.onerror = (e2) => {
        Debug(">> WebSock.onerror: " + e2);
        this._eventHandlers.error(e2);
        Debug("<< WebSock.onerror: " + e2);
      };
    }
    close() {
      if (this._websocket) {
        if (this.readyState === "connecting" || this.readyState === "open") {
          Info("Closing WebSocket connection");
          this._websocket.close();
        }
        this._websocket.onmessage = () => {
        };
      }
    }
    _encodeMessage() {
      return new Uint8Array(this._sQ.buffer, 0, this._sQlen);
    }
    _expandCompactRQ(minFit) {
      const requiredBufferSize = (this._rQlen - this._rQi + minFit) * 8;
      const resizeNeeded = this._rQbufferSize < requiredBufferSize;
      if (resizeNeeded) {
        this._rQbufferSize = Math.max(this._rQbufferSize * 2, requiredBufferSize);
      }
      if (this._rQbufferSize > MAX_RQ_GROW_SIZE) {
        this._rQbufferSize = MAX_RQ_GROW_SIZE;
        if (this._rQbufferSize - this.rQlen < minFit) {
          throw new Error("Receive Queue buffer exceeded " + MAX_RQ_GROW_SIZE + " bytes, and the new message could not fit");
        }
      }
      if (resizeNeeded) {
        const oldRQbuffer = this._rQ.buffer;
        this._rQ = new Uint8Array(this._rQbufferSize);
        this._rQ.set(new Uint8Array(oldRQbuffer, this._rQi, this._rQlen - this._rQi));
      } else {
        this._rQ.copyWithin(0, this._rQi, this._rQlen);
      }
      this._rQlen = this._rQlen - this._rQi;
      this._rQi = 0;
    }
    _DecodeMessage(data) {
      const u8 = new Uint8Array(data);
      if (u8.length > this._rQbufferSize - this._rQlen) {
        this._expandCompactRQ(u8.length);
      }
      this._rQ.set(u8, this._rQlen);
      this._rQlen += u8.length;
    }
    _recvMessage(e2) {
      this._DecodeMessage(e2.data);
      if (this.rQlen > 0) {
        this._eventHandlers.message();
        if (this._rQlen == this._rQi) {
          this._rQlen = 0;
          this._rQi = 0;
        }
      } else {
        Debug("Ignoring empty message");
      }
    }
  };
  var websock_default = Websock;

  // core/des.js
  var PC2 = [
    13,
    16,
    10,
    23,
    0,
    4,
    2,
    27,
    14,
    5,
    20,
    9,
    22,
    18,
    11,
    3,
    25,
    7,
    15,
    6,
    26,
    19,
    12,
    1,
    40,
    51,
    30,
    36,
    46,
    54,
    29,
    39,
    50,
    44,
    32,
    47,
    43,
    48,
    38,
    55,
    33,
    52,
    45,
    41,
    49,
    35,
    28,
    31
  ];
  var totrot = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
  var z = 0;
  var a;
  var b;
  var c;
  var d;
  var e;
  var f;
  a = 1 << 16;
  b = 1 << 24;
  c = a | b;
  d = 1 << 2;
  e = 1 << 10;
  f = d | e;
  var SP1 = [
    c | e,
    z | z,
    a | z,
    c | f,
    c | d,
    a | f,
    z | d,
    a | z,
    z | e,
    c | e,
    c | f,
    z | e,
    b | f,
    c | d,
    b | z,
    z | d,
    z | f,
    b | e,
    b | e,
    a | e,
    a | e,
    c | z,
    c | z,
    b | f,
    a | d,
    b | d,
    b | d,
    a | d,
    z | z,
    z | f,
    a | f,
    b | z,
    a | z,
    c | f,
    z | d,
    c | z,
    c | e,
    b | z,
    b | z,
    z | e,
    c | d,
    a | z,
    a | e,
    b | d,
    z | e,
    z | d,
    b | f,
    a | f,
    c | f,
    a | d,
    c | z,
    b | f,
    b | d,
    z | f,
    a | f,
    c | e,
    z | f,
    b | e,
    b | e,
    z | z,
    a | d,
    a | e,
    z | z,
    c | d
  ];
  a = 1 << 20;
  b = 1 << 31;
  c = a | b;
  d = 1 << 5;
  e = 1 << 15;
  f = d | e;
  var SP2 = [
    c | f,
    b | e,
    z | e,
    a | f,
    a | z,
    z | d,
    c | d,
    b | f,
    b | d,
    c | f,
    c | e,
    b | z,
    b | e,
    a | z,
    z | d,
    c | d,
    a | e,
    a | d,
    b | f,
    z | z,
    b | z,
    z | e,
    a | f,
    c | z,
    a | d,
    b | d,
    z | z,
    a | e,
    z | f,
    c | e,
    c | z,
    z | f,
    z | z,
    a | f,
    c | d,
    a | z,
    b | f,
    c | z,
    c | e,
    z | e,
    c | z,
    b | e,
    z | d,
    c | f,
    a | f,
    z | d,
    z | e,
    b | z,
    z | f,
    c | e,
    a | z,
    b | d,
    a | d,
    b | f,
    b | d,
    a | d,
    a | e,
    z | z,
    b | e,
    z | f,
    b | z,
    c | d,
    c | f,
    a | e
  ];
  a = 1 << 17;
  b = 1 << 27;
  c = a | b;
  d = 1 << 3;
  e = 1 << 9;
  f = d | e;
  var SP3 = [
    z | f,
    c | e,
    z | z,
    c | d,
    b | e,
    z | z,
    a | f,
    b | e,
    a | d,
    b | d,
    b | d,
    a | z,
    c | f,
    a | d,
    c | z,
    z | f,
    b | z,
    z | d,
    c | e,
    z | e,
    a | e,
    c | z,
    c | d,
    a | f,
    b | f,
    a | e,
    a | z,
    b | f,
    z | d,
    c | f,
    z | e,
    b | z,
    c | e,
    b | z,
    a | d,
    z | f,
    a | z,
    c | e,
    b | e,
    z | z,
    z | e,
    a | d,
    c | f,
    b | e,
    b | d,
    z | e,
    z | z,
    c | d,
    b | f,
    a | z,
    b | z,
    c | f,
    z | d,
    a | f,
    a | e,
    b | d,
    c | z,
    b | f,
    z | f,
    c | z,
    a | f,
    z | d,
    c | d,
    a | e
  ];
  a = 1 << 13;
  b = 1 << 23;
  c = a | b;
  d = 1 << 0;
  e = 1 << 7;
  f = d | e;
  var SP4 = [
    c | d,
    a | f,
    a | f,
    z | e,
    c | e,
    b | f,
    b | d,
    a | d,
    z | z,
    c | z,
    c | z,
    c | f,
    z | f,
    z | z,
    b | e,
    b | d,
    z | d,
    a | z,
    b | z,
    c | d,
    z | e,
    b | z,
    a | d,
    a | e,
    b | f,
    z | d,
    a | e,
    b | e,
    a | z,
    c | e,
    c | f,
    z | f,
    b | e,
    b | d,
    c | z,
    c | f,
    z | f,
    z | z,
    z | z,
    c | z,
    a | e,
    b | e,
    b | f,
    z | d,
    c | d,
    a | f,
    a | f,
    z | e,
    c | f,
    z | f,
    z | d,
    a | z,
    b | d,
    a | d,
    c | e,
    b | f,
    a | d,
    a | e,
    b | z,
    c | d,
    z | e,
    b | z,
    a | z,
    c | e
  ];
  a = 1 << 25;
  b = 1 << 30;
  c = a | b;
  d = 1 << 8;
  e = 1 << 19;
  f = d | e;
  var SP5 = [
    z | d,
    a | f,
    a | e,
    c | d,
    z | e,
    z | d,
    b | z,
    a | e,
    b | f,
    z | e,
    a | d,
    b | f,
    c | d,
    c | e,
    z | f,
    b | z,
    a | z,
    b | e,
    b | e,
    z | z,
    b | d,
    c | f,
    c | f,
    a | d,
    c | e,
    b | d,
    z | z,
    c | z,
    a | f,
    a | z,
    c | z,
    z | f,
    z | e,
    c | d,
    z | d,
    a | z,
    b | z,
    a | e,
    c | d,
    b | f,
    a | d,
    b | z,
    c | e,
    a | f,
    b | f,
    z | d,
    a | z,
    c | e,
    c | f,
    z | f,
    c | z,
    c | f,
    a | e,
    z | z,
    b | e,
    c | z,
    z | f,
    a | d,
    b | d,
    z | e,
    z | z,
    b | e,
    a | f,
    b | d
  ];
  a = 1 << 22;
  b = 1 << 29;
  c = a | b;
  d = 1 << 4;
  e = 1 << 14;
  f = d | e;
  var SP6 = [
    b | d,
    c | z,
    z | e,
    c | f,
    c | z,
    z | d,
    c | f,
    a | z,
    b | e,
    a | f,
    a | z,
    b | d,
    a | d,
    b | e,
    b | z,
    z | f,
    z | z,
    a | d,
    b | f,
    z | e,
    a | e,
    b | f,
    z | d,
    c | d,
    c | d,
    z | z,
    a | f,
    c | e,
    z | f,
    a | e,
    c | e,
    b | z,
    b | e,
    z | d,
    c | d,
    a | e,
    c | f,
    a | z,
    z | f,
    b | d,
    a | z,
    b | e,
    b | z,
    z | f,
    b | d,
    c | f,
    a | e,
    c | z,
    a | f,
    c | e,
    z | z,
    c | d,
    z | d,
    z | e,
    c | z,
    a | f,
    z | e,
    a | d,
    b | f,
    z | z,
    c | e,
    b | z,
    a | d,
    b | f
  ];
  a = 1 << 21;
  b = 1 << 26;
  c = a | b;
  d = 1 << 1;
  e = 1 << 11;
  f = d | e;
  var SP7 = [
    a | z,
    c | d,
    b | f,
    z | z,
    z | e,
    b | f,
    a | f,
    c | e,
    c | f,
    a | z,
    z | z,
    b | d,
    z | d,
    b | z,
    c | d,
    z | f,
    b | e,
    a | f,
    a | d,
    b | e,
    b | d,
    c | z,
    c | e,
    a | d,
    c | z,
    z | e,
    z | f,
    c | f,
    a | e,
    z | d,
    b | z,
    a | e,
    b | z,
    a | e,
    a | z,
    b | f,
    b | f,
    c | d,
    c | d,
    z | d,
    a | d,
    b | z,
    b | e,
    a | z,
    c | e,
    z | f,
    a | f,
    c | e,
    z | f,
    b | d,
    c | f,
    c | z,
    a | e,
    z | z,
    z | d,
    c | f,
    z | z,
    a | f,
    c | z,
    z | e,
    b | d,
    b | e,
    z | e,
    a | d
  ];
  a = 1 << 18;
  b = 1 << 28;
  c = a | b;
  d = 1 << 6;
  e = 1 << 12;
  f = d | e;
  var SP8 = [
    b | f,
    z | e,
    a | z,
    c | f,
    b | z,
    b | f,
    z | d,
    b | z,
    a | d,
    c | z,
    c | f,
    a | e,
    c | e,
    a | f,
    z | e,
    z | d,
    c | z,
    b | d,
    b | e,
    z | f,
    a | e,
    a | d,
    c | d,
    c | e,
    z | f,
    z | z,
    z | z,
    c | d,
    b | d,
    b | e,
    a | f,
    a | z,
    a | f,
    a | z,
    c | e,
    z | e,
    z | d,
    c | d,
    z | e,
    a | f,
    b | e,
    z | d,
    b | d,
    c | z,
    c | d,
    b | z,
    a | z,
    b | f,
    z | z,
    c | f,
    a | d,
    b | d,
    c | z,
    b | e,
    b | f,
    z | z,
    c | f,
    a | e,
    a | e,
    z | f,
    z | f,
    a | d,
    b | z,
    c | e
  ];
  var DES = class {
    constructor(password) {
      this.keys = [];
      const pc1m = [], pcr = [], kn = [];
      for (let j = 0, l = 56; j < 56; ++j, l -= 8) {
        l += l < -5 ? 65 : l < -3 ? 31 : l < -1 ? 63 : l === 27 ? 35 : 0;
        const m = l & 7;
        pc1m[j] = (password[l >>> 3] & 1 << m) !== 0 ? 1 : 0;
      }
      for (let i = 0; i < 16; ++i) {
        const m = i << 1;
        const n = m + 1;
        kn[m] = kn[n] = 0;
        for (let o = 28; o < 59; o += 28) {
          for (let j = o - 28; j < o; ++j) {
            const l = j + totrot[i];
            pcr[j] = l < o ? pc1m[l] : pc1m[l - 28];
          }
        }
        for (let j = 0; j < 24; ++j) {
          if (pcr[PC2[j]] !== 0) {
            kn[m] |= 1 << 23 - j;
          }
          if (pcr[PC2[j + 24]] !== 0) {
            kn[n] |= 1 << 23 - j;
          }
        }
      }
      for (let i = 0, rawi = 0, KnLi = 0; i < 16; ++i) {
        const raw0 = kn[rawi++];
        const raw1 = kn[rawi++];
        this.keys[KnLi] = (raw0 & 16515072) << 6;
        this.keys[KnLi] |= (raw0 & 4032) << 10;
        this.keys[KnLi] |= (raw1 & 16515072) >>> 10;
        this.keys[KnLi] |= (raw1 & 4032) >>> 6;
        ++KnLi;
        this.keys[KnLi] = (raw0 & 258048) << 12;
        this.keys[KnLi] |= (raw0 & 63) << 16;
        this.keys[KnLi] |= (raw1 & 258048) >>> 4;
        this.keys[KnLi] |= raw1 & 63;
        ++KnLi;
      }
    }
    enc8(text) {
      const b2 = text.slice();
      let i = 0, l, r, x;
      l = b2[i++] << 24 | b2[i++] << 16 | b2[i++] << 8 | b2[i++];
      r = b2[i++] << 24 | b2[i++] << 16 | b2[i++] << 8 | b2[i++];
      x = (l >>> 4 ^ r) & 252645135;
      r ^= x;
      l ^= x << 4;
      x = (l >>> 16 ^ r) & 65535;
      r ^= x;
      l ^= x << 16;
      x = (r >>> 2 ^ l) & 858993459;
      l ^= x;
      r ^= x << 2;
      x = (r >>> 8 ^ l) & 16711935;
      l ^= x;
      r ^= x << 8;
      r = r << 1 | r >>> 31 & 1;
      x = (l ^ r) & 2863311530;
      l ^= x;
      r ^= x;
      l = l << 1 | l >>> 31 & 1;
      for (let i2 = 0, keysi = 0; i2 < 8; ++i2) {
        x = r << 28 | r >>> 4;
        x ^= this.keys[keysi++];
        let fval = SP7[x & 63];
        fval |= SP5[x >>> 8 & 63];
        fval |= SP3[x >>> 16 & 63];
        fval |= SP1[x >>> 24 & 63];
        x = r ^ this.keys[keysi++];
        fval |= SP8[x & 63];
        fval |= SP6[x >>> 8 & 63];
        fval |= SP4[x >>> 16 & 63];
        fval |= SP2[x >>> 24 & 63];
        l ^= fval;
        x = l << 28 | l >>> 4;
        x ^= this.keys[keysi++];
        fval = SP7[x & 63];
        fval |= SP5[x >>> 8 & 63];
        fval |= SP3[x >>> 16 & 63];
        fval |= SP1[x >>> 24 & 63];
        x = l ^ this.keys[keysi++];
        fval |= SP8[x & 63];
        fval |= SP6[x >>> 8 & 63];
        fval |= SP4[x >>> 16 & 63];
        fval |= SP2[x >>> 24 & 63];
        r ^= fval;
      }
      r = r << 31 | r >>> 1;
      x = (l ^ r) & 2863311530;
      l ^= x;
      r ^= x;
      l = l << 31 | l >>> 1;
      x = (l >>> 8 ^ r) & 16711935;
      r ^= x;
      l ^= x << 8;
      x = (l >>> 2 ^ r) & 858993459;
      r ^= x;
      l ^= x << 2;
      x = (r >>> 16 ^ l) & 65535;
      l ^= x;
      r ^= x << 16;
      x = (r >>> 4 ^ l) & 252645135;
      l ^= x;
      r ^= x << 4;
      x = [r, l];
      for (i = 0; i < 8; i++) {
        b2[i] = (x[i >>> 2] >>> 8 * (3 - i % 4)) % 256;
        if (b2[i] < 0) {
          b2[i] += 256;
        }
      }
      return b2;
    }
    encrypt(t) {
      return this.enc8(t.slice(0, 8)).concat(this.enc8(t.slice(8, 16)));
    }
  };
  var des_default = DES;

  // core/input/xtscancodes.js
  var xtscancodes_default = {
    Again: 57349,
    AltLeft: 56,
    AltRight: 57400,
    ArrowDown: 57424,
    ArrowLeft: 57419,
    ArrowRight: 57421,
    ArrowUp: 57416,
    AudioVolumeDown: 57390,
    AudioVolumeMute: 57376,
    AudioVolumeUp: 57392,
    Backquote: 41,
    Backslash: 43,
    Backspace: 14,
    BracketLeft: 26,
    BracketRight: 27,
    BrowserBack: 57450,
    BrowserFavorites: 57446,
    BrowserForward: 57449,
    BrowserHome: 57394,
    BrowserRefresh: 57447,
    BrowserSearch: 57445,
    BrowserStop: 57448,
    CapsLock: 58,
    Comma: 51,
    ContextMenu: 57437,
    ControlLeft: 29,
    ControlRight: 57373,
    Convert: 121,
    Copy: 57464,
    Cut: 57404,
    Delete: 57427,
    Digit0: 11,
    Digit1: 2,
    Digit2: 3,
    Digit3: 4,
    Digit4: 5,
    Digit5: 6,
    Digit6: 7,
    Digit7: 8,
    Digit8: 9,
    Digit9: 10,
    Eject: 57469,
    End: 57423,
    Enter: 28,
    Equal: 13,
    Escape: 1,
    F1: 59,
    F10: 68,
    F11: 87,
    F12: 88,
    F13: 93,
    F14: 94,
    F15: 95,
    F16: 85,
    F17: 57347,
    F18: 57463,
    F19: 57348,
    F2: 60,
    F20: 90,
    F21: 116,
    F22: 57465,
    F23: 109,
    F24: 111,
    F3: 61,
    F4: 62,
    F5: 63,
    F6: 64,
    F7: 65,
    F8: 66,
    F9: 67,
    Find: 57409,
    Help: 57461,
    Hiragana: 119,
    Home: 57415,
    Insert: 57426,
    IntlBackslash: 86,
    IntlRo: 115,
    IntlYen: 125,
    KanaMode: 112,
    Katakana: 120,
    KeyA: 30,
    KeyB: 48,
    KeyC: 46,
    KeyD: 32,
    KeyE: 18,
    KeyF: 33,
    KeyG: 34,
    KeyH: 35,
    KeyI: 23,
    KeyJ: 36,
    KeyK: 37,
    KeyL: 38,
    KeyM: 50,
    KeyN: 49,
    KeyO: 24,
    KeyP: 25,
    KeyQ: 16,
    KeyR: 19,
    KeyS: 31,
    KeyT: 20,
    KeyU: 22,
    KeyV: 47,
    KeyW: 17,
    KeyX: 45,
    KeyY: 21,
    KeyZ: 44,
    Lang1: 114,
    Lang2: 113,
    Lang3: 120,
    Lang4: 119,
    Lang5: 118,
    LaunchApp1: 57451,
    LaunchApp2: 57377,
    LaunchMail: 57452,
    MediaPlayPause: 57378,
    MediaSelect: 57453,
    MediaStop: 57380,
    MediaTrackNext: 57369,
    MediaTrackPrevious: 57360,
    MetaLeft: 57435,
    MetaRight: 57436,
    Minus: 12,
    NonConvert: 123,
    NumLock: 69,
    Numpad0: 82,
    Numpad1: 79,
    Numpad2: 80,
    Numpad3: 81,
    Numpad4: 75,
    Numpad5: 76,
    Numpad6: 77,
    Numpad7: 71,
    Numpad8: 72,
    Numpad9: 73,
    NumpadAdd: 78,
    NumpadComma: 126,
    NumpadDecimal: 83,
    NumpadDivide: 57397,
    NumpadEnter: 57372,
    NumpadEqual: 89,
    NumpadMultiply: 55,
    NumpadParenLeft: 57462,
    NumpadParenRight: 57467,
    NumpadSubtract: 74,
    Open: 100,
    PageDown: 57425,
    PageUp: 57417,
    Paste: 101,
    Pause: 57414,
    Period: 52,
    Power: 57438,
    PrintScreen: 84,
    Props: 57350,
    Quote: 40,
    ScrollLock: 70,
    Semicolon: 39,
    ShiftLeft: 42,
    ShiftRight: 54,
    Slash: 53,
    Sleep: 57439,
    Space: 57,
    Suspend: 57381,
    Tab: 15,
    Undo: 57351,
    WakeUp: 57443
  };

  // core/encodings.js
  var encodings = {
    encodingRaw: 0,
    encodingCopyRect: 1,
    encodingRRE: 2,
    encodingHextile: 5,
    encodingTight: 7,
    encodingZRLE: 16,
    encodingTightPNG: -260,
    encodingJPEG: 21,
    pseudoEncodingQualityLevel9: -23,
    pseudoEncodingQualityLevel0: -32,
    pseudoEncodingDesktopSize: -223,
    pseudoEncodingLastRect: -224,
    pseudoEncodingCursor: -239,
    pseudoEncodingQEMUExtendedKeyEvent: -258,
    pseudoEncodingDesktopName: -307,
    pseudoEncodingExtendedDesktopSize: -308,
    pseudoEncodingXvp: -309,
    pseudoEncodingFence: -312,
    pseudoEncodingContinuousUpdates: -313,
    pseudoEncodingCompressLevel9: -247,
    pseudoEncodingCompressLevel0: -256,
    pseudoEncodingVMwareCursor: 1464686180,
    pseudoEncodingExtendedClipboard: 3231835598
  };

  // core/ra2.js
  var AESEAXCipher = class {
    constructor() {
      this._rawKey = null;
      this._ctrKey = null;
      this._cbcKey = null;
      this._zeroBlock = new Uint8Array(16);
      this._prefixBlock0 = this._zeroBlock;
      this._prefixBlock1 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      this._prefixBlock2 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
    }
    async _encryptBlock(block) {
      const encrypted = await window.crypto.subtle.encrypt({
        name: "AES-CBC",
        iv: this._zeroBlock
      }, this._cbcKey, block);
      return new Uint8Array(encrypted).slice(0, 16);
    }
    async _initCMAC() {
      const k1 = await this._encryptBlock(this._zeroBlock);
      const k2 = new Uint8Array(16);
      const v = k1[0] >>> 6;
      for (let i = 0; i < 15; i++) {
        k2[i] = k1[i + 1] >> 6 | k1[i] << 2;
        k1[i] = k1[i + 1] >> 7 | k1[i] << 1;
      }
      const lut = [0, 135, 14, 137];
      k2[14] ^= v >>> 1;
      k2[15] = k1[15] << 2 ^ lut[v];
      k1[15] = k1[15] << 1 ^ lut[v >> 1];
      this._k1 = k1;
      this._k2 = k2;
    }
    async _encryptCTR(data, counter) {
      const encrypted = await window.crypto.subtle.encrypt({
        name: "AES-CTR",
        counter,
        length: 128
      }, this._ctrKey, data);
      return new Uint8Array(encrypted);
    }
    async _decryptCTR(data, counter) {
      const decrypted = await window.crypto.subtle.decrypt({
        name: "AES-CTR",
        counter,
        length: 128
      }, this._ctrKey, data);
      return new Uint8Array(decrypted);
    }
    async _computeCMAC(data, prefixBlock) {
      if (prefixBlock.length !== 16) {
        return null;
      }
      const n = Math.floor(data.length / 16);
      const m = Math.ceil(data.length / 16);
      const r = data.length - n * 16;
      const cbcData = new Uint8Array((m + 1) * 16);
      cbcData.set(prefixBlock);
      cbcData.set(data, 16);
      if (r === 0) {
        for (let i = 0; i < 16; i++) {
          cbcData[n * 16 + i] ^= this._k1[i];
        }
      } else {
        cbcData[(n + 1) * 16 + r] = 128;
        for (let i = 0; i < 16; i++) {
          cbcData[(n + 1) * 16 + i] ^= this._k2[i];
        }
      }
      let cbcEncrypted = await window.crypto.subtle.encrypt({
        name: "AES-CBC",
        iv: this._zeroBlock
      }, this._cbcKey, cbcData);
      cbcEncrypted = new Uint8Array(cbcEncrypted);
      const mac = cbcEncrypted.slice(cbcEncrypted.length - 32, cbcEncrypted.length - 16);
      return mac;
    }
    async setKey(key) {
      this._rawKey = key;
      this._ctrKey = await window.crypto.subtle.importKey("raw", key, {name: "AES-CTR"}, false, ["encrypt", "decrypt"]);
      this._cbcKey = await window.crypto.subtle.importKey("raw", key, {name: "AES-CBC"}, false, ["encrypt", "decrypt"]);
      await this._initCMAC();
    }
    async encrypt(message, associatedData, nonce) {
      const nCMAC = await this._computeCMAC(nonce, this._prefixBlock0);
      const encrypted = await this._encryptCTR(message, nCMAC);
      const adCMAC = await this._computeCMAC(associatedData, this._prefixBlock1);
      const mac = await this._computeCMAC(encrypted, this._prefixBlock2);
      for (let i = 0; i < 16; i++) {
        mac[i] ^= nCMAC[i] ^ adCMAC[i];
      }
      const res = new Uint8Array(16 + encrypted.length);
      res.set(encrypted);
      res.set(mac, encrypted.length);
      return res;
    }
    async decrypt(encrypted, associatedData, nonce, mac) {
      const nCMAC = await this._computeCMAC(nonce, this._prefixBlock0);
      const adCMAC = await this._computeCMAC(associatedData, this._prefixBlock1);
      const computedMac = await this._computeCMAC(encrypted, this._prefixBlock2);
      for (let i = 0; i < 16; i++) {
        computedMac[i] ^= nCMAC[i] ^ adCMAC[i];
      }
      if (computedMac.length !== mac.length) {
        return null;
      }
      for (let i = 0; i < mac.length; i++) {
        if (computedMac[i] !== mac[i]) {
          return null;
        }
      }
      const res = await this._decryptCTR(encrypted, nCMAC);
      return res;
    }
  };
  var RA2Cipher = class {
    constructor() {
      this._cipher = new AESEAXCipher();
      this._counter = new Uint8Array(16);
    }
    async setKey(key) {
      await this._cipher.setKey(key);
    }
    async makeMessage(message) {
      const ad = new Uint8Array([(message.length & 65280) >>> 8, message.length & 255]);
      const encrypted = await this._cipher.encrypt(message, ad, this._counter);
      for (let i = 0; i < 16 && this._counter[i]++ === 255; i++)
        ;
      const res = new Uint8Array(message.length + 2 + 16);
      res.set(ad);
      res.set(encrypted, 2);
      return res;
    }
    async receiveMessage(length, encrypted, mac) {
      const ad = new Uint8Array([(length & 65280) >>> 8, length & 255]);
      const res = await this._cipher.decrypt(encrypted, ad, this._counter, mac);
      for (let i = 0; i < 16 && this._counter[i]++ === 255; i++)
        ;
      return res;
    }
  };
  var RSACipher = class {
    constructor(keyLength) {
      this._key = null;
      this._keyLength = keyLength;
      this._keyBytes = Math.ceil(keyLength / 8);
      this._n = null;
      this._e = null;
      this._d = null;
      this._nBigInt = null;
      this._eBigInt = null;
      this._dBigInt = null;
    }
    _base64urlDecode(data) {
      data = data.replace(/-/g, "+").replace(/_/g, "/");
      data = data.padEnd(Math.ceil(data.length / 4) * 4, "=");
      return base64_default.decode(data);
    }
    _u8ArrayToBigInt(arr) {
      let hex = "0x";
      for (let i = 0; i < arr.length; i++) {
        hex += arr[i].toString(16).padStart(2, "0");
      }
      return BigInt(hex);
    }
    _padArray(arr, length) {
      const res = new Uint8Array(length);
      res.set(arr, length - arr.length);
      return res;
    }
    _bigIntToU8Array(bigint, padLength = 0) {
      let hex = bigint.toString(16);
      if (padLength === 0) {
        padLength = Math.ceil(hex.length / 2) * 2;
      }
      hex = hex.padStart(padLength * 2, "0");
      const length = hex.length / 2;
      const arr = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }
      return arr;
    }
    _modPow(b2, e2, m) {
      if (m === 1n) {
        return 0;
      }
      let r = 1n;
      b2 = b2 % m;
      while (e2 > 0) {
        if (e2 % 2n === 1n) {
          r = r * b2 % m;
        }
        e2 = e2 / 2n;
        b2 = b2 * b2 % m;
      }
      return r;
    }
    async generateKey() {
      this._key = await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: this._keyLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: "SHA-256"}
      }, true, ["encrypt", "decrypt"]);
      const privateKey = await window.crypto.subtle.exportKey("jwk", this._key.privateKey);
      this._n = this._padArray(this._base64urlDecode(privateKey.n), this._keyBytes);
      this._nBigInt = this._u8ArrayToBigInt(this._n);
      this._e = this._padArray(this._base64urlDecode(privateKey.e), this._keyBytes);
      this._eBigInt = this._u8ArrayToBigInt(this._e);
      this._d = this._padArray(this._base64urlDecode(privateKey.d), this._keyBytes);
      this._dBigInt = this._u8ArrayToBigInt(this._d);
    }
    setPublicKey(n, e2) {
      if (n.length !== this._keyBytes || e2.length !== this._keyBytes) {
        return;
      }
      this._n = new Uint8Array(this._keyBytes);
      this._e = new Uint8Array(this._keyBytes);
      this._n.set(n);
      this._e.set(e2);
      this._nBigInt = this._u8ArrayToBigInt(this._n);
      this._eBigInt = this._u8ArrayToBigInt(this._e);
    }
    encrypt(message) {
      if (message.length > this._keyBytes - 11) {
        return null;
      }
      const ps = new Uint8Array(this._keyBytes - message.length - 3);
      window.crypto.getRandomValues(ps);
      for (let i = 0; i < ps.length; i++) {
        ps[i] = Math.floor(ps[i] * 254 / 255 + 1);
      }
      const em = new Uint8Array(this._keyBytes);
      em[1] = 2;
      em.set(ps, 2);
      em.set(message, ps.length + 3);
      const emBigInt = this._u8ArrayToBigInt(em);
      const c2 = this._modPow(emBigInt, this._eBigInt, this._nBigInt);
      return this._bigIntToU8Array(c2, this._keyBytes);
    }
    decrypt(message) {
      if (message.length !== this._keyBytes) {
        return null;
      }
      const msgBigInt = this._u8ArrayToBigInt(message);
      const emBigInt = this._modPow(msgBigInt, this._dBigInt, this._nBigInt);
      const em = this._bigIntToU8Array(emBigInt, this._keyBytes);
      if (em[0] !== 0 || em[1] !== 2) {
        return null;
      }
      let i = 2;
      for (; i < em.length; i++) {
        if (em[i] === 0) {
          break;
        }
      }
      if (i === em.length) {
        return null;
      }
      return em.slice(i + 1, em.length);
    }
    get keyLength() {
      return this._keyLength;
    }
    get n() {
      return this._n;
    }
    get e() {
      return this._e;
    }
    get d() {
      return this._d;
    }
  };
  var RSAAESAuthenticationState = class extends eventtarget_default {
    constructor(sock, getCredentials) {
      super();
      this._hasStarted = false;
      this._checkSock = null;
      this._checkCredentials = null;
      this._approveServerResolve = null;
      this._sockReject = null;
      this._credentialsReject = null;
      this._approveServerReject = null;
      this._sock = sock;
      this._getCredentials = getCredentials;
    }
    _waitSockAsync(len) {
      return new Promise((resolve, reject) => {
        const hasData = () => !this._sock.rQwait("RA2", len);
        if (hasData()) {
          resolve();
        } else {
          this._checkSock = () => {
            if (hasData()) {
              resolve();
              this._checkSock = null;
              this._sockReject = null;
            }
          };
          this._sockReject = reject;
        }
      });
    }
    _waitApproveKeyAsync() {
      return new Promise((resolve, reject) => {
        this._approveServerResolve = resolve;
        this._approveServerReject = reject;
      });
    }
    _waitCredentialsAsync(subtype) {
      const hasCredentials = () => {
        if (subtype === 1 && this._getCredentials().username !== void 0 && this._getCredentials().password !== void 0) {
          return true;
        } else if (subtype === 2 && this._getCredentials().password !== void 0) {
          return true;
        }
        return false;
      };
      return new Promise((resolve, reject) => {
        if (hasCredentials()) {
          resolve();
        } else {
          this._checkCredentials = () => {
            if (hasCredentials()) {
              resolve();
              this._checkCredentials = null;
              this._credentialsReject = null;
            }
          };
          this._credentialsReject = reject;
        }
      });
    }
    checkInternalEvents() {
      if (this._checkSock !== null) {
        this._checkSock();
      }
      if (this._checkCredentials !== null) {
        this._checkCredentials();
      }
    }
    approveServer() {
      if (this._approveServerResolve !== null) {
        this._approveServerResolve();
        this._approveServerResolve = null;
      }
    }
    disconnect() {
      if (this._sockReject !== null) {
        this._sockReject(new Error("disconnect normally"));
        this._sockReject = null;
      }
      if (this._credentialsReject !== null) {
        this._credentialsReject(new Error("disconnect normally"));
        this._credentialsReject = null;
      }
      if (this._approveServerReject !== null) {
        this._approveServerReject(new Error("disconnect normally"));
        this._approveServerReject = null;
      }
    }
    async negotiateRA2neAuthAsync() {
      this._hasStarted = true;
      await this._waitSockAsync(4);
      const serverKeyLengthBuffer = this._sock.rQslice(0, 4);
      const serverKeyLength = this._sock.rQshift32();
      if (serverKeyLength < 1024) {
        throw new Error("RA2: server public key is too short: " + serverKeyLength);
      } else if (serverKeyLength > 8192) {
        throw new Error("RA2: server public key is too long: " + serverKeyLength);
      }
      const serverKeyBytes = Math.ceil(serverKeyLength / 8);
      await this._waitSockAsync(serverKeyBytes * 2);
      const serverN = this._sock.rQshiftBytes(serverKeyBytes);
      const serverE = this._sock.rQshiftBytes(serverKeyBytes);
      const serverRSACipher = new RSACipher(serverKeyLength);
      serverRSACipher.setPublicKey(serverN, serverE);
      const serverPublickey = new Uint8Array(4 + serverKeyBytes * 2);
      serverPublickey.set(serverKeyLengthBuffer);
      serverPublickey.set(serverN, 4);
      serverPublickey.set(serverE, 4 + serverKeyBytes);
      this.dispatchEvent(new CustomEvent("serververification", {
        detail: {type: "RSA", publickey: serverPublickey}
      }));
      await this._waitApproveKeyAsync();
      const clientKeyLength = 2048;
      const clientKeyBytes = Math.ceil(clientKeyLength / 8);
      const clientRSACipher = new RSACipher(clientKeyLength);
      await clientRSACipher.generateKey();
      const clientN = clientRSACipher.n;
      const clientE = clientRSACipher.e;
      const clientPublicKey = new Uint8Array(4 + clientKeyBytes * 2);
      clientPublicKey[0] = (clientKeyLength & 4278190080) >>> 24;
      clientPublicKey[1] = (clientKeyLength & 16711680) >>> 16;
      clientPublicKey[2] = (clientKeyLength & 65280) >>> 8;
      clientPublicKey[3] = clientKeyLength & 255;
      clientPublicKey.set(clientN, 4);
      clientPublicKey.set(clientE, 4 + clientKeyBytes);
      this._sock.send(clientPublicKey);
      const clientRandom = new Uint8Array(16);
      window.crypto.getRandomValues(clientRandom);
      const clientEncryptedRandom = serverRSACipher.encrypt(clientRandom);
      const clientRandomMessage = new Uint8Array(2 + serverKeyBytes);
      clientRandomMessage[0] = (serverKeyBytes & 65280) >>> 8;
      clientRandomMessage[1] = serverKeyBytes & 255;
      clientRandomMessage.set(clientEncryptedRandom, 2);
      this._sock.send(clientRandomMessage);
      await this._waitSockAsync(2);
      if (this._sock.rQshift16() !== clientKeyBytes) {
        throw new Error("RA2: wrong encrypted message length");
      }
      const serverEncryptedRandom = this._sock.rQshiftBytes(clientKeyBytes);
      const serverRandom = clientRSACipher.decrypt(serverEncryptedRandom);
      if (serverRandom === null || serverRandom.length !== 16) {
        throw new Error("RA2: corrupted server encrypted random");
      }
      let clientSessionKey = new Uint8Array(32);
      let serverSessionKey = new Uint8Array(32);
      clientSessionKey.set(serverRandom);
      clientSessionKey.set(clientRandom, 16);
      serverSessionKey.set(clientRandom);
      serverSessionKey.set(serverRandom, 16);
      clientSessionKey = await window.crypto.subtle.digest("SHA-1", clientSessionKey);
      clientSessionKey = new Uint8Array(clientSessionKey).slice(0, 16);
      serverSessionKey = await window.crypto.subtle.digest("SHA-1", serverSessionKey);
      serverSessionKey = new Uint8Array(serverSessionKey).slice(0, 16);
      const clientCipher = new RA2Cipher();
      await clientCipher.setKey(clientSessionKey);
      const serverCipher = new RA2Cipher();
      await serverCipher.setKey(serverSessionKey);
      let serverHash = new Uint8Array(8 + serverKeyBytes * 2 + clientKeyBytes * 2);
      let clientHash = new Uint8Array(8 + serverKeyBytes * 2 + clientKeyBytes * 2);
      serverHash.set(serverPublickey);
      serverHash.set(clientPublicKey, 4 + serverKeyBytes * 2);
      clientHash.set(clientPublicKey);
      clientHash.set(serverPublickey, 4 + clientKeyBytes * 2);
      serverHash = await window.crypto.subtle.digest("SHA-1", serverHash);
      clientHash = await window.crypto.subtle.digest("SHA-1", clientHash);
      serverHash = new Uint8Array(serverHash);
      clientHash = new Uint8Array(clientHash);
      this._sock.send(await clientCipher.makeMessage(clientHash));
      await this._waitSockAsync(2 + 20 + 16);
      if (this._sock.rQshift16() !== 20) {
        throw new Error("RA2: wrong server hash");
      }
      const serverHashReceived = await serverCipher.receiveMessage(20, this._sock.rQshiftBytes(20), this._sock.rQshiftBytes(16));
      if (serverHashReceived === null) {
        throw new Error("RA2: failed to authenticate the message");
      }
      for (let i = 0; i < 20; i++) {
        if (serverHashReceived[i] !== serverHash[i]) {
          throw new Error("RA2: wrong server hash");
        }
      }
      await this._waitSockAsync(2 + 1 + 16);
      if (this._sock.rQshift16() !== 1) {
        throw new Error("RA2: wrong subtype");
      }
      let subtype = await serverCipher.receiveMessage(1, this._sock.rQshiftBytes(1), this._sock.rQshiftBytes(16));
      if (subtype === null) {
        throw new Error("RA2: failed to authenticate the message");
      }
      subtype = subtype[0];
      if (subtype === 1) {
        if (this._getCredentials().username === void 0 || this._getCredentials().password === void 0) {
          this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password"]}}));
        }
      } else if (subtype === 2) {
        if (this._getCredentials().password === void 0) {
          this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["password"]}}));
        }
      } else {
        throw new Error("RA2: wrong subtype");
      }
      await this._waitCredentialsAsync(subtype);
      let username;
      if (subtype === 1) {
        username = encodeUTF8(this._getCredentials().username).slice(0, 255);
      } else {
        username = "";
      }
      const password = encodeUTF8(this._getCredentials().password).slice(0, 255);
      const credentials = new Uint8Array(username.length + password.length + 2);
      credentials[0] = username.length;
      credentials[username.length + 1] = password.length;
      for (let i = 0; i < username.length; i++) {
        credentials[i + 1] = username.charCodeAt(i);
      }
      for (let i = 0; i < password.length; i++) {
        credentials[username.length + 2 + i] = password.charCodeAt(i);
      }
      this._sock.send(await clientCipher.makeMessage(credentials));
    }
    get hasStarted() {
      return this._hasStarted;
    }
    set hasStarted(s) {
      this._hasStarted = s;
    }
  };
  var ra2_default = RSAAESAuthenticationState;

  // core/util/md5.js
  function MD5(d2) {
    let r = M(V(Y(X(d2), 8 * d2.length)));
    return r;
  }
  function M(d2) {
    let f2 = new Uint8Array(d2.length);
    for (let i = 0; i < d2.length; i++) {
      f2[i] = d2.charCodeAt(i);
    }
    return f2;
  }
  function X(d2) {
    let r = Array(d2.length >> 2);
    for (let m = 0; m < r.length; m++)
      r[m] = 0;
    for (let m = 0; m < 8 * d2.length; m += 8)
      r[m >> 5] |= (255 & d2.charCodeAt(m / 8)) << m % 32;
    return r;
  }
  function V(d2) {
    let r = "";
    for (let m = 0; m < 32 * d2.length; m += 8)
      r += String.fromCharCode(d2[m >> 5] >>> m % 32 & 255);
    return r;
  }
  function Y(d2, g) {
    d2[g >> 5] |= 128 << g % 32, d2[14 + (g + 64 >>> 9 << 4)] = g;
    let m = 1732584193, f2 = -271733879, r = -1732584194, i = 271733878;
    for (let n = 0; n < d2.length; n += 16) {
      let h = m, t = f2, g2 = r, e2 = i;
      f2 = ii(f2 = ii(f2 = ii(f2 = ii(f2 = hh(f2 = hh(f2 = hh(f2 = hh(f2 = gg(f2 = gg(f2 = gg(f2 = gg(f2 = ff(f2 = ff(f2 = ff(f2 = ff(f2, r = ff(r, i = ff(i, m = ff(m, f2, r, i, d2[n + 0], 7, -680876936), f2, r, d2[n + 1], 12, -389564586), m, f2, d2[n + 2], 17, 606105819), i, m, d2[n + 3], 22, -1044525330), r = ff(r, i = ff(i, m = ff(m, f2, r, i, d2[n + 4], 7, -176418897), f2, r, d2[n + 5], 12, 1200080426), m, f2, d2[n + 6], 17, -1473231341), i, m, d2[n + 7], 22, -45705983), r = ff(r, i = ff(i, m = ff(m, f2, r, i, d2[n + 8], 7, 1770035416), f2, r, d2[n + 9], 12, -1958414417), m, f2, d2[n + 10], 17, -42063), i, m, d2[n + 11], 22, -1990404162), r = ff(r, i = ff(i, m = ff(m, f2, r, i, d2[n + 12], 7, 1804603682), f2, r, d2[n + 13], 12, -40341101), m, f2, d2[n + 14], 17, -1502002290), i, m, d2[n + 15], 22, 1236535329), r = gg(r, i = gg(i, m = gg(m, f2, r, i, d2[n + 1], 5, -165796510), f2, r, d2[n + 6], 9, -1069501632), m, f2, d2[n + 11], 14, 643717713), i, m, d2[n + 0], 20, -373897302), r = gg(r, i = gg(i, m = gg(m, f2, r, i, d2[n + 5], 5, -701558691), f2, r, d2[n + 10], 9, 38016083), m, f2, d2[n + 15], 14, -660478335), i, m, d2[n + 4], 20, -405537848), r = gg(r, i = gg(i, m = gg(m, f2, r, i, d2[n + 9], 5, 568446438), f2, r, d2[n + 14], 9, -1019803690), m, f2, d2[n + 3], 14, -187363961), i, m, d2[n + 8], 20, 1163531501), r = gg(r, i = gg(i, m = gg(m, f2, r, i, d2[n + 13], 5, -1444681467), f2, r, d2[n + 2], 9, -51403784), m, f2, d2[n + 7], 14, 1735328473), i, m, d2[n + 12], 20, -1926607734), r = hh(r, i = hh(i, m = hh(m, f2, r, i, d2[n + 5], 4, -378558), f2, r, d2[n + 8], 11, -2022574463), m, f2, d2[n + 11], 16, 1839030562), i, m, d2[n + 14], 23, -35309556), r = hh(r, i = hh(i, m = hh(m, f2, r, i, d2[n + 1], 4, -1530992060), f2, r, d2[n + 4], 11, 1272893353), m, f2, d2[n + 7], 16, -155497632), i, m, d2[n + 10], 23, -1094730640), r = hh(r, i = hh(i, m = hh(m, f2, r, i, d2[n + 13], 4, 681279174), f2, r, d2[n + 0], 11, -358537222), m, f2, d2[n + 3], 16, -722521979), i, m, d2[n + 6], 23, 76029189), r = hh(r, i = hh(i, m = hh(m, f2, r, i, d2[n + 9], 4, -640364487), f2, r, d2[n + 12], 11, -421815835), m, f2, d2[n + 15], 16, 530742520), i, m, d2[n + 2], 23, -995338651), r = ii(r, i = ii(i, m = ii(m, f2, r, i, d2[n + 0], 6, -198630844), f2, r, d2[n + 7], 10, 1126891415), m, f2, d2[n + 14], 15, -1416354905), i, m, d2[n + 5], 21, -57434055), r = ii(r, i = ii(i, m = ii(m, f2, r, i, d2[n + 12], 6, 1700485571), f2, r, d2[n + 3], 10, -1894986606), m, f2, d2[n + 10], 15, -1051523), i, m, d2[n + 1], 21, -2054922799), r = ii(r, i = ii(i, m = ii(m, f2, r, i, d2[n + 8], 6, 1873313359), f2, r, d2[n + 15], 10, -30611744), m, f2, d2[n + 6], 15, -1560198380), i, m, d2[n + 13], 21, 1309151649), r = ii(r, i = ii(i, m = ii(m, f2, r, i, d2[n + 4], 6, -145523070), f2, r, d2[n + 11], 10, -1120210379), m, f2, d2[n + 2], 15, 718787259), i, m, d2[n + 9], 21, -343485551), m = add(m, h), f2 = add(f2, t), r = add(r, g2), i = add(i, e2);
    }
    return Array(m, f2, r, i);
  }
  function cmn(d2, g, m, f2, r, i) {
    return add(rol(add(add(g, d2), add(f2, i)), r), m);
  }
  function ff(d2, g, m, f2, r, i, n) {
    return cmn(g & m | ~g & f2, d2, g, r, i, n);
  }
  function gg(d2, g, m, f2, r, i, n) {
    return cmn(g & f2 | m & ~f2, d2, g, r, i, n);
  }
  function hh(d2, g, m, f2, r, i, n) {
    return cmn(g ^ m ^ f2, d2, g, r, i, n);
  }
  function ii(d2, g, m, f2, r, i, n) {
    return cmn(m ^ (g | ~f2), d2, g, r, i, n);
  }
  function add(d2, g) {
    let m = (65535 & d2) + (65535 & g);
    return (d2 >> 16) + (g >> 16) + (m >> 16) << 16 | 65535 & m;
  }
  function rol(d2, g) {
    return d2 << g | d2 >>> 32 - g;
  }

  // core/decoders/raw.js
  var RawDecoder = class {
    constructor() {
      this._lines = 0;
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (width === 0 || height === 0) {
        return true;
      }
      if (this._lines === 0) {
        this._lines = height;
      }
      const pixelSize = depth == 8 ? 1 : 4;
      const bytesPerLine = width * pixelSize;
      if (sock.rQwait("RAW", bytesPerLine)) {
        return false;
      }
      const curY = y + (height - this._lines);
      const currHeight = Math.min(this._lines, Math.floor(sock.rQlen / bytesPerLine));
      const pixels = width * currHeight;
      let data = sock.rQ;
      let index = sock.rQi;
      if (depth == 8) {
        const newdata = new Uint8Array(pixels * 4);
        for (let i = 0; i < pixels; i++) {
          newdata[i * 4 + 0] = (data[index + i] >> 0 & 3) * 255 / 3;
          newdata[i * 4 + 1] = (data[index + i] >> 2 & 3) * 255 / 3;
          newdata[i * 4 + 2] = (data[index + i] >> 4 & 3) * 255 / 3;
          newdata[i * 4 + 3] = 255;
        }
        data = newdata;
        index = 0;
      }
      for (let i = 0; i < pixels; i++) {
        data[index + i * 4 + 3] = 255;
      }
      display.blitImage(x, curY, width, currHeight, data, index);
      sock.rQskipBytes(currHeight * bytesPerLine);
      this._lines -= currHeight;
      if (this._lines > 0) {
        return false;
      }
      return true;
    }
  };
  var raw_default = RawDecoder;

  // core/decoders/copyrect.js
  var CopyRectDecoder = class {
    decodeRect(x, y, width, height, sock, display, depth) {
      if (sock.rQwait("COPYRECT", 4)) {
        return false;
      }
      let deltaX = sock.rQshift16();
      let deltaY = sock.rQshift16();
      if (width === 0 || height === 0) {
        return true;
      }
      display.copyImage(deltaX, deltaY, x, y, width, height);
      return true;
    }
  };
  var copyrect_default = CopyRectDecoder;

  // core/decoders/rre.js
  var RREDecoder = class {
    constructor() {
      this._subrects = 0;
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (this._subrects === 0) {
        if (sock.rQwait("RRE", 4 + 4)) {
          return false;
        }
        this._subrects = sock.rQshift32();
        let color = sock.rQshiftBytes(4);
        display.fillRect(x, y, width, height, color);
      }
      while (this._subrects > 0) {
        if (sock.rQwait("RRE", 4 + 8)) {
          return false;
        }
        let color = sock.rQshiftBytes(4);
        let sx = sock.rQshift16();
        let sy = sock.rQshift16();
        let swidth = sock.rQshift16();
        let sheight = sock.rQshift16();
        display.fillRect(x + sx, y + sy, swidth, sheight, color);
        this._subrects--;
      }
      return true;
    }
  };
  var rre_default = RREDecoder;

  // core/decoders/hextile.js
  var HextileDecoder = class {
    constructor() {
      this._tiles = 0;
      this._lastsubencoding = 0;
      this._tileBuffer = new Uint8Array(16 * 16 * 4);
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (this._tiles === 0) {
        this._tilesX = Math.ceil(width / 16);
        this._tilesY = Math.ceil(height / 16);
        this._totalTiles = this._tilesX * this._tilesY;
        this._tiles = this._totalTiles;
      }
      while (this._tiles > 0) {
        let bytes = 1;
        if (sock.rQwait("HEXTILE", bytes)) {
          return false;
        }
        let rQ = sock.rQ;
        let rQi = sock.rQi;
        let subencoding = rQ[rQi];
        if (subencoding > 30) {
          throw new Error("Illegal hextile subencoding (subencoding: " + subencoding + ")");
        }
        const currTile = this._totalTiles - this._tiles;
        const tileX = currTile % this._tilesX;
        const tileY = Math.floor(currTile / this._tilesX);
        const tx = x + tileX * 16;
        const ty = y + tileY * 16;
        const tw = Math.min(16, x + width - tx);
        const th = Math.min(16, y + height - ty);
        if (subencoding & 1) {
          bytes += tw * th * 4;
        } else {
          if (subencoding & 2) {
            bytes += 4;
          }
          if (subencoding & 4) {
            bytes += 4;
          }
          if (subencoding & 8) {
            bytes++;
            if (sock.rQwait("HEXTILE", bytes)) {
              return false;
            }
            let subrects = rQ[rQi + bytes - 1];
            if (subencoding & 16) {
              bytes += subrects * (4 + 2);
            } else {
              bytes += subrects * 2;
            }
          }
        }
        if (sock.rQwait("HEXTILE", bytes)) {
          return false;
        }
        rQi++;
        if (subencoding === 0) {
          if (this._lastsubencoding & 1) {
            Debug("     Ignoring blank after RAW");
          } else {
            display.fillRect(tx, ty, tw, th, this._background);
          }
        } else if (subencoding & 1) {
          let pixels = tw * th;
          for (let i = 0; i < pixels; i++) {
            rQ[rQi + i * 4 + 3] = 255;
          }
          display.blitImage(tx, ty, tw, th, rQ, rQi);
          rQi += bytes - 1;
        } else {
          if (subencoding & 2) {
            this._background = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]];
            rQi += 4;
          }
          if (subencoding & 4) {
            this._foreground = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]];
            rQi += 4;
          }
          this._startTile(tx, ty, tw, th, this._background);
          if (subencoding & 8) {
            let subrects = rQ[rQi];
            rQi++;
            for (let s = 0; s < subrects; s++) {
              let color;
              if (subencoding & 16) {
                color = [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2], rQ[rQi + 3]];
                rQi += 4;
              } else {
                color = this._foreground;
              }
              const xy = rQ[rQi];
              rQi++;
              const sx = xy >> 4;
              const sy = xy & 15;
              const wh = rQ[rQi];
              rQi++;
              const sw = (wh >> 4) + 1;
              const sh = (wh & 15) + 1;
              this._subTile(sx, sy, sw, sh, color);
            }
          }
          this._finishTile(display);
        }
        sock.rQi = rQi;
        this._lastsubencoding = subencoding;
        this._tiles--;
      }
      return true;
    }
    _startTile(x, y, width, height, color) {
      this._tileX = x;
      this._tileY = y;
      this._tileW = width;
      this._tileH = height;
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const data = this._tileBuffer;
      for (let i = 0; i < width * height * 4; i += 4) {
        data[i] = red;
        data[i + 1] = green;
        data[i + 2] = blue;
        data[i + 3] = 255;
      }
    }
    _subTile(x, y, w, h, color) {
      const red = color[0];
      const green = color[1];
      const blue = color[2];
      const xend = x + w;
      const yend = y + h;
      const data = this._tileBuffer;
      const width = this._tileW;
      for (let j = y; j < yend; j++) {
        for (let i = x; i < xend; i++) {
          const p = (i + j * width) * 4;
          data[p] = red;
          data[p + 1] = green;
          data[p + 2] = blue;
          data[p + 3] = 255;
        }
      }
    }
    _finishTile(display) {
      display.blitImage(this._tileX, this._tileY, this._tileW, this._tileH, this._tileBuffer, 0);
    }
  };
  var hextile_default = HextileDecoder;

  // core/decoders/tight.js
  var TightDecoder = class {
    constructor() {
      this._ctl = null;
      this._filter = null;
      this._numColors = 0;
      this._palette = new Uint8Array(1024);
      this._len = 0;
      this._zlibs = [];
      for (let i = 0; i < 4; i++) {
        this._zlibs[i] = new inflator_default();
      }
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (this._ctl === null) {
        if (sock.rQwait("TIGHT compression-control", 1)) {
          return false;
        }
        this._ctl = sock.rQshift8();
        for (let i = 0; i < 4; i++) {
          if (this._ctl >> i & 1) {
            this._zlibs[i].reset();
            Info("Reset zlib stream " + i);
          }
        }
        this._ctl = this._ctl >> 4;
      }
      let ret;
      if (this._ctl === 8) {
        ret = this._fillRect(x, y, width, height, sock, display, depth);
      } else if (this._ctl === 9) {
        ret = this._jpegRect(x, y, width, height, sock, display, depth);
      } else if (this._ctl === 10) {
        ret = this._pngRect(x, y, width, height, sock, display, depth);
      } else if ((this._ctl & 8) == 0) {
        ret = this._basicRect(this._ctl, x, y, width, height, sock, display, depth);
      } else {
        throw new Error("Illegal tight compression received (ctl: " + this._ctl + ")");
      }
      if (ret) {
        this._ctl = null;
      }
      return ret;
    }
    _fillRect(x, y, width, height, sock, display, depth) {
      if (sock.rQwait("TIGHT", 3)) {
        return false;
      }
      const rQi = sock.rQi;
      const rQ = sock.rQ;
      display.fillRect(x, y, width, height, [rQ[rQi], rQ[rQi + 1], rQ[rQi + 2]], false);
      sock.rQskipBytes(3);
      return true;
    }
    _jpegRect(x, y, width, height, sock, display, depth) {
      let data = this._readData(sock);
      if (data === null) {
        return false;
      }
      display.imageRect(x, y, width, height, "image/jpeg", data);
      return true;
    }
    _pngRect(x, y, width, height, sock, display, depth) {
      throw new Error("PNG received in standard Tight rect");
    }
    _basicRect(ctl, x, y, width, height, sock, display, depth) {
      if (this._filter === null) {
        if (ctl & 4) {
          if (sock.rQwait("TIGHT", 1)) {
            return false;
          }
          this._filter = sock.rQshift8();
        } else {
          this._filter = 0;
        }
      }
      let streamId = ctl & 3;
      let ret;
      switch (this._filter) {
        case 0:
          ret = this._copyFilter(streamId, x, y, width, height, sock, display, depth);
          break;
        case 1:
          ret = this._paletteFilter(streamId, x, y, width, height, sock, display, depth);
          break;
        case 2:
          ret = this._gradientFilter(streamId, x, y, width, height, sock, display, depth);
          break;
        default:
          throw new Error("Illegal tight filter received (ctl: " + this._filter + ")");
      }
      if (ret) {
        this._filter = null;
      }
      return ret;
    }
    _copyFilter(streamId, x, y, width, height, sock, display, depth) {
      const uncompressedSize = width * height * 3;
      let data;
      if (uncompressedSize === 0) {
        return true;
      }
      if (uncompressedSize < 12) {
        if (sock.rQwait("TIGHT", uncompressedSize)) {
          return false;
        }
        data = sock.rQshiftBytes(uncompressedSize);
      } else {
        data = this._readData(sock);
        if (data === null) {
          return false;
        }
        this._zlibs[streamId].setInput(data);
        data = this._zlibs[streamId].inflate(uncompressedSize);
        this._zlibs[streamId].setInput(null);
      }
      let rgbx = new Uint8Array(width * height * 4);
      for (let i = 0, j = 0; i < width * height * 4; i += 4, j += 3) {
        rgbx[i] = data[j];
        rgbx[i + 1] = data[j + 1];
        rgbx[i + 2] = data[j + 2];
        rgbx[i + 3] = 255;
      }
      display.blitImage(x, y, width, height, rgbx, 0, false);
      return true;
    }
    _paletteFilter(streamId, x, y, width, height, sock, display, depth) {
      if (this._numColors === 0) {
        if (sock.rQwait("TIGHT palette", 1)) {
          return false;
        }
        const numColors = sock.rQpeek8() + 1;
        const paletteSize = numColors * 3;
        if (sock.rQwait("TIGHT palette", 1 + paletteSize)) {
          return false;
        }
        this._numColors = numColors;
        sock.rQskipBytes(1);
        sock.rQshiftTo(this._palette, paletteSize);
      }
      const bpp = this._numColors <= 2 ? 1 : 8;
      const rowSize = Math.floor((width * bpp + 7) / 8);
      const uncompressedSize = rowSize * height;
      let data;
      if (uncompressedSize === 0) {
        return true;
      }
      if (uncompressedSize < 12) {
        if (sock.rQwait("TIGHT", uncompressedSize)) {
          return false;
        }
        data = sock.rQshiftBytes(uncompressedSize);
      } else {
        data = this._readData(sock);
        if (data === null) {
          return false;
        }
        this._zlibs[streamId].setInput(data);
        data = this._zlibs[streamId].inflate(uncompressedSize);
        this._zlibs[streamId].setInput(null);
      }
      if (this._numColors == 2) {
        this._monoRect(x, y, width, height, data, this._palette, display);
      } else {
        this._paletteRect(x, y, width, height, data, this._palette, display);
      }
      this._numColors = 0;
      return true;
    }
    _monoRect(x, y, width, height, data, palette, display) {
      const dest = this._getScratchBuffer(width * height * 4);
      const w = Math.floor((width + 7) / 8);
      const w1 = Math.floor(width / 8);
      for (let y2 = 0; y2 < height; y2++) {
        let dp, sp, x2;
        for (x2 = 0; x2 < w1; x2++) {
          for (let b2 = 7; b2 >= 0; b2--) {
            dp = (y2 * width + x2 * 8 + 7 - b2) * 4;
            sp = (data[y2 * w + x2] >> b2 & 1) * 3;
            dest[dp] = palette[sp];
            dest[dp + 1] = palette[sp + 1];
            dest[dp + 2] = palette[sp + 2];
            dest[dp + 3] = 255;
          }
        }
        for (let b2 = 7; b2 >= 8 - width % 8; b2--) {
          dp = (y2 * width + x2 * 8 + 7 - b2) * 4;
          sp = (data[y2 * w + x2] >> b2 & 1) * 3;
          dest[dp] = palette[sp];
          dest[dp + 1] = palette[sp + 1];
          dest[dp + 2] = palette[sp + 2];
          dest[dp + 3] = 255;
        }
      }
      display.blitImage(x, y, width, height, dest, 0, false);
    }
    _paletteRect(x, y, width, height, data, palette, display) {
      const dest = this._getScratchBuffer(width * height * 4);
      const total = width * height * 4;
      for (let i = 0, j = 0; i < total; i += 4, j++) {
        const sp = data[j] * 3;
        dest[i] = palette[sp];
        dest[i + 1] = palette[sp + 1];
        dest[i + 2] = palette[sp + 2];
        dest[i + 3] = 255;
      }
      display.blitImage(x, y, width, height, dest, 0, false);
    }
    _gradientFilter(streamId, x, y, width, height, sock, display, depth) {
      throw new Error("Gradient filter not implemented");
    }
    _readData(sock) {
      if (this._len === 0) {
        if (sock.rQwait("TIGHT", 3)) {
          return null;
        }
        let byte;
        byte = sock.rQshift8();
        this._len = byte & 127;
        if (byte & 128) {
          byte = sock.rQshift8();
          this._len |= (byte & 127) << 7;
          if (byte & 128) {
            byte = sock.rQshift8();
            this._len |= byte << 14;
          }
        }
      }
      if (sock.rQwait("TIGHT", this._len)) {
        return null;
      }
      let data = sock.rQshiftBytes(this._len);
      this._len = 0;
      return data;
    }
    _getScratchBuffer(size) {
      if (!this._scratchBuffer || this._scratchBuffer.length < size) {
        this._scratchBuffer = new Uint8Array(size);
      }
      return this._scratchBuffer;
    }
  };
  var tight_default = TightDecoder;

  // core/decoders/tightpng.js
  var TightPNGDecoder = class extends tight_default {
    _pngRect(x, y, width, height, sock, display, depth) {
      let data = this._readData(sock);
      if (data === null) {
        return false;
      }
      display.imageRect(x, y, width, height, "image/png", data);
      return true;
    }
    _basicRect(ctl, x, y, width, height, sock, display, depth) {
      throw new Error("BasicCompression received in TightPNG rect");
    }
  };
  var tightpng_default = TightPNGDecoder;

  // core/decoders/zrle.js
  var ZRLE_TILE_WIDTH = 64;
  var ZRLE_TILE_HEIGHT = 64;
  var ZRLEDecoder = class {
    constructor() {
      this._length = 0;
      this._inflator = new inflator_default();
      this._pixelBuffer = new Uint8Array(ZRLE_TILE_WIDTH * ZRLE_TILE_HEIGHT * 4);
      this._tileBuffer = new Uint8Array(ZRLE_TILE_WIDTH * ZRLE_TILE_HEIGHT * 4);
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (this._length === 0) {
        if (sock.rQwait("ZLib data length", 4)) {
          return false;
        }
        this._length = sock.rQshift32();
      }
      if (sock.rQwait("Zlib data", this._length)) {
        return false;
      }
      const data = sock.rQshiftBytes(this._length);
      this._inflator.setInput(data);
      for (let ty = y; ty < y + height; ty += ZRLE_TILE_HEIGHT) {
        let th = Math.min(ZRLE_TILE_HEIGHT, y + height - ty);
        for (let tx = x; tx < x + width; tx += ZRLE_TILE_WIDTH) {
          let tw = Math.min(ZRLE_TILE_WIDTH, x + width - tx);
          const tileSize = tw * th;
          const subencoding = this._inflator.inflate(1)[0];
          if (subencoding === 0) {
            const data2 = this._readPixels(tileSize);
            display.blitImage(tx, ty, tw, th, data2, 0, false);
          } else if (subencoding === 1) {
            const background = this._readPixels(1);
            display.fillRect(tx, ty, tw, th, [background[0], background[1], background[2]]);
          } else if (subencoding >= 2 && subencoding <= 16) {
            const data2 = this._decodePaletteTile(subencoding, tileSize, tw, th);
            display.blitImage(tx, ty, tw, th, data2, 0, false);
          } else if (subencoding === 128) {
            const data2 = this._decodeRLETile(tileSize);
            display.blitImage(tx, ty, tw, th, data2, 0, false);
          } else if (subencoding >= 130 && subencoding <= 255) {
            const data2 = this._decodeRLEPaletteTile(subencoding - 128, tileSize);
            display.blitImage(tx, ty, tw, th, data2, 0, false);
          } else {
            throw new Error("Unknown subencoding: " + subencoding);
          }
        }
      }
      this._length = 0;
      return true;
    }
    _getBitsPerPixelInPalette(paletteSize) {
      if (paletteSize <= 2) {
        return 1;
      } else if (paletteSize <= 4) {
        return 2;
      } else if (paletteSize <= 16) {
        return 4;
      }
    }
    _readPixels(pixels) {
      let data = this._pixelBuffer;
      const buffer = this._inflator.inflate(3 * pixels);
      for (let i = 0, j = 0; i < pixels * 4; i += 4, j += 3) {
        data[i] = buffer[j];
        data[i + 1] = buffer[j + 1];
        data[i + 2] = buffer[j + 2];
        data[i + 3] = 255;
      }
      return data;
    }
    _decodePaletteTile(paletteSize, tileSize, tilew, tileh) {
      const data = this._tileBuffer;
      const palette = this._readPixels(paletteSize);
      const bitsPerPixel = this._getBitsPerPixelInPalette(paletteSize);
      const mask = (1 << bitsPerPixel) - 1;
      let offset = 0;
      let encoded = this._inflator.inflate(1)[0];
      for (let y = 0; y < tileh; y++) {
        let shift = 8 - bitsPerPixel;
        for (let x = 0; x < tilew; x++) {
          if (shift < 0) {
            shift = 8 - bitsPerPixel;
            encoded = this._inflator.inflate(1)[0];
          }
          let indexInPalette = encoded >> shift & mask;
          data[offset] = palette[indexInPalette * 4];
          data[offset + 1] = palette[indexInPalette * 4 + 1];
          data[offset + 2] = palette[indexInPalette * 4 + 2];
          data[offset + 3] = palette[indexInPalette * 4 + 3];
          offset += 4;
          shift -= bitsPerPixel;
        }
        if (shift < 8 - bitsPerPixel && y < tileh - 1) {
          encoded = this._inflator.inflate(1)[0];
        }
      }
      return data;
    }
    _decodeRLETile(tileSize) {
      const data = this._tileBuffer;
      let i = 0;
      while (i < tileSize) {
        const pixel = this._readPixels(1);
        const length = this._readRLELength();
        for (let j = 0; j < length; j++) {
          data[i * 4] = pixel[0];
          data[i * 4 + 1] = pixel[1];
          data[i * 4 + 2] = pixel[2];
          data[i * 4 + 3] = pixel[3];
          i++;
        }
      }
      return data;
    }
    _decodeRLEPaletteTile(paletteSize, tileSize) {
      const data = this._tileBuffer;
      const palette = this._readPixels(paletteSize);
      let offset = 0;
      while (offset < tileSize) {
        let indexInPalette = this._inflator.inflate(1)[0];
        let length = 1;
        if (indexInPalette >= 128) {
          indexInPalette -= 128;
          length = this._readRLELength();
        }
        if (indexInPalette > paletteSize) {
          throw new Error("Too big index in palette: " + indexInPalette + ", palette size: " + paletteSize);
        }
        if (offset + length > tileSize) {
          throw new Error("Too big rle length in palette mode: " + length + ", allowed length is: " + (tileSize - offset));
        }
        for (let j = 0; j < length; j++) {
          data[offset * 4] = palette[indexInPalette * 4];
          data[offset * 4 + 1] = palette[indexInPalette * 4 + 1];
          data[offset * 4 + 2] = palette[indexInPalette * 4 + 2];
          data[offset * 4 + 3] = palette[indexInPalette * 4 + 3];
          offset++;
        }
      }
      return data;
    }
    _readRLELength() {
      let length = 0;
      let current = 0;
      do {
        current = this._inflator.inflate(1)[0];
        length += current;
      } while (current === 255);
      return length + 1;
    }
  };
  var zrle_default = ZRLEDecoder;

  // core/decoders/jpeg.js
  var JPEGDecoder = class {
    constructor() {
      this._quantTables = [];
      this._huffmanTables = [];
      this._cachedQuantTables = [];
      this._cachedHuffmanTables = [];
      this._jpegLength = 0;
      this._segments = [];
    }
    decodeRect(x, y, width, height, sock, display, depth) {
      if (!this._parseJPEG(sock.rQslice(0))) {
        return false;
      }
      const data = sock.rQshiftBytes(this._jpegLength);
      if (this._quantTables.length != 0 && this._huffmanTables.length != 0) {
        display.imageRect(x, y, width, height, "image/jpeg", data);
        return true;
      } else {
        const sofIndex = this._segments.findIndex((x2) => x2[1] == 192 || x2[1] == 194);
        if (sofIndex == -1) {
          throw new Error("Illegal JPEG image without SOF");
        }
        let segments = this._segments.slice(0, sofIndex);
        segments = segments.concat(this._quantTables.length ? this._quantTables : this._cachedQuantTables);
        segments.push(this._segments[sofIndex]);
        segments = segments.concat(this._huffmanTables.length ? this._huffmanTables : this._cachedHuffmanTables, this._segments.slice(sofIndex + 1));
        let length = 0;
        for (let i = 0; i < segments.length; i++) {
          length += segments[i].length;
        }
        const data2 = new Uint8Array(length);
        length = 0;
        for (let i = 0; i < segments.length; i++) {
          data2.set(segments[i], length);
          length += segments[i].length;
        }
        display.imageRect(x, y, width, height, "image/jpeg", data2);
        return true;
      }
    }
    _parseJPEG(buffer) {
      if (this._quantTables.length != 0) {
        this._cachedQuantTables = this._quantTables;
      }
      if (this._huffmanTables.length != 0) {
        this._cachedHuffmanTables = this._huffmanTables;
      }
      this._quantTables = [];
      this._huffmanTables = [];
      this._segments = [];
      let i = 0;
      let bufferLength = buffer.length;
      while (true) {
        let j = i;
        if (j + 2 > bufferLength) {
          return false;
        }
        if (buffer[j] != 255) {
          throw new Error("Illegal JPEG marker received (byte: " + buffer[j] + ")");
        }
        const type = buffer[j + 1];
        j += 2;
        if (type == 217) {
          this._jpegLength = j;
          this._segments.push(buffer.slice(i, j));
          return true;
        } else if (type == 218) {
          let hasFoundEndOfScan = false;
          for (let k = j + 3; k + 1 < bufferLength; k++) {
            if (buffer[k] == 255 && buffer[k + 1] != 0 && !(buffer[k + 1] >= 208 && buffer[k + 1] <= 215)) {
              j = k;
              hasFoundEndOfScan = true;
              break;
            }
          }
          if (!hasFoundEndOfScan) {
            return false;
          }
          this._segments.push(buffer.slice(i, j));
          i = j;
          continue;
        } else if (type >= 208 && type < 217 || type == 1) {
          this._segments.push(buffer.slice(i, j));
          i = j;
          continue;
        }
        if (j + 2 > bufferLength) {
          return false;
        }
        const length = (buffer[j] << 8) + buffer[j + 1] - 2;
        if (length < 0) {
          throw new Error("Illegal JPEG length received (length: " + length + ")");
        }
        j += 2;
        if (j + length > bufferLength) {
          return false;
        }
        j += length;
        const segment = buffer.slice(i, j);
        if (type == 196) {
          this._huffmanTables.push(segment);
        } else if (type == 219) {
          this._quantTables.push(segment);
        }
        this._segments.push(segment);
        i = j;
      }
    }
  };
  var jpeg_default = JPEGDecoder;

  // core/rfb.js
  var DISCONNECT_TIMEOUT = 3;
  var DEFAULT_BACKGROUND = "rgb(40, 40, 40)";
  var MOUSE_MOVE_DELAY = 17;
  var WHEEL_STEP = 50;
  var WHEEL_LINE_HEIGHT = 19;
  var GESTURE_ZOOMSENS = 75;
  var GESTURE_SCRLSENS = 50;
  var DOUBLE_TAP_TIMEOUT = 1e3;
  var DOUBLE_TAP_THRESHOLD = 50;
  var securityTypeNone = 1;
  var securityTypeVNCAuth = 2;
  var securityTypeRA2ne = 6;
  var securityTypeTight = 16;
  var securityTypeVeNCrypt = 19;
  var securityTypeXVP = 22;
  var securityTypeARD = 30;
  var securityTypeMSLogonII = 113;
  var securityTypeUnixLogon = 129;
  var securityTypePlain = 256;
  var extendedClipboardFormatText = 1;
  var extendedClipboardFormatRtf = 1 << 1;
  var extendedClipboardFormatHtml = 1 << 2;
  var extendedClipboardFormatDib = 1 << 3;
  var extendedClipboardFormatFiles = 1 << 4;
  var extendedClipboardActionCaps = 1 << 24;
  var extendedClipboardActionRequest = 1 << 25;
  var extendedClipboardActionPeek = 1 << 26;
  var extendedClipboardActionNotify = 1 << 27;
  var extendedClipboardActionProvide = 1 << 28;
  var RFB = class extends eventtarget_default {
    constructor(target, urlOrChannel, options) {
      if (!target) {
        throw new Error("Must specify target");
      }
      if (!urlOrChannel) {
        throw new Error("Must specify URL, WebSocket or RTCDataChannel");
      }
      if (!window.isSecureContext) {
        Error2("noVNC requires a secure context (TLS). Expect crashes!");
      }
      super();
      this._target = target;
      if (typeof urlOrChannel === "string") {
        this._url = urlOrChannel;
      } else {
        this._url = null;
        this._rawChannel = urlOrChannel;
      }
      options = options || {};
      this._rfbCredentials = options.credentials || {};
      this._shared = "shared" in options ? !!options.shared : true;
      this._repeaterID = options.repeaterID || "";
      this._wsProtocols = options.wsProtocols || ["binary"];
      this._showDotCursor = options.showDotCursor || false;
      this._rfbConnectionState = "";
      this._rfbInitState = "";
      this._rfbAuthScheme = -1;
      this._rfbCleanDisconnect = true;
      this._rfbRSAAESAuthenticationState = null;
      this._rfbVersion = 0;
      this._rfbMaxVersion = 3.8;
      this._rfbTightVNC = false;
      this._rfbVeNCryptState = 0;
      this._rfbXvpVer = 0;
      this._fbWidth = 0;
      this._fbHeight = 0;
      this._fbName = "";
      this._capabilities = {power: false};
      this._supportsFence = false;
      this._supportsContinuousUpdates = false;
      this._enabledContinuousUpdates = false;
      this._supportsSetDesktopSize = false;
      this._screenID = 0;
      this._screenFlags = 0;
      this._qemuExtKeyEventSupported = false;
      this._clipboardText = null;
      this._clipboardServerCapabilitiesActions = {};
      this._clipboardServerCapabilitiesFormats = {};
      this._sock = null;
      this._display = null;
      this._flushing = false;
      this._keyboard = null;
      this._gestures = null;
      this._resizeObserver = null;
      this._disconnTimer = null;
      this._resizeTimeout = null;
      this._mouseMoveTimer = null;
      this._decoders = {};
      this._FBU = {
        rects: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        encoding: null
      };
      this._mousePos = {};
      this._mouseButtonMask = 0;
      this._mouseLastMoveTime = 0;
      this._viewportDragging = false;
      this._viewportDragPos = {};
      this._viewportHasMoved = false;
      this._accumulatedWheelDeltaX = 0;
      this._accumulatedWheelDeltaY = 0;
      this._gestureLastTapTime = null;
      this._gestureFirstDoubleTapEv = null;
      this._gestureLastMagnitudeX = 0;
      this._gestureLastMagnitudeY = 0;
      this._eventHandlers = {
        focusCanvas: this._focusCanvas.bind(this),
        handleResize: this._handleResize.bind(this),
        handleMouse: this._handleMouse.bind(this),
        handleWheel: this._handleWheel.bind(this),
        handleGesture: this._handleGesture.bind(this),
        handleRSAAESCredentialsRequired: this._handleRSAAESCredentialsRequired.bind(this),
        handleRSAAESServerVerification: this._handleRSAAESServerVerification.bind(this)
      };
      Debug(">> RFB.constructor");
      this._screen = document.createElement("div");
      this._screen.style.display = "flex";
      this._screen.style.width = "100%";
      this._screen.style.height = "100%";
      this._screen.style.overflow = "auto";
      this._screen.style.background = DEFAULT_BACKGROUND;
      this._canvas = document.createElement("canvas");
      this._canvas.style.margin = "auto";
      this._canvas.style.outline = "none";
      this._canvas.width = 0;
      this._canvas.height = 0;
      this._canvas.tabIndex = -1;
      this._screen.appendChild(this._canvas);
      this._cursor = new cursor_default();
      this._cursorImage = RFB.cursors.none;
      this._decoders[encodings.encodingRaw] = new raw_default();
      this._decoders[encodings.encodingCopyRect] = new copyrect_default();
      this._decoders[encodings.encodingRRE] = new rre_default();
      this._decoders[encodings.encodingHextile] = new hextile_default();
      this._decoders[encodings.encodingTight] = new tight_default();
      this._decoders[encodings.encodingTightPNG] = new tightpng_default();
      this._decoders[encodings.encodingZRLE] = new zrle_default();
      this._decoders[encodings.encodingJPEG] = new jpeg_default();
      try {
        this._display = new display_default(this._canvas);
      } catch (exc) {
        Error2("Display exception: " + exc);
        throw exc;
      }
      this._display.onflush = this._onFlush.bind(this);
      this._keyboard = new keyboard_default(this._canvas);
      this._keyboard.onkeyevent = this._handleKeyEvent.bind(this);
      this._gestures = new gesturehandler_default();
      this._sock = new websock_default();
      this._sock.on("open", this._socketOpen.bind(this));
      this._sock.on("close", this._socketClose.bind(this));
      this._sock.on("message", this._handleMessage.bind(this));
      this._sock.on("error", this._socketError.bind(this));
      this._expectedClientWidth = null;
      this._expectedClientHeight = null;
      this._resizeObserver = new ResizeObserver(this._eventHandlers.handleResize);
      this._updateConnectionState("connecting");
      Debug("<< RFB.constructor");
      this.dragViewport = false;
      this.focusOnClick = true;
      this._viewOnly = false;
      this._clipViewport = false;
      this._clippingViewport = false;
      this._scaleViewport = false;
      this._resizeSession = false;
      this._localCursor = false;
      this._showDotCursor = false;
      if (options.showDotCursor !== void 0) {
        Warn("Specifying showDotCursor as a RFB constructor argument is deprecated");
        this._showDotCursor = options.showDotCursor;
      }
      this._qualityLevel = 6;
      this._compressionLevel = 2;
    }
    get viewOnly() {
      return this._viewOnly;
    }
    set viewOnly(viewOnly) {
      this._viewOnly = viewOnly;
      if (this._rfbConnectionState === "connecting" || this._rfbConnectionState === "connected") {
        if (viewOnly) {
          this._keyboard.ungrab();
        } else {
          this._keyboard.grab();
        }
      }
    }
    get capabilities() {
      return this._capabilities;
    }
    get clippingViewport() {
      return this._clippingViewport;
    }
    _setClippingViewport(on) {
      if (on === this._clippingViewport) {
        return;
      }
      this._clippingViewport = on;
      this.dispatchEvent(new CustomEvent("clippingviewport", {detail: this._clippingViewport}));
    }
    get touchButton() {
      return 0;
    }
    set touchButton(button) {
      Warn("Using old API!");
    }
    get clipViewport() {
      return this._clipViewport;
    }
    set clipViewport(viewport) {
      this._clipViewport = viewport;
      this._updateClip();
    }
    get scaleViewport() {
      return this._scaleViewport;
    }
    set scaleViewport(scale) {
      this._scaleViewport = scale;
      if (scale && this._clipViewport) {
        this._updateClip();
      }
      this._updateScale();
      if (!scale && this._clipViewport) {
        this._updateClip();
      }
    }
    get resizeSession() {
      return this._resizeSession;
    }
    set resizeSession(resize) {
      this._resizeSession = resize;
      if (resize) {
        this._requestRemoteResize();
      }
    }
    get localCursor() {
      return this._localCursor;
    }
    set localCursor(localCursor) {
      this._localCursor = localCursor;
      if (this._cursor) {
        this._cursor.setLocalCursor(localCursor);
      }
    }
    get showDotCursor() {
      return this._showDotCursor;
    }
    set showDotCursor(show) {
      this._showDotCursor = show;
      this._refreshCursor();
    }
    get background() {
      return this._screen.style.background;
    }
    set background(cssValue) {
      this._screen.style.background = cssValue;
    }
    get qualityLevel() {
      return this._qualityLevel;
    }
    set qualityLevel(qualityLevel) {
      if (!Number.isInteger(qualityLevel) || qualityLevel < 0 || qualityLevel > 9) {
        Error2("qualityLevel must be an integer between 0 and 9");
        return;
      }
      if (this._qualityLevel === qualityLevel) {
        return;
      }
      this._qualityLevel = qualityLevel;
      if (this._rfbConnectionState === "connected") {
        this._sendEncodings();
      }
    }
    get compressionLevel() {
      return this._compressionLevel;
    }
    set compressionLevel(compressionLevel) {
      if (!Number.isInteger(compressionLevel) || compressionLevel < 0 || compressionLevel > 9) {
        Error2("compressionLevel must be an integer between 0 and 9");
        return;
      }
      if (this._compressionLevel === compressionLevel) {
        return;
      }
      this._compressionLevel = compressionLevel;
      if (this._rfbConnectionState === "connected") {
        this._sendEncodings();
      }
    }
    disconnect() {
      this._updateConnectionState("disconnecting");
      this._sock.off("error");
      this._sock.off("message");
      this._sock.off("open");
      if (this._rfbRSAAESAuthenticationState !== null) {
        this._rfbRSAAESAuthenticationState.disconnect();
      }
    }
    approveServer() {
      if (this._rfbRSAAESAuthenticationState !== null) {
        this._rfbRSAAESAuthenticationState.approveServer();
      }
    }
    sendCredentials(creds) {
      this._rfbCredentials = creds;
      this._resumeAuthentication();
    }
    sendCtrlAltDel() {
      if (this._rfbConnectionState !== "connected" || this._viewOnly) {
        return;
      }
      Info("Sending Ctrl-Alt-Del");
      this.sendKey(keysym_default.XK_Control_L, "ControlLeft", true);
      this.sendKey(keysym_default.XK_Alt_L, "AltLeft", true);
      this.sendKey(keysym_default.XK_Delete, "Delete", true);
      this.sendKey(keysym_default.XK_Delete, "Delete", false);
      this.sendKey(keysym_default.XK_Alt_L, "AltLeft", false);
      this.sendKey(keysym_default.XK_Control_L, "ControlLeft", false);
    }
    machineShutdown() {
      this._xvpOp(1, 2);
    }
    machineReboot() {
      this._xvpOp(1, 3);
    }
    machineReset() {
      this._xvpOp(1, 4);
    }
    sendKey(keysym, code, down) {
      if (this._rfbConnectionState !== "connected" || this._viewOnly) {
        return;
      }
      if (down === void 0) {
        this.sendKey(keysym, code, true);
        this.sendKey(keysym, code, false);
        return;
      }
      const scancode = xtscancodes_default[code];
      if (this._qemuExtKeyEventSupported && scancode) {
        keysym = keysym || 0;
        Info("Sending key (" + (down ? "down" : "up") + "): keysym " + keysym + ", scancode " + scancode);
        RFB.messages.QEMUExtendedKeyEvent(this._sock, keysym, down, scancode);
      } else {
        if (!keysym) {
          return;
        }
        Info("Sending keysym (" + (down ? "down" : "up") + "): " + keysym);
        RFB.messages.keyEvent(this._sock, keysym, down ? 1 : 0);
      }
    }
    focus(options) {
      this._canvas.focus(options);
    }
    blur() {
      this._canvas.blur();
    }
    clipboardPasteFrom(text) {
      if (this._rfbConnectionState !== "connected" || this._viewOnly) {
        return;
      }
      if (this._clipboardServerCapabilitiesFormats[extendedClipboardFormatText] && this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]) {
        this._clipboardText = text;
        RFB.messages.extendedClipboardNotify(this._sock, [extendedClipboardFormatText]);
      } else {
        let length, i;
        let data;
        length = 0;
        for (let codePoint of text) {
          length++;
        }
        data = new Uint8Array(length);
        i = 0;
        for (let codePoint of text) {
          let code = codePoint.codePointAt(0);
          if (code > 255) {
            code = 63;
          }
          data[i++] = code;
        }
        RFB.messages.clientCutText(this._sock, data);
      }
    }
    getImageData() {
      return this._display.getImageData();
    }
    toDataURL(type, encoderOptions) {
      return this._display.toDataURL(type, encoderOptions);
    }
    toBlob(callback, type, quality) {
      return this._display.toBlob(callback, type, quality);
    }
    _connect() {
      Debug(">> RFB.connect");
      if (this._url) {
        Info(`connecting to ${this._url}`);
        this._sock.open(this._url, this._wsProtocols);
      } else {
        Info(`attaching ${this._rawChannel} to Websock`);
        this._sock.attach(this._rawChannel);
        if (this._sock.readyState === "closed") {
          throw Error("Cannot use already closed WebSocket/RTCDataChannel");
        }
        if (this._sock.readyState === "open") {
          this._socketOpen();
        }
      }
      this._target.appendChild(this._screen);
      this._gestures.attach(this._canvas);
      this._cursor.attach(this._canvas);
      this._refreshCursor();
      this._resizeObserver.observe(this._screen);
      this._canvas.addEventListener("mousedown", this._eventHandlers.focusCanvas);
      this._canvas.addEventListener("touchstart", this._eventHandlers.focusCanvas);
      this._canvas.addEventListener("mousedown", this._eventHandlers.handleMouse);
      this._canvas.addEventListener("mouseup", this._eventHandlers.handleMouse);
      this._canvas.addEventListener("mousemove", this._eventHandlers.handleMouse);
      this._canvas.addEventListener("click", this._eventHandlers.handleMouse);
      this._canvas.addEventListener("contextmenu", this._eventHandlers.handleMouse);
      this._canvas.addEventListener("wheel", this._eventHandlers.handleWheel);
      this._canvas.addEventListener("gesturestart", this._eventHandlers.handleGesture);
      this._canvas.addEventListener("gesturemove", this._eventHandlers.handleGesture);
      this._canvas.addEventListener("gestureend", this._eventHandlers.handleGesture);
      Debug("<< RFB.connect");
    }
    _disconnect() {
      Debug(">> RFB.disconnect");
      this._cursor.detach();
      this._canvas.removeEventListener("gesturestart", this._eventHandlers.handleGesture);
      this._canvas.removeEventListener("gesturemove", this._eventHandlers.handleGesture);
      this._canvas.removeEventListener("gestureend", this._eventHandlers.handleGesture);
      this._canvas.removeEventListener("wheel", this._eventHandlers.handleWheel);
      this._canvas.removeEventListener("mousedown", this._eventHandlers.handleMouse);
      this._canvas.removeEventListener("mouseup", this._eventHandlers.handleMouse);
      this._canvas.removeEventListener("mousemove", this._eventHandlers.handleMouse);
      this._canvas.removeEventListener("click", this._eventHandlers.handleMouse);
      this._canvas.removeEventListener("contextmenu", this._eventHandlers.handleMouse);
      this._canvas.removeEventListener("mousedown", this._eventHandlers.focusCanvas);
      this._canvas.removeEventListener("touchstart", this._eventHandlers.focusCanvas);
      this._resizeObserver.disconnect();
      this._keyboard.ungrab();
      this._gestures.detach();
      this._sock.close();
      try {
        this._target.removeChild(this._screen);
      } catch (e2) {
        if (e2.name === "NotFoundError") {
        } else {
          throw e2;
        }
      }
      clearTimeout(this._resizeTimeout);
      clearTimeout(this._mouseMoveTimer);
      Debug("<< RFB.disconnect");
    }
    _socketOpen() {
      if (this._rfbConnectionState === "connecting" && this._rfbInitState === "") {
        this._rfbInitState = "ProtocolVersion";
        Debug("Starting VNC handshake");
      } else {
        this._fail("Unexpected server connection while " + this._rfbConnectionState);
      }
    }
    _socketClose(e2) {
      Debug("WebSocket on-close event");
      let msg = "";
      if (e2.code) {
        msg = "(code: " + e2.code;
        if (e2.reason) {
          msg += ", reason: " + e2.reason;
        }
        msg += ")";
      }
      switch (this._rfbConnectionState) {
        case "connecting":
          this._fail("Connection closed " + msg);
          break;
        case "connected":
          this._updateConnectionState("disconnecting");
          this._updateConnectionState("disconnected");
          break;
        case "disconnecting":
          this._updateConnectionState("disconnected");
          break;
        case "disconnected":
          this._fail("Unexpected server disconnect when already disconnected " + msg);
          break;
        default:
          this._fail("Unexpected server disconnect before connecting " + msg);
          break;
      }
      this._sock.off("close");
      this._rawChannel = null;
    }
    _socketError(e2) {
      Warn("WebSocket on-error event");
    }
    _focusCanvas(event) {
      if (!this.focusOnClick) {
        return;
      }
      this.focus({preventScroll: true});
    }
    _setDesktopName(name) {
      this._fbName = name;
      this.dispatchEvent(new CustomEvent("desktopname", {detail: {name: this._fbName}}));
    }
    _saveExpectedClientSize() {
      this._expectedClientWidth = this._screen.clientWidth;
      this._expectedClientHeight = this._screen.clientHeight;
    }
    _currentClientSize() {
      return [this._screen.clientWidth, this._screen.clientHeight];
    }
    _clientHasExpectedSize() {
      const [currentWidth, currentHeight] = this._currentClientSize();
      return currentWidth == this._expectedClientWidth && currentHeight == this._expectedClientHeight;
    }
    _handleResize() {
      if (this._clientHasExpectedSize()) {
        return;
      }
      window.requestAnimationFrame(() => {
        this._updateClip();
        this._updateScale();
      });
      if (this._resizeSession) {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(this._requestRemoteResize.bind(this), 500);
      }
    }
    _updateClip() {
      const curClip = this._display.clipViewport;
      let newClip = this._clipViewport;
      if (this._scaleViewport) {
        newClip = false;
      }
      if (curClip !== newClip) {
        this._display.clipViewport = newClip;
      }
      if (newClip) {
        const size = this._screenSize();
        this._display.viewportChangeSize(size.w, size.h);
        this._fixScrollbars();
        this._setClippingViewport(size.w < this._display.width || size.h < this._display.height);
      } else {
        this._setClippingViewport(false);
      }
      if (curClip !== newClip) {
        this._saveExpectedClientSize();
      }
    }
    _updateScale() {
      if (!this._scaleViewport) {
        this._display.scale = 1;
      } else {
        const size = this._screenSize();
        this._display.autoscale(size.w, size.h);
      }
      this._fixScrollbars();
    }
    _requestRemoteResize() {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
      if (!this._resizeSession || this._viewOnly || !this._supportsSetDesktopSize) {
        return;
      }
      const size = this._screenSize();
      RFB.messages.setDesktopSize(this._sock, Math.floor(size.w), Math.floor(size.h), this._screenID, this._screenFlags);
      Debug("Requested new desktop size: " + size.w + "x" + size.h);
    }
    _screenSize() {
      let r = this._screen.getBoundingClientRect();
      return {w: r.width, h: r.height};
    }
    _fixScrollbars() {
      const orig = this._screen.style.overflow;
      this._screen.style.overflow = "hidden";
      this._screen.getBoundingClientRect();
      this._screen.style.overflow = orig;
    }
    _updateConnectionState(state) {
      const oldstate = this._rfbConnectionState;
      if (state === oldstate) {
        Debug("Already in state '" + state + "', ignoring");
        return;
      }
      if (oldstate === "disconnected") {
        Error2("Tried changing state of a disconnected RFB object");
        return;
      }
      switch (state) {
        case "connected":
          if (oldstate !== "connecting") {
            Error2("Bad transition to connected state, previous connection state: " + oldstate);
            return;
          }
          break;
        case "disconnected":
          if (oldstate !== "disconnecting") {
            Error2("Bad transition to disconnected state, previous connection state: " + oldstate);
            return;
          }
          break;
        case "connecting":
          if (oldstate !== "") {
            Error2("Bad transition to connecting state, previous connection state: " + oldstate);
            return;
          }
          break;
        case "disconnecting":
          if (oldstate !== "connected" && oldstate !== "connecting") {
            Error2("Bad transition to disconnecting state, previous connection state: " + oldstate);
            return;
          }
          break;
        default:
          Error2("Unknown connection state: " + state);
          return;
      }
      this._rfbConnectionState = state;
      Debug("New state '" + state + "', was '" + oldstate + "'.");
      if (this._disconnTimer && state !== "disconnecting") {
        Debug("Clearing disconnect timer");
        clearTimeout(this._disconnTimer);
        this._disconnTimer = null;
        this._sock.off("close");
      }
      switch (state) {
        case "connecting":
          this._connect();
          break;
        case "connected":
          this.dispatchEvent(new CustomEvent("connect", {detail: {}}));
          break;
        case "disconnecting":
          this._disconnect();
          this._disconnTimer = setTimeout(() => {
            Error2("Disconnection timed out.");
            this._updateConnectionState("disconnected");
          }, DISCONNECT_TIMEOUT * 1e3);
          break;
        case "disconnected":
          this.dispatchEvent(new CustomEvent("disconnect", {detail: {clean: this._rfbCleanDisconnect}}));
          break;
      }
    }
    _fail(details) {
      switch (this._rfbConnectionState) {
        case "disconnecting":
          Error2("Failed when disconnecting: " + details);
          break;
        case "connected":
          Error2("Failed while connected: " + details);
          break;
        case "connecting":
          Error2("Failed when connecting: " + details);
          break;
        default:
          Error2("RFB failure: " + details);
          break;
      }
      this._rfbCleanDisconnect = false;
      this._updateConnectionState("disconnecting");
      this._updateConnectionState("disconnected");
      return false;
    }
    _setCapability(cap, val) {
      this._capabilities[cap] = val;
      this.dispatchEvent(new CustomEvent("capabilities", {detail: {capabilities: this._capabilities}}));
    }
    _handleMessage() {
      if (this._sock.rQlen === 0) {
        Warn("handleMessage called on an empty receive queue");
        return;
      }
      switch (this._rfbConnectionState) {
        case "disconnected":
          Error2("Got data while disconnected");
          break;
        case "connected":
          while (true) {
            if (this._flushing) {
              break;
            }
            if (!this._normalMsg()) {
              break;
            }
            if (this._sock.rQlen === 0) {
              break;
            }
          }
          break;
        case "connecting":
          while (this._rfbConnectionState === "connecting") {
            if (!this._initMsg()) {
              break;
            }
          }
          break;
        default:
          Error2("Got data while in an invalid state");
          break;
      }
    }
    _handleKeyEvent(keysym, code, down) {
      this.sendKey(keysym, code, down);
    }
    _handleMouse(ev) {
      if (ev.type === "click") {
        if (ev.target !== this._canvas) {
          return;
        }
      }
      ev.stopPropagation();
      ev.preventDefault();
      if (ev.type === "click" || ev.type === "contextmenu") {
        return;
      }
      let pos = clientToElement(ev.clientX, ev.clientY, this._canvas);
      switch (ev.type) {
        case "mousedown":
          setCapture(this._canvas);
          this._handleMouseButton(pos.x, pos.y, true, 1 << ev.button);
          break;
        case "mouseup":
          this._handleMouseButton(pos.x, pos.y, false, 1 << ev.button);
          break;
        case "mousemove":
          this._handleMouseMove(pos.x, pos.y);
          break;
      }
    }
    _handleMouseButton(x, y, down, bmask) {
      if (this.dragViewport) {
        if (down && !this._viewportDragging) {
          this._viewportDragging = true;
          this._viewportDragPos = {x, y};
          this._viewportHasMoved = false;
          return;
        } else {
          this._viewportDragging = false;
          if (this._viewportHasMoved) {
            return;
          }
          this._sendMouse(x, y, bmask);
        }
      }
      if (this._mouseMoveTimer !== null) {
        clearTimeout(this._mouseMoveTimer);
        this._mouseMoveTimer = null;
        this._sendMouse(x, y, this._mouseButtonMask);
      }
      if (down) {
        this._mouseButtonMask |= bmask;
      } else {
        this._mouseButtonMask &= ~bmask;
      }
      this._sendMouse(x, y, this._mouseButtonMask);
    }
    _handleMouseMove(x, y) {
      if (this._viewportDragging) {
        const deltaX = this._viewportDragPos.x - x;
        const deltaY = this._viewportDragPos.y - y;
        if (this._viewportHasMoved || (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold)) {
          this._viewportHasMoved = true;
          this._viewportDragPos = {x, y};
          this._display.viewportChangePos(deltaX, deltaY);
        }
        return;
      }
      this._mousePos = {x, y};
      if (this._mouseMoveTimer == null) {
        const timeSinceLastMove = Date.now() - this._mouseLastMoveTime;
        if (timeSinceLastMove > MOUSE_MOVE_DELAY) {
          this._sendMouse(x, y, this._mouseButtonMask);
          this._mouseLastMoveTime = Date.now();
        } else {
          this._mouseMoveTimer = setTimeout(() => {
            this._handleDelayedMouseMove();
          }, MOUSE_MOVE_DELAY - timeSinceLastMove);
        }
      }
    }
    _handleDelayedMouseMove() {
      this._mouseMoveTimer = null;
      this._sendMouse(this._mousePos.x, this._mousePos.y, this._mouseButtonMask);
      this._mouseLastMoveTime = Date.now();
    }
    _sendMouse(x, y, mask) {
      if (this._rfbConnectionState !== "connected") {
        return;
      }
      if (this._viewOnly) {
        return;
      }
      RFB.messages.pointerEvent(this._sock, this._display.absX(x), this._display.absY(y), mask);
    }
    _handleWheel(ev) {
      if (this._rfbConnectionState !== "connected") {
        return;
      }
      if (this._viewOnly) {
        return;
      }
      ev.stopPropagation();
      ev.preventDefault();
      let pos = clientToElement(ev.clientX, ev.clientY, this._canvas);
      let dX = ev.deltaX;
      let dY = ev.deltaY;
      if (ev.deltaMode !== 0) {
        dX *= WHEEL_LINE_HEIGHT;
        dY *= WHEEL_LINE_HEIGHT;
      }
      this._accumulatedWheelDeltaX += dX;
      this._accumulatedWheelDeltaY += dY;
      if (Math.abs(this._accumulatedWheelDeltaX) >= WHEEL_STEP) {
        if (this._accumulatedWheelDeltaX < 0) {
          this._handleMouseButton(pos.x, pos.y, true, 1 << 5);
          this._handleMouseButton(pos.x, pos.y, false, 1 << 5);
        } else if (this._accumulatedWheelDeltaX > 0) {
          this._handleMouseButton(pos.x, pos.y, true, 1 << 6);
          this._handleMouseButton(pos.x, pos.y, false, 1 << 6);
        }
        this._accumulatedWheelDeltaX = 0;
      }
      if (Math.abs(this._accumulatedWheelDeltaY) >= WHEEL_STEP) {
        if (this._accumulatedWheelDeltaY < 0) {
          this._handleMouseButton(pos.x, pos.y, true, 1 << 3);
          this._handleMouseButton(pos.x, pos.y, false, 1 << 3);
        } else if (this._accumulatedWheelDeltaY > 0) {
          this._handleMouseButton(pos.x, pos.y, true, 1 << 4);
          this._handleMouseButton(pos.x, pos.y, false, 1 << 4);
        }
        this._accumulatedWheelDeltaY = 0;
      }
    }
    _fakeMouseMove(ev, elementX, elementY) {
      this._handleMouseMove(elementX, elementY);
      this._cursor.move(ev.detail.clientX, ev.detail.clientY);
    }
    _handleTapEvent(ev, bmask) {
      let pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
      if (this._gestureLastTapTime !== null && Date.now() - this._gestureLastTapTime < DOUBLE_TAP_TIMEOUT && this._gestureFirstDoubleTapEv.detail.type === ev.detail.type) {
        let dx = this._gestureFirstDoubleTapEv.detail.clientX - ev.detail.clientX;
        let dy = this._gestureFirstDoubleTapEv.detail.clientY - ev.detail.clientY;
        let distance = Math.hypot(dx, dy);
        if (distance < DOUBLE_TAP_THRESHOLD) {
          pos = clientToElement(this._gestureFirstDoubleTapEv.detail.clientX, this._gestureFirstDoubleTapEv.detail.clientY, this._canvas);
        } else {
          this._gestureFirstDoubleTapEv = ev;
        }
      } else {
        this._gestureFirstDoubleTapEv = ev;
      }
      this._gestureLastTapTime = Date.now();
      this._fakeMouseMove(this._gestureFirstDoubleTapEv, pos.x, pos.y);
      this._handleMouseButton(pos.x, pos.y, true, bmask);
      this._handleMouseButton(pos.x, pos.y, false, bmask);
    }
    _handleGesture(ev) {
      let magnitude;
      let pos = clientToElement(ev.detail.clientX, ev.detail.clientY, this._canvas);
      switch (ev.type) {
        case "gesturestart":
          switch (ev.detail.type) {
            case "onetap":
              this._handleTapEvent(ev, 1);
              break;
            case "twotap":
              this._handleTapEvent(ev, 4);
              break;
            case "threetap":
              this._handleTapEvent(ev, 2);
              break;
            case "drag":
              this._fakeMouseMove(ev, pos.x, pos.y);
              this._handleMouseButton(pos.x, pos.y, true, 1);
              break;
            case "longpress":
              this._fakeMouseMove(ev, pos.x, pos.y);
              this._handleMouseButton(pos.x, pos.y, true, 4);
              break;
            case "twodrag":
              this._gestureLastMagnitudeX = ev.detail.magnitudeX;
              this._gestureLastMagnitudeY = ev.detail.magnitudeY;
              this._fakeMouseMove(ev, pos.x, pos.y);
              break;
            case "pinch":
              this._gestureLastMagnitudeX = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY);
              this._fakeMouseMove(ev, pos.x, pos.y);
              break;
          }
          break;
        case "gesturemove":
          switch (ev.detail.type) {
            case "onetap":
            case "twotap":
            case "threetap":
              break;
            case "drag":
            case "longpress":
              this._fakeMouseMove(ev, pos.x, pos.y);
              break;
            case "twodrag":
              this._fakeMouseMove(ev, pos.x, pos.y);
              while (ev.detail.magnitudeY - this._gestureLastMagnitudeY > GESTURE_SCRLSENS) {
                this._handleMouseButton(pos.x, pos.y, true, 8);
                this._handleMouseButton(pos.x, pos.y, false, 8);
                this._gestureLastMagnitudeY += GESTURE_SCRLSENS;
              }
              while (ev.detail.magnitudeY - this._gestureLastMagnitudeY < -GESTURE_SCRLSENS) {
                this._handleMouseButton(pos.x, pos.y, true, 16);
                this._handleMouseButton(pos.x, pos.y, false, 16);
                this._gestureLastMagnitudeY -= GESTURE_SCRLSENS;
              }
              while (ev.detail.magnitudeX - this._gestureLastMagnitudeX > GESTURE_SCRLSENS) {
                this._handleMouseButton(pos.x, pos.y, true, 32);
                this._handleMouseButton(pos.x, pos.y, false, 32);
                this._gestureLastMagnitudeX += GESTURE_SCRLSENS;
              }
              while (ev.detail.magnitudeX - this._gestureLastMagnitudeX < -GESTURE_SCRLSENS) {
                this._handleMouseButton(pos.x, pos.y, true, 64);
                this._handleMouseButton(pos.x, pos.y, false, 64);
                this._gestureLastMagnitudeX -= GESTURE_SCRLSENS;
              }
              break;
            case "pinch":
              this._fakeMouseMove(ev, pos.x, pos.y);
              magnitude = Math.hypot(ev.detail.magnitudeX, ev.detail.magnitudeY);
              if (Math.abs(magnitude - this._gestureLastMagnitudeX) > GESTURE_ZOOMSENS) {
                this._handleKeyEvent(keysym_default.XK_Control_L, "ControlLeft", true);
                while (magnitude - this._gestureLastMagnitudeX > GESTURE_ZOOMSENS) {
                  this._handleMouseButton(pos.x, pos.y, true, 8);
                  this._handleMouseButton(pos.x, pos.y, false, 8);
                  this._gestureLastMagnitudeX += GESTURE_ZOOMSENS;
                }
                while (magnitude - this._gestureLastMagnitudeX < -GESTURE_ZOOMSENS) {
                  this._handleMouseButton(pos.x, pos.y, true, 16);
                  this._handleMouseButton(pos.x, pos.y, false, 16);
                  this._gestureLastMagnitudeX -= GESTURE_ZOOMSENS;
                }
              }
              this._handleKeyEvent(keysym_default.XK_Control_L, "ControlLeft", false);
              break;
          }
          break;
        case "gestureend":
          switch (ev.detail.type) {
            case "onetap":
            case "twotap":
            case "threetap":
            case "pinch":
            case "twodrag":
              break;
            case "drag":
              this._fakeMouseMove(ev, pos.x, pos.y);
              this._handleMouseButton(pos.x, pos.y, false, 1);
              break;
            case "longpress":
              this._fakeMouseMove(ev, pos.x, pos.y);
              this._handleMouseButton(pos.x, pos.y, false, 4);
              break;
          }
          break;
      }
    }
    _negotiateProtocolVersion() {
      if (this._sock.rQwait("version", 12)) {
        return false;
      }
      const sversion = this._sock.rQshiftStr(12).substr(4, 7);
      Info("Server ProtocolVersion: " + sversion);
      let isRepeater = 0;
      switch (sversion) {
        case "000.000":
          isRepeater = 1;
          break;
        case "003.003":
        case "003.006":
          this._rfbVersion = 3.3;
          break;
        case "003.007":
          this._rfbVersion = 3.7;
          break;
        case "003.008":
        case "003.889":
        case "004.000":
        case "004.001":
        case "005.000":
          this._rfbVersion = 3.8;
          break;
        default:
          return this._fail("Invalid server version " + sversion);
      }
      if (isRepeater) {
        let repeaterID = "ID:" + this._repeaterID;
        while (repeaterID.length < 250) {
          repeaterID += "\0";
        }
        this._sock.sendString(repeaterID);
        return true;
      }
      if (this._rfbVersion > this._rfbMaxVersion) {
        this._rfbVersion = this._rfbMaxVersion;
      }
      const cversion = "00" + parseInt(this._rfbVersion, 10) + ".00" + this._rfbVersion * 10 % 10;
      this._sock.sendString("RFB " + cversion + "\n");
      Debug("Sent ProtocolVersion: " + cversion);
      this._rfbInitState = "Security";
    }
    _isSupportedSecurityType(type) {
      const clientTypes = [
        securityTypeNone,
        securityTypeVNCAuth,
        securityTypeRA2ne,
        securityTypeTight,
        securityTypeVeNCrypt,
        securityTypeXVP,
        securityTypeARD,
        securityTypeMSLogonII,
        securityTypePlain
      ];
      return clientTypes.includes(type);
    }
    _negotiateSecurity() {
      if (this._rfbVersion >= 3.7) {
        const numTypes = this._sock.rQshift8();
        if (this._sock.rQwait("security type", numTypes, 1)) {
          return false;
        }
        if (numTypes === 0) {
          this._rfbInitState = "SecurityReason";
          this._securityContext = "no security types";
          this._securityStatus = 1;
          return true;
        }
        const types = this._sock.rQshiftBytes(numTypes);
        Debug("Server security types: " + types);
        this._rfbAuthScheme = -1;
        for (let type of types) {
          if (this._isSupportedSecurityType(type)) {
            this._rfbAuthScheme = type;
            break;
          }
        }
        if (this._rfbAuthScheme === -1) {
          return this._fail("Unsupported security types (types: " + types + ")");
        }
        this._sock.send([this._rfbAuthScheme]);
      } else {
        if (this._sock.rQwait("security scheme", 4)) {
          return false;
        }
        this._rfbAuthScheme = this._sock.rQshift32();
        if (this._rfbAuthScheme == 0) {
          this._rfbInitState = "SecurityReason";
          this._securityContext = "authentication scheme";
          this._securityStatus = 1;
          return true;
        }
      }
      this._rfbInitState = "Authentication";
      Debug("Authenticating using scheme: " + this._rfbAuthScheme);
      return true;
    }
    _handleSecurityReason() {
      if (this._sock.rQwait("reason length", 4)) {
        return false;
      }
      const strlen = this._sock.rQshift32();
      let reason = "";
      if (strlen > 0) {
        if (this._sock.rQwait("reason", strlen, 4)) {
          return false;
        }
        reason = this._sock.rQshiftStr(strlen);
      }
      if (reason !== "") {
        this.dispatchEvent(new CustomEvent("securityfailure", {detail: {
          status: this._securityStatus,
          reason
        }}));
        return this._fail("Security negotiation failed on " + this._securityContext + " (reason: " + reason + ")");
      } else {
        this.dispatchEvent(new CustomEvent("securityfailure", {detail: {status: this._securityStatus}}));
        return this._fail("Security negotiation failed on " + this._securityContext);
      }
    }
    _negotiateXvpAuth() {
      if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0 || this._rfbCredentials.target === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password", "target"]}}));
        return false;
      }
      const xvpAuthStr = String.fromCharCode(this._rfbCredentials.username.length) + String.fromCharCode(this._rfbCredentials.target.length) + this._rfbCredentials.username + this._rfbCredentials.target;
      this._sock.sendString(xvpAuthStr);
      this._rfbAuthScheme = securityTypeVNCAuth;
      return this._negotiateAuthentication();
    }
    _negotiateVeNCryptAuth() {
      if (this._rfbVeNCryptState == 0) {
        if (this._sock.rQwait("vencrypt version", 2)) {
          return false;
        }
        const major = this._sock.rQshift8();
        const minor = this._sock.rQshift8();
        if (!(major == 0 && minor == 2)) {
          return this._fail("Unsupported VeNCrypt version " + major + "." + minor);
        }
        this._sock.send([0, 2]);
        this._rfbVeNCryptState = 1;
      }
      if (this._rfbVeNCryptState == 1) {
        if (this._sock.rQwait("vencrypt ack", 1)) {
          return false;
        }
        const res = this._sock.rQshift8();
        if (res != 0) {
          return this._fail("VeNCrypt failure " + res);
        }
        this._rfbVeNCryptState = 2;
      }
      if (this._rfbVeNCryptState == 2) {
        if (this._sock.rQwait("vencrypt subtypes length", 1)) {
          return false;
        }
        const subtypesLength = this._sock.rQshift8();
        if (subtypesLength < 1) {
          return this._fail("VeNCrypt subtypes empty");
        }
        this._rfbVeNCryptSubtypesLength = subtypesLength;
        this._rfbVeNCryptState = 3;
      }
      if (this._rfbVeNCryptState == 3) {
        if (this._sock.rQwait("vencrypt subtypes", 4 * this._rfbVeNCryptSubtypesLength)) {
          return false;
        }
        const subtypes = [];
        for (let i = 0; i < this._rfbVeNCryptSubtypesLength; i++) {
          subtypes.push(this._sock.rQshift32());
        }
        this._rfbAuthScheme = -1;
        for (let type of subtypes) {
          if (type === securityTypeVeNCrypt) {
            continue;
          }
          if (this._isSupportedSecurityType(type)) {
            this._rfbAuthScheme = type;
            break;
          }
        }
        if (this._rfbAuthScheme === -1) {
          return this._fail("Unsupported security types (types: " + subtypes + ")");
        }
        this._sock.send([
          this._rfbAuthScheme >> 24,
          this._rfbAuthScheme >> 16,
          this._rfbAuthScheme >> 8,
          this._rfbAuthScheme
        ]);
        this._rfbVeNCryptState == 4;
        return true;
      }
    }
    _negotiatePlainAuth() {
      if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password"]}}));
        return false;
      }
      const user = encodeUTF8(this._rfbCredentials.username);
      const pass = encodeUTF8(this._rfbCredentials.password);
      this._sock.send([
        user.length >> 24 & 255,
        user.length >> 16 & 255,
        user.length >> 8 & 255,
        user.length & 255
      ]);
      this._sock.send([
        pass.length >> 24 & 255,
        pass.length >> 16 & 255,
        pass.length >> 8 & 255,
        pass.length & 255
      ]);
      this._sock.sendString(user);
      this._sock.sendString(pass);
      this._rfbInitState = "SecurityResult";
      return true;
    }
    _negotiateStdVNCAuth() {
      if (this._sock.rQwait("auth challenge", 16)) {
        return false;
      }
      if (this._rfbCredentials.password === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["password"]}}));
        return false;
      }
      const challenge = Array.prototype.slice.call(this._sock.rQshiftBytes(16));
      const response = RFB.genDES(this._rfbCredentials.password, challenge);
      this._sock.send(response);
      this._rfbInitState = "SecurityResult";
      return true;
    }
    _negotiateARDAuth() {
      if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password"]}}));
        return false;
      }
      if (this._rfbCredentials.ardPublicKey != void 0 && this._rfbCredentials.ardCredentials != void 0) {
        this._sock.send(this._rfbCredentials.ardCredentials);
        this._sock.send(this._rfbCredentials.ardPublicKey);
        this._rfbCredentials.ardCredentials = null;
        this._rfbCredentials.ardPublicKey = null;
        this._rfbInitState = "SecurityResult";
        return true;
      }
      if (this._sock.rQwait("read ard", 4)) {
        return false;
      }
      let generator = this._sock.rQshiftBytes(2);
      let keyLength = this._sock.rQshift16();
      if (this._sock.rQwait("read ard keylength", keyLength * 2, 4)) {
        return false;
      }
      let prime = this._sock.rQshiftBytes(keyLength);
      let serverPublicKey = this._sock.rQshiftBytes(keyLength);
      let clientPrivateKey = window.crypto.getRandomValues(new Uint8Array(keyLength));
      let padding = Array.from(window.crypto.getRandomValues(new Uint8Array(64)), (byte) => String.fromCharCode(65 + byte % 26)).join("");
      this._negotiateARDAuthAsync(generator, keyLength, prime, serverPublicKey, clientPrivateKey, padding);
      return false;
    }
    _modPow(base, exponent, modulus) {
      let baseHex = "0x" + Array.from(base, (byte) => ("0" + (byte & 255).toString(16)).slice(-2)).join("");
      let exponentHex = "0x" + Array.from(exponent, (byte) => ("0" + (byte & 255).toString(16)).slice(-2)).join("");
      let modulusHex = "0x" + Array.from(modulus, (byte) => ("0" + (byte & 255).toString(16)).slice(-2)).join("");
      let b2 = BigInt(baseHex);
      let e2 = BigInt(exponentHex);
      let m = BigInt(modulusHex);
      let r = 1n;
      b2 = b2 % m;
      while (e2 > 0) {
        if (e2 % 2n === 1n) {
          r = r * b2 % m;
        }
        e2 = e2 / 2n;
        b2 = b2 * b2 % m;
      }
      let hexResult = r.toString(16);
      while (hexResult.length / 2 < exponent.length || hexResult.length % 2 != 0) {
        hexResult = "0" + hexResult;
      }
      let bytesResult = [];
      for (let c2 = 0; c2 < hexResult.length; c2 += 2) {
        bytesResult.push(parseInt(hexResult.substr(c2, 2), 16));
      }
      return bytesResult;
    }
    async _aesEcbEncrypt(string, key) {
      let keyString = Array.from(key, (byte) => String.fromCharCode(byte)).join("");
      let aesKey = await window.crypto.subtle.importKey("raw", MD5(keyString), {name: "AES-CBC"}, false, ["encrypt"]);
      let data = new Uint8Array(string.length);
      for (let i = 0; i < string.length; ++i) {
        data[i] = string.charCodeAt(i);
      }
      let encrypted = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i += 16) {
        let block = data.slice(i, i + 16);
        let encryptedBlock = await window.crypto.subtle.encrypt({name: "AES-CBC", iv: block}, aesKey, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        encrypted.set(new Uint8Array(encryptedBlock).slice(0, 16), i);
      }
      return encrypted;
    }
    async _negotiateARDAuthAsync(generator, keyLength, prime, serverPublicKey, clientPrivateKey, padding) {
      let clientPublicKey = this._modPow(generator, clientPrivateKey, prime);
      let sharedKey = this._modPow(serverPublicKey, clientPrivateKey, prime);
      let username = encodeUTF8(this._rfbCredentials.username).substring(0, 63);
      let password = encodeUTF8(this._rfbCredentials.password).substring(0, 63);
      let paddedUsername = username + "\0" + padding.substring(0, 63);
      let paddedPassword = password + "\0" + padding.substring(0, 63);
      let credentials = paddedUsername.substring(0, 64) + paddedPassword.substring(0, 64);
      let encrypted = await this._aesEcbEncrypt(credentials, sharedKey);
      this._rfbCredentials.ardCredentials = encrypted;
      this._rfbCredentials.ardPublicKey = clientPublicKey;
      this._resumeAuthentication();
    }
    _negotiateTightUnixAuth() {
      if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password"]}}));
        return false;
      }
      this._sock.send([0, 0, 0, this._rfbCredentials.username.length]);
      this._sock.send([0, 0, 0, this._rfbCredentials.password.length]);
      this._sock.sendString(this._rfbCredentials.username);
      this._sock.sendString(this._rfbCredentials.password);
      this._rfbInitState = "SecurityResult";
      return true;
    }
    _negotiateTightTunnels(numTunnels) {
      const clientSupportedTunnelTypes = {
        0: {vendor: "TGHT", signature: "NOTUNNEL"}
      };
      const serverSupportedTunnelTypes = {};
      for (let i = 0; i < numTunnels; i++) {
        const capCode = this._sock.rQshift32();
        const capVendor = this._sock.rQshiftStr(4);
        const capSignature = this._sock.rQshiftStr(8);
        serverSupportedTunnelTypes[capCode] = {vendor: capVendor, signature: capSignature};
      }
      Debug("Server Tight tunnel types: " + serverSupportedTunnelTypes);
      if (serverSupportedTunnelTypes[1] && serverSupportedTunnelTypes[1].vendor === "SICR" && serverSupportedTunnelTypes[1].signature === "SCHANNEL") {
        Debug("Detected Siemens server. Assuming NOTUNNEL support.");
        serverSupportedTunnelTypes[0] = {vendor: "TGHT", signature: "NOTUNNEL"};
      }
      if (serverSupportedTunnelTypes[0]) {
        if (serverSupportedTunnelTypes[0].vendor != clientSupportedTunnelTypes[0].vendor || serverSupportedTunnelTypes[0].signature != clientSupportedTunnelTypes[0].signature) {
          return this._fail("Client's tunnel type had the incorrect vendor or signature");
        }
        Debug("Selected tunnel type: " + clientSupportedTunnelTypes[0]);
        this._sock.send([0, 0, 0, 0]);
        return false;
      } else {
        return this._fail("Server wanted tunnels, but doesn't support the notunnel type");
      }
    }
    _negotiateTightAuth() {
      if (!this._rfbTightVNC) {
        if (this._sock.rQwait("num tunnels", 4)) {
          return false;
        }
        const numTunnels = this._sock.rQshift32();
        if (numTunnels > 0 && this._sock.rQwait("tunnel capabilities", 16 * numTunnels, 4)) {
          return false;
        }
        this._rfbTightVNC = true;
        if (numTunnels > 0) {
          this._negotiateTightTunnels(numTunnels);
          return false;
        }
      }
      if (this._sock.rQwait("sub auth count", 4)) {
        return false;
      }
      const subAuthCount = this._sock.rQshift32();
      if (subAuthCount === 0) {
        this._rfbInitState = "SecurityResult";
        return true;
      }
      if (this._sock.rQwait("sub auth capabilities", 16 * subAuthCount, 4)) {
        return false;
      }
      const clientSupportedTypes = {
        STDVNOAUTH__: 1,
        STDVVNCAUTH_: 2,
        TGHTULGNAUTH: 129
      };
      const serverSupportedTypes = [];
      for (let i = 0; i < subAuthCount; i++) {
        this._sock.rQshift32();
        const capabilities = this._sock.rQshiftStr(12);
        serverSupportedTypes.push(capabilities);
      }
      Debug("Server Tight authentication types: " + serverSupportedTypes);
      for (let authType in clientSupportedTypes) {
        if (serverSupportedTypes.indexOf(authType) != -1) {
          this._sock.send([0, 0, 0, clientSupportedTypes[authType]]);
          Debug("Selected authentication type: " + authType);
          switch (authType) {
            case "STDVNOAUTH__":
              this._rfbInitState = "SecurityResult";
              return true;
            case "STDVVNCAUTH_":
              this._rfbAuthScheme = securityTypeVNCAuth;
              return true;
            case "TGHTULGNAUTH":
              this._rfbAuthScheme = securityTypeUnixLogon;
              return true;
            default:
              return this._fail("Unsupported tiny auth scheme (scheme: " + authType + ")");
          }
        }
      }
      return this._fail("No supported sub-auth types!");
    }
    _handleRSAAESCredentialsRequired(event) {
      this.dispatchEvent(event);
    }
    _handleRSAAESServerVerification(event) {
      this.dispatchEvent(event);
    }
    _negotiateRA2neAuth() {
      if (this._rfbRSAAESAuthenticationState === null) {
        this._rfbRSAAESAuthenticationState = new ra2_default(this._sock, () => this._rfbCredentials);
        this._rfbRSAAESAuthenticationState.addEventListener("serververification", this._eventHandlers.handleRSAAESServerVerification);
        this._rfbRSAAESAuthenticationState.addEventListener("credentialsrequired", this._eventHandlers.handleRSAAESCredentialsRequired);
      }
      this._rfbRSAAESAuthenticationState.checkInternalEvents();
      if (!this._rfbRSAAESAuthenticationState.hasStarted) {
        this._rfbRSAAESAuthenticationState.negotiateRA2neAuthAsync().catch((e2) => {
          if (e2.message !== "disconnect normally") {
            this._fail(e2.message);
          }
        }).then(() => {
          this.dispatchEvent(new CustomEvent("securityresult"));
          this._rfbInitState = "SecurityResult";
          return true;
        }).finally(() => {
          this._rfbRSAAESAuthenticationState.removeEventListener("serververification", this._eventHandlers.handleRSAAESServerVerification);
          this._rfbRSAAESAuthenticationState.removeEventListener("credentialsrequired", this._eventHandlers.handleRSAAESCredentialsRequired);
          this._rfbRSAAESAuthenticationState = null;
        });
      }
      return false;
    }
    _negotiateMSLogonIIAuth() {
      if (this._sock.rQwait("mslogonii dh param", 24)) {
        return false;
      }
      if (this._rfbCredentials.username === void 0 || this._rfbCredentials.password === void 0) {
        this.dispatchEvent(new CustomEvent("credentialsrequired", {detail: {types: ["username", "password"]}}));
        return false;
      }
      const g = this._sock.rQshiftBytes(8);
      const p = this._sock.rQshiftBytes(8);
      const A = this._sock.rQshiftBytes(8);
      const b2 = window.crypto.getRandomValues(new Uint8Array(8));
      const B = new Uint8Array(this._modPow(g, b2, p));
      const secret = new Uint8Array(this._modPow(A, b2, p));
      const des = new des_default(secret);
      const username = encodeUTF8(this._rfbCredentials.username).substring(0, 255);
      const password = encodeUTF8(this._rfbCredentials.password).substring(0, 63);
      const usernameBytes = new Uint8Array(256);
      const passwordBytes = new Uint8Array(64);
      window.crypto.getRandomValues(usernameBytes);
      window.crypto.getRandomValues(passwordBytes);
      for (let i = 0; i < username.length; i++) {
        usernameBytes[i] = username.charCodeAt(i);
      }
      usernameBytes[username.length] = 0;
      for (let i = 0; i < password.length; i++) {
        passwordBytes[i] = password.charCodeAt(i);
      }
      passwordBytes[password.length] = 0;
      let x = new Uint8Array(secret);
      for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 8; j++) {
          x[j] ^= usernameBytes[i * 8 + j];
        }
        x = des.enc8(x);
        usernameBytes.set(x, i * 8);
      }
      x = new Uint8Array(secret);
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          x[j] ^= passwordBytes[i * 8 + j];
        }
        x = des.enc8(x);
        passwordBytes.set(x, i * 8);
      }
      this._sock.send(B);
      this._sock.send(usernameBytes);
      this._sock.send(passwordBytes);
      this._rfbInitState = "SecurityResult";
      return true;
    }
    _negotiateAuthentication() {
      switch (this._rfbAuthScheme) {
        case securityTypeNone:
          this._rfbInitState = "SecurityResult";
          return true;
        case securityTypeXVP:
          return this._negotiateXvpAuth();
        case securityTypeARD:
          return this._negotiateARDAuth();
        case securityTypeVNCAuth:
          return this._negotiateStdVNCAuth();
        case securityTypeTight:
          return this._negotiateTightAuth();
        case securityTypeVeNCrypt:
          return this._negotiateVeNCryptAuth();
        case securityTypePlain:
          return this._negotiatePlainAuth();
        case securityTypeUnixLogon:
          return this._negotiateTightUnixAuth();
        case securityTypeRA2ne:
          return this._negotiateRA2neAuth();
        case securityTypeMSLogonII:
          return this._negotiateMSLogonIIAuth();
        default:
          return this._fail("Unsupported auth scheme (scheme: " + this._rfbAuthScheme + ")");
      }
    }
    _handleSecurityResult() {
      if (this._rfbVersion < 3.7) {
        this._rfbInitState = "ClientInitialisation";
        return true;
      }
      if (this._sock.rQwait("VNC auth response ", 4)) {
        return false;
      }
      const status = this._sock.rQshift32();
      if (status === 0) {
        this._rfbInitState = "ClientInitialisation";
        Debug("Authentication OK");
        return true;
      } else {
        if (this._rfbVersion >= 3.8) {
          this._rfbInitState = "SecurityReason";
          this._securityContext = "security result";
          this._securityStatus = status;
          return true;
        } else {
          this.dispatchEvent(new CustomEvent("securityfailure", {detail: {status}}));
          return this._fail("Security handshake failed");
        }
      }
    }
    _negotiateServerInit() {
      if (this._sock.rQwait("server initialization", 24)) {
        return false;
      }
      const width = this._sock.rQshift16();
      const height = this._sock.rQshift16();
      const bpp = this._sock.rQshift8();
      const depth = this._sock.rQshift8();
      const bigEndian = this._sock.rQshift8();
      const trueColor = this._sock.rQshift8();
      const redMax = this._sock.rQshift16();
      const greenMax = this._sock.rQshift16();
      const blueMax = this._sock.rQshift16();
      const redShift = this._sock.rQshift8();
      const greenShift = this._sock.rQshift8();
      const blueShift = this._sock.rQshift8();
      this._sock.rQskipBytes(3);
      const nameLength = this._sock.rQshift32();
      if (this._sock.rQwait("server init name", nameLength, 24)) {
        return false;
      }
      let name = this._sock.rQshiftStr(nameLength);
      name = decodeUTF8(name, true);
      if (this._rfbTightVNC) {
        if (this._sock.rQwait("TightVNC extended server init header", 8, 24 + nameLength)) {
          return false;
        }
        const numServerMessages = this._sock.rQshift16();
        const numClientMessages = this._sock.rQshift16();
        const numEncodings = this._sock.rQshift16();
        this._sock.rQskipBytes(2);
        const totalMessagesLength = (numServerMessages + numClientMessages + numEncodings) * 16;
        if (this._sock.rQwait("TightVNC extended server init header", totalMessagesLength, 32 + nameLength)) {
          return false;
        }
        this._sock.rQskipBytes(16 * numServerMessages);
        this._sock.rQskipBytes(16 * numClientMessages);
        this._sock.rQskipBytes(16 * numEncodings);
      }
      Info("Screen: " + width + "x" + height + ", bpp: " + bpp + ", depth: " + depth + ", bigEndian: " + bigEndian + ", trueColor: " + trueColor + ", redMax: " + redMax + ", greenMax: " + greenMax + ", blueMax: " + blueMax + ", redShift: " + redShift + ", greenShift: " + greenShift + ", blueShift: " + blueShift);
      this._setDesktopName(name);
      this._resize(width, height);
      if (!this._viewOnly) {
        this._keyboard.grab();
      }
      this._fbDepth = 24;
      if (this._fbName === "Intel(r) AMT KVM") {
        Warn("Intel AMT KVM only supports 8/16 bit depths. Using low color mode.");
        this._fbDepth = 8;
      }
      RFB.messages.pixelFormat(this._sock, this._fbDepth, true);
      this._sendEncodings();
      RFB.messages.fbUpdateRequest(this._sock, false, 0, 0, this._fbWidth, this._fbHeight);
      this._updateConnectionState("connected");
      return true;
    }
    _sendEncodings() {
      const encs = [];
      encs.push(encodings.encodingCopyRect);
      if (this._fbDepth == 24) {
        encs.push(encodings.encodingTight);
        encs.push(encodings.encodingTightPNG);
        encs.push(encodings.encodingZRLE);
        encs.push(encodings.encodingJPEG);
        encs.push(encodings.encodingHextile);
        encs.push(encodings.encodingRRE);
      }
      encs.push(encodings.encodingRaw);
      encs.push(encodings.pseudoEncodingQualityLevel0 + this._qualityLevel);
      encs.push(encodings.pseudoEncodingCompressLevel0 + this._compressionLevel);
      encs.push(encodings.pseudoEncodingDesktopSize);
      encs.push(encodings.pseudoEncodingLastRect);
      encs.push(encodings.pseudoEncodingQEMUExtendedKeyEvent);
      encs.push(encodings.pseudoEncodingExtendedDesktopSize);
      encs.push(encodings.pseudoEncodingXvp);
      encs.push(encodings.pseudoEncodingFence);
      encs.push(encodings.pseudoEncodingContinuousUpdates);
      encs.push(encodings.pseudoEncodingDesktopName);
      encs.push(encodings.pseudoEncodingExtendedClipboard);
      if (this._fbDepth == 24) {
        encs.push(encodings.pseudoEncodingVMwareCursor);
        encs.push(encodings.pseudoEncodingCursor);
      }
      RFB.messages.clientEncodings(this._sock, encs);
    }
    _initMsg() {
      switch (this._rfbInitState) {
        case "ProtocolVersion":
          return this._negotiateProtocolVersion();
        case "Security":
          return this._negotiateSecurity();
        case "Authentication":
          return this._negotiateAuthentication();
        case "SecurityResult":
          return this._handleSecurityResult();
        case "SecurityReason":
          return this._handleSecurityReason();
        case "ClientInitialisation":
          this._sock.send([this._shared ? 1 : 0]);
          this._rfbInitState = "ServerInitialisation";
          return true;
        case "ServerInitialisation":
          return this._negotiateServerInit();
        default:
          return this._fail("Unknown init state (state: " + this._rfbInitState + ")");
      }
    }
    _resumeAuthentication() {
      setTimeout(this._initMsg.bind(this), 0);
    }
    _handleSetColourMapMsg() {
      Debug("SetColorMapEntries");
      return this._fail("Unexpected SetColorMapEntries message");
    }
    _handleServerCutText() {
      Debug("ServerCutText");
      if (this._sock.rQwait("ServerCutText header", 7, 1)) {
        return false;
      }
      this._sock.rQskipBytes(3);
      let length = this._sock.rQshift32();
      length = toSigned32bit(length);
      if (this._sock.rQwait("ServerCutText content", Math.abs(length), 8)) {
        return false;
      }
      if (length >= 0) {
        const text = this._sock.rQshiftStr(length);
        if (this._viewOnly) {
          return true;
        }
        this.dispatchEvent(new CustomEvent("clipboard", {detail: {text}}));
      } else {
        length = Math.abs(length);
        const flags = this._sock.rQshift32();
        let formats = flags & 65535;
        let actions = flags & 4278190080;
        let isCaps = !!(actions & extendedClipboardActionCaps);
        if (isCaps) {
          this._clipboardServerCapabilitiesFormats = {};
          this._clipboardServerCapabilitiesActions = {};
          for (let i = 0; i <= 15; i++) {
            let index = 1 << i;
            if (formats & index) {
              this._clipboardServerCapabilitiesFormats[index] = true;
              this._sock.rQshift32();
            }
          }
          for (let i = 24; i <= 31; i++) {
            let index = 1 << i;
            this._clipboardServerCapabilitiesActions[index] = !!(actions & index);
          }
          let clientActions = [
            extendedClipboardActionCaps,
            extendedClipboardActionRequest,
            extendedClipboardActionPeek,
            extendedClipboardActionNotify,
            extendedClipboardActionProvide
          ];
          RFB.messages.extendedClipboardCaps(this._sock, clientActions, {extendedClipboardFormatText: 0});
        } else if (actions === extendedClipboardActionRequest) {
          if (this._viewOnly) {
            return true;
          }
          if (this._clipboardText != null && this._clipboardServerCapabilitiesActions[extendedClipboardActionProvide]) {
            if (formats & extendedClipboardFormatText) {
              RFB.messages.extendedClipboardProvide(this._sock, [extendedClipboardFormatText], [this._clipboardText]);
            }
          }
        } else if (actions === extendedClipboardActionPeek) {
          if (this._viewOnly) {
            return true;
          }
          if (this._clipboardServerCapabilitiesActions[extendedClipboardActionNotify]) {
            if (this._clipboardText != null) {
              RFB.messages.extendedClipboardNotify(this._sock, [extendedClipboardFormatText]);
            } else {
              RFB.messages.extendedClipboardNotify(this._sock, []);
            }
          }
        } else if (actions === extendedClipboardActionNotify) {
          if (this._viewOnly) {
            return true;
          }
          if (this._clipboardServerCapabilitiesActions[extendedClipboardActionRequest]) {
            if (formats & extendedClipboardFormatText) {
              RFB.messages.extendedClipboardRequest(this._sock, [extendedClipboardFormatText]);
            }
          }
        } else if (actions === extendedClipboardActionProvide) {
          if (this._viewOnly) {
            return true;
          }
          if (!(formats & extendedClipboardFormatText)) {
            return true;
          }
          this._clipboardText = null;
          let zlibStream = this._sock.rQshiftBytes(length - 4);
          let streamInflator = new inflator_default();
          let textData = null;
          streamInflator.setInput(zlibStream);
          for (let i = 0; i <= 15; i++) {
            let format = 1 << i;
            if (formats & format) {
              let size = 0;
              let sizeArray = streamInflator.inflate(4);
              size |= sizeArray[0] << 24;
              size |= sizeArray[1] << 16;
              size |= sizeArray[2] << 8;
              size |= sizeArray[3];
              let chunk = streamInflator.inflate(size);
              if (format === extendedClipboardFormatText) {
                textData = chunk;
              }
            }
          }
          streamInflator.setInput(null);
          if (textData !== null) {
            let tmpText = "";
            for (let i = 0; i < textData.length; i++) {
              tmpText += String.fromCharCode(textData[i]);
            }
            textData = tmpText;
            textData = decodeUTF8(textData);
            if (textData.length > 0 && textData.charAt(textData.length - 1) === "\0") {
              textData = textData.slice(0, -1);
            }
            textData = textData.replace("\r\n", "\n");
            this.dispatchEvent(new CustomEvent("clipboard", {detail: {text: textData}}));
          }
        } else {
          return this._fail("Unexpected action in extended clipboard message: " + actions);
        }
      }
      return true;
    }
    _handleServerFenceMsg() {
      if (this._sock.rQwait("ServerFence header", 8, 1)) {
        return false;
      }
      this._sock.rQskipBytes(3);
      let flags = this._sock.rQshift32();
      let length = this._sock.rQshift8();
      if (this._sock.rQwait("ServerFence payload", length, 9)) {
        return false;
      }
      if (length > 64) {
        Warn("Bad payload length (" + length + ") in fence response");
        length = 64;
      }
      const payload = this._sock.rQshiftStr(length);
      this._supportsFence = true;
      if (!(flags & 1 << 31)) {
        return this._fail("Unexpected fence response");
      }
      flags &= 1 << 0 | 1 << 1;
      RFB.messages.clientFence(this._sock, flags, payload);
      return true;
    }
    _handleXvpMsg() {
      if (this._sock.rQwait("XVP version and message", 3, 1)) {
        return false;
      }
      this._sock.rQskipBytes(1);
      const xvpVer = this._sock.rQshift8();
      const xvpMsg = this._sock.rQshift8();
      switch (xvpMsg) {
        case 0:
          Error2("XVP Operation Failed");
          break;
        case 1:
          this._rfbXvpVer = xvpVer;
          Info("XVP extensions enabled (version " + this._rfbXvpVer + ")");
          this._setCapability("power", true);
          break;
        default:
          this._fail("Illegal server XVP message (msg: " + xvpMsg + ")");
          break;
      }
      return true;
    }
    _normalMsg() {
      let msgType;
      if (this._FBU.rects > 0) {
        msgType = 0;
      } else {
        msgType = this._sock.rQshift8();
      }
      let first, ret;
      switch (msgType) {
        case 0:
          ret = this._framebufferUpdate();
          if (ret && !this._enabledContinuousUpdates) {
            RFB.messages.fbUpdateRequest(this._sock, true, 0, 0, this._fbWidth, this._fbHeight);
          }
          return ret;
        case 1:
          return this._handleSetColourMapMsg();
        case 2:
          Debug("Bell");
          this.dispatchEvent(new CustomEvent("bell", {detail: {}}));
          return true;
        case 3:
          return this._handleServerCutText();
        case 150:
          first = !this._supportsContinuousUpdates;
          this._supportsContinuousUpdates = true;
          this._enabledContinuousUpdates = false;
          if (first) {
            this._enabledContinuousUpdates = true;
            this._updateContinuousUpdates();
            Info("Enabling continuous updates.");
          } else {
          }
          return true;
        case 248:
          return this._handleServerFenceMsg();
        case 250:
          return this._handleXvpMsg();
        default:
          this._fail("Unexpected server message (type " + msgType + ")");
          Debug("sock.rQslice(0, 30): " + this._sock.rQslice(0, 30));
          return true;
      }
    }
    _onFlush() {
      this._flushing = false;
      if (this._sock.rQlen > 0) {
        this._handleMessage();
      }
    }
    _framebufferUpdate() {
      if (this._FBU.rects === 0) {
        if (this._sock.rQwait("FBU header", 3, 1)) {
          return false;
        }
        this._sock.rQskipBytes(1);
        this._FBU.rects = this._sock.rQshift16();
        if (this._display.pending()) {
          this._flushing = true;
          this._display.flush();
          return false;
        }
      }
      while (this._FBU.rects > 0) {
        if (this._FBU.encoding === null) {
          if (this._sock.rQwait("rect header", 12)) {
            return false;
          }
          const hdr = this._sock.rQshiftBytes(12);
          this._FBU.x = (hdr[0] << 8) + hdr[1];
          this._FBU.y = (hdr[2] << 8) + hdr[3];
          this._FBU.width = (hdr[4] << 8) + hdr[5];
          this._FBU.height = (hdr[6] << 8) + hdr[7];
          this._FBU.encoding = parseInt((hdr[8] << 24) + (hdr[9] << 16) + (hdr[10] << 8) + hdr[11], 10);
        }
        if (!this._handleRect()) {
          return false;
        }
        this._FBU.rects--;
        this._FBU.encoding = null;
      }
      this._display.flip();
      return true;
    }
    _handleRect() {
      switch (this._FBU.encoding) {
        case encodings.pseudoEncodingLastRect:
          this._FBU.rects = 1;
          return true;
        case encodings.pseudoEncodingVMwareCursor:
          return this._handleVMwareCursor();
        case encodings.pseudoEncodingCursor:
          return this._handleCursor();
        case encodings.pseudoEncodingQEMUExtendedKeyEvent:
          this._qemuExtKeyEventSupported = true;
          return true;
        case encodings.pseudoEncodingDesktopName:
          return this._handleDesktopName();
        case encodings.pseudoEncodingDesktopSize:
          this._resize(this._FBU.width, this._FBU.height);
          return true;
        case encodings.pseudoEncodingExtendedDesktopSize:
          return this._handleExtendedDesktopSize();
        default:
          return this._handleDataRect();
      }
    }
    _handleVMwareCursor() {
      const hotx = this._FBU.x;
      const hoty = this._FBU.y;
      const w = this._FBU.width;
      const h = this._FBU.height;
      if (this._sock.rQwait("VMware cursor encoding", 1)) {
        return false;
      }
      const cursorType = this._sock.rQshift8();
      this._sock.rQshift8();
      let rgba;
      const bytesPerPixel = 4;
      if (cursorType == 0) {
        const PIXEL_MASK = 4294967040 | 0;
        rgba = new Array(w * h * bytesPerPixel);
        if (this._sock.rQwait("VMware cursor classic encoding", w * h * bytesPerPixel * 2, 2)) {
          return false;
        }
        let andMask = new Array(w * h);
        for (let pixel = 0; pixel < w * h; pixel++) {
          andMask[pixel] = this._sock.rQshift32();
        }
        let xorMask = new Array(w * h);
        for (let pixel = 0; pixel < w * h; pixel++) {
          xorMask[pixel] = this._sock.rQshift32();
        }
        for (let pixel = 0; pixel < w * h; pixel++) {
          if (andMask[pixel] == 0) {
            let bgr = xorMask[pixel];
            let r = bgr >> 8 & 255;
            let g = bgr >> 16 & 255;
            let b2 = bgr >> 24 & 255;
            rgba[pixel * bytesPerPixel] = r;
            rgba[pixel * bytesPerPixel + 1] = g;
            rgba[pixel * bytesPerPixel + 2] = b2;
            rgba[pixel * bytesPerPixel + 3] = 255;
          } else if ((andMask[pixel] & PIXEL_MASK) == PIXEL_MASK) {
            if (xorMask[pixel] == 0) {
              rgba[pixel * bytesPerPixel] = 0;
              rgba[pixel * bytesPerPixel + 1] = 0;
              rgba[pixel * bytesPerPixel + 2] = 0;
              rgba[pixel * bytesPerPixel + 3] = 0;
            } else if ((xorMask[pixel] & PIXEL_MASK) == PIXEL_MASK) {
              rgba[pixel * bytesPerPixel] = 0;
              rgba[pixel * bytesPerPixel + 1] = 0;
              rgba[pixel * bytesPerPixel + 2] = 0;
              rgba[pixel * bytesPerPixel + 3] = 255;
            } else {
              rgba[pixel * bytesPerPixel] = 0;
              rgba[pixel * bytesPerPixel + 1] = 0;
              rgba[pixel * bytesPerPixel + 2] = 0;
              rgba[pixel * bytesPerPixel + 3] = 255;
            }
          } else {
            rgba[pixel * bytesPerPixel] = 0;
            rgba[pixel * bytesPerPixel + 1] = 0;
            rgba[pixel * bytesPerPixel + 2] = 0;
            rgba[pixel * bytesPerPixel + 3] = 255;
          }
        }
      } else if (cursorType == 1) {
        if (this._sock.rQwait("VMware cursor alpha encoding", w * h * 4, 2)) {
          return false;
        }
        rgba = new Array(w * h * bytesPerPixel);
        for (let pixel = 0; pixel < w * h; pixel++) {
          let data = this._sock.rQshift32();
          rgba[pixel * 4] = data >> 24 & 255;
          rgba[pixel * 4 + 1] = data >> 16 & 255;
          rgba[pixel * 4 + 2] = data >> 8 & 255;
          rgba[pixel * 4 + 3] = data & 255;
        }
      } else {
        Warn("The given cursor type is not supported: " + cursorType + " given.");
        return false;
      }
      this._updateCursor(rgba, hotx, hoty, w, h);
      return true;
    }
    _handleCursor() {
      const hotx = this._FBU.x;
      const hoty = this._FBU.y;
      const w = this._FBU.width;
      const h = this._FBU.height;
      const pixelslength = w * h * 4;
      const masklength = Math.ceil(w / 8) * h;
      let bytes = pixelslength + masklength;
      if (this._sock.rQwait("cursor encoding", bytes)) {
        return false;
      }
      const pixels = this._sock.rQshiftBytes(pixelslength);
      const mask = this._sock.rQshiftBytes(masklength);
      let rgba = new Uint8Array(w * h * 4);
      let pixIdx = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let maskIdx = y * Math.ceil(w / 8) + Math.floor(x / 8);
          let alpha = mask[maskIdx] << x % 8 & 128 ? 255 : 0;
          rgba[pixIdx] = pixels[pixIdx + 2];
          rgba[pixIdx + 1] = pixels[pixIdx + 1];
          rgba[pixIdx + 2] = pixels[pixIdx];
          rgba[pixIdx + 3] = alpha;
          pixIdx += 4;
        }
      }
      this._updateCursor(rgba, hotx, hoty, w, h);
      return true;
    }
    _handleDesktopName() {
      if (this._sock.rQwait("DesktopName", 4)) {
        return false;
      }
      let length = this._sock.rQshift32();
      if (this._sock.rQwait("DesktopName", length, 4)) {
        return false;
      }
      let name = this._sock.rQshiftStr(length);
      name = decodeUTF8(name, true);
      this._setDesktopName(name);
      return true;
    }
    _handleExtendedDesktopSize() {
      if (this._sock.rQwait("ExtendedDesktopSize", 4)) {
        return false;
      }
      const numberOfScreens = this._sock.rQpeek8();
      let bytes = 4 + numberOfScreens * 16;
      if (this._sock.rQwait("ExtendedDesktopSize", bytes)) {
        return false;
      }
      const firstUpdate = !this._supportsSetDesktopSize;
      this._supportsSetDesktopSize = true;
      if (firstUpdate) {
        this._requestRemoteResize();
      }
      this._sock.rQskipBytes(1);
      this._sock.rQskipBytes(3);
      for (let i = 0; i < numberOfScreens; i += 1) {
        if (i === 0) {
          this._screenID = this._sock.rQshiftBytes(4);
          this._sock.rQskipBytes(2);
          this._sock.rQskipBytes(2);
          this._sock.rQskipBytes(2);
          this._sock.rQskipBytes(2);
          this._screenFlags = this._sock.rQshiftBytes(4);
        } else {
          this._sock.rQskipBytes(16);
        }
      }
      if (this._FBU.x === 1 && this._FBU.y !== 0) {
        let msg = "";
        switch (this._FBU.y) {
          case 1:
            msg = "Resize is administratively prohibited";
            break;
          case 2:
            msg = "Out of resources";
            break;
          case 3:
            msg = "Invalid screen layout";
            break;
          default:
            msg = "Unknown reason";
            break;
        }
        Warn("Server did not accept the resize request: " + msg);
      } else {
        this._resize(this._FBU.width, this._FBU.height);
      }
      return true;
    }
    _handleDataRect() {
      let decoder = this._decoders[this._FBU.encoding];
      if (!decoder) {
        this._fail("Unsupported encoding (encoding: " + this._FBU.encoding + ")");
        return false;
      }
      try {
        return decoder.decodeRect(this._FBU.x, this._FBU.y, this._FBU.width, this._FBU.height, this._sock, this._display, this._fbDepth);
      } catch (err2) {
        this._fail("Error decoding rect: " + err2);
        return false;
      }
    }
    _updateContinuousUpdates() {
      if (!this._enabledContinuousUpdates) {
        return;
      }
      RFB.messages.enableContinuousUpdates(this._sock, true, 0, 0, this._fbWidth, this._fbHeight);
    }
    _resize(width, height) {
      this._fbWidth = width;
      this._fbHeight = height;
      this._display.resize(this._fbWidth, this._fbHeight);
      this._updateClip();
      this._updateScale();
      var event = new CustomEvent("fbresize", {
        detail: {
          rfb: this,
          width,
          height
        }
      });
      this.dispatchEvent(event);
      this._updateContinuousUpdates();
      this._saveExpectedClientSize();
    }
    _xvpOp(ver, op) {
      if (this._rfbXvpVer < ver) {
        return;
      }
      Info("Sending XVP operation " + op + " (version " + ver + ")");
      RFB.messages.xvpOp(this._sock, ver, op);
    }
    _updateCursor(rgba, hotx, hoty, w, h) {
      this._cursorImage = {
        rgbaPixels: rgba,
        hotx,
        hoty,
        w,
        h
      };
      this._refreshCursor();
    }
    _shouldShowDotCursor() {
      if (!this._showDotCursor) {
        return false;
      }
      for (let i = 3; i < this._cursorImage.rgbaPixels.length; i += 4) {
        if (this._cursorImage.rgbaPixels[i]) {
          return false;
        }
      }
      return true;
    }
    _refreshCursor() {
      if (this._rfbConnectionState !== "connecting" && this._rfbConnectionState !== "connected") {
        return;
      }
      const image = this._shouldShowDotCursor() ? RFB.cursors.dot : this._cursorImage;
      this._cursor.change(image.rgbaPixels, image.hotx, image.hoty, image.w, image.h);
    }
    static genDES(password, challenge) {
      const passwordChars = password.split("").map((c2) => c2.charCodeAt(0));
      return new des_default(passwordChars).encrypt(challenge);
    }
  };
  var rfb_default = RFB;
  RFB.messages = {
    keyEvent(sock, keysym, down) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 4;
      buff[offset + 1] = down;
      buff[offset + 2] = 0;
      buff[offset + 3] = 0;
      buff[offset + 4] = keysym >> 24;
      buff[offset + 5] = keysym >> 16;
      buff[offset + 6] = keysym >> 8;
      buff[offset + 7] = keysym;
      sock._sQlen += 8;
      sock.flush();
    },
    QEMUExtendedKeyEvent(sock, keysym, down, keycode) {
      function getRFBkeycode(xtScanCode) {
        const upperByte = keycode >> 8;
        const lowerByte = keycode & 255;
        if (upperByte === 224 && lowerByte < 127) {
          return lowerByte | 128;
        }
        return xtScanCode;
      }
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 255;
      buff[offset + 1] = 0;
      buff[offset + 2] = down >> 8;
      buff[offset + 3] = down;
      buff[offset + 4] = keysym >> 24;
      buff[offset + 5] = keysym >> 16;
      buff[offset + 6] = keysym >> 8;
      buff[offset + 7] = keysym;
      const RFBkeycode = getRFBkeycode(keycode);
      buff[offset + 8] = RFBkeycode >> 24;
      buff[offset + 9] = RFBkeycode >> 16;
      buff[offset + 10] = RFBkeycode >> 8;
      buff[offset + 11] = RFBkeycode;
      sock._sQlen += 12;
      sock.flush();
    },
    pointerEvent(sock, x, y, mask) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 5;
      buff[offset + 1] = mask;
      buff[offset + 2] = x >> 8;
      buff[offset + 3] = x;
      buff[offset + 4] = y >> 8;
      buff[offset + 5] = y;
      sock._sQlen += 6;
      sock.flush();
    },
    _buildExtendedClipboardFlags(actions, formats) {
      let data = new Uint8Array(4);
      let formatFlag = 0;
      let actionFlag = 0;
      for (let i = 0; i < actions.length; i++) {
        actionFlag |= actions[i];
      }
      for (let i = 0; i < formats.length; i++) {
        formatFlag |= formats[i];
      }
      data[0] = actionFlag >> 24;
      data[1] = 0;
      data[2] = 0;
      data[3] = formatFlag;
      return data;
    },
    extendedClipboardProvide(sock, formats, inData) {
      let deflator = new deflator_default();
      let dataToDeflate = [];
      for (let i = 0; i < formats.length; i++) {
        if (formats[i] != extendedClipboardFormatText) {
          throw new Error("Unsupported extended clipboard format for Provide message.");
        }
        inData[i] = inData[i].replace(/\r\n|\r|\n/gm, "\r\n");
        let text = encodeUTF8(inData[i] + "\0");
        dataToDeflate.push(text.length >> 24 & 255, text.length >> 16 & 255, text.length >> 8 & 255, text.length & 255);
        for (let j = 0; j < text.length; j++) {
          dataToDeflate.push(text.charCodeAt(j));
        }
      }
      let deflatedData = deflator.deflate(new Uint8Array(dataToDeflate));
      let data = new Uint8Array(4 + deflatedData.length);
      data.set(RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionProvide], formats));
      data.set(deflatedData, 4);
      RFB.messages.clientCutText(sock, data, true);
    },
    extendedClipboardNotify(sock, formats) {
      let flags = RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionNotify], formats);
      RFB.messages.clientCutText(sock, flags, true);
    },
    extendedClipboardRequest(sock, formats) {
      let flags = RFB.messages._buildExtendedClipboardFlags([extendedClipboardActionRequest], formats);
      RFB.messages.clientCutText(sock, flags, true);
    },
    extendedClipboardCaps(sock, actions, formats) {
      let formatKeys = Object.keys(formats);
      let data = new Uint8Array(4 + 4 * formatKeys.length);
      formatKeys.map((x) => parseInt(x));
      formatKeys.sort((a2, b2) => a2 - b2);
      data.set(RFB.messages._buildExtendedClipboardFlags(actions, []));
      let loopOffset = 4;
      for (let i = 0; i < formatKeys.length; i++) {
        data[loopOffset] = formats[formatKeys[i]] >> 24;
        data[loopOffset + 1] = formats[formatKeys[i]] >> 16;
        data[loopOffset + 2] = formats[formatKeys[i]] >> 8;
        data[loopOffset + 3] = formats[formatKeys[i]] >> 0;
        loopOffset += 4;
        data[3] |= 1 << formatKeys[i];
      }
      RFB.messages.clientCutText(sock, data, true);
    },
    clientCutText(sock, data, extended = false) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 6;
      buff[offset + 1] = 0;
      buff[offset + 2] = 0;
      buff[offset + 3] = 0;
      let length;
      if (extended) {
        length = toUnsigned32bit(-data.length);
      } else {
        length = data.length;
      }
      buff[offset + 4] = length >> 24;
      buff[offset + 5] = length >> 16;
      buff[offset + 6] = length >> 8;
      buff[offset + 7] = length;
      sock._sQlen += 8;
      let dataOffset = 0;
      let remaining = data.length;
      while (remaining > 0) {
        let flushSize = Math.min(remaining, sock._sQbufferSize - sock._sQlen);
        for (let i = 0; i < flushSize; i++) {
          buff[sock._sQlen + i] = data[dataOffset + i];
        }
        sock._sQlen += flushSize;
        sock.flush();
        remaining -= flushSize;
        dataOffset += flushSize;
      }
    },
    setDesktopSize(sock, width, height, id, flags) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 251;
      buff[offset + 1] = 0;
      buff[offset + 2] = width >> 8;
      buff[offset + 3] = width;
      buff[offset + 4] = height >> 8;
      buff[offset + 5] = height;
      buff[offset + 6] = 1;
      buff[offset + 7] = 0;
      buff[offset + 8] = id >> 24;
      buff[offset + 9] = id >> 16;
      buff[offset + 10] = id >> 8;
      buff[offset + 11] = id;
      buff[offset + 12] = 0;
      buff[offset + 13] = 0;
      buff[offset + 14] = 0;
      buff[offset + 15] = 0;
      buff[offset + 16] = width >> 8;
      buff[offset + 17] = width;
      buff[offset + 18] = height >> 8;
      buff[offset + 19] = height;
      buff[offset + 20] = flags >> 24;
      buff[offset + 21] = flags >> 16;
      buff[offset + 22] = flags >> 8;
      buff[offset + 23] = flags;
      sock._sQlen += 24;
      sock.flush();
    },
    clientFence(sock, flags, payload) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 248;
      buff[offset + 1] = 0;
      buff[offset + 2] = 0;
      buff[offset + 3] = 0;
      buff[offset + 4] = flags >> 24;
      buff[offset + 5] = flags >> 16;
      buff[offset + 6] = flags >> 8;
      buff[offset + 7] = flags;
      const n = payload.length;
      buff[offset + 8] = n;
      for (let i = 0; i < n; i++) {
        buff[offset + 9 + i] = payload.charCodeAt(i);
      }
      sock._sQlen += 9 + n;
      sock.flush();
    },
    enableContinuousUpdates(sock, enable, x, y, width, height) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 150;
      buff[offset + 1] = enable;
      buff[offset + 2] = x >> 8;
      buff[offset + 3] = x;
      buff[offset + 4] = y >> 8;
      buff[offset + 5] = y;
      buff[offset + 6] = width >> 8;
      buff[offset + 7] = width;
      buff[offset + 8] = height >> 8;
      buff[offset + 9] = height;
      sock._sQlen += 10;
      sock.flush();
    },
    pixelFormat(sock, depth, trueColor) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      let bpp;
      if (depth > 16) {
        bpp = 32;
      } else if (depth > 8) {
        bpp = 16;
      } else {
        bpp = 8;
      }
      const bits = Math.floor(depth / 3);
      buff[offset] = 0;
      buff[offset + 1] = 0;
      buff[offset + 2] = 0;
      buff[offset + 3] = 0;
      buff[offset + 4] = bpp;
      buff[offset + 5] = depth;
      buff[offset + 6] = 0;
      buff[offset + 7] = trueColor ? 1 : 0;
      buff[offset + 8] = 0;
      buff[offset + 9] = (1 << bits) - 1;
      buff[offset + 10] = 0;
      buff[offset + 11] = (1 << bits) - 1;
      buff[offset + 12] = 0;
      buff[offset + 13] = (1 << bits) - 1;
      buff[offset + 14] = bits * 0;
      buff[offset + 15] = bits * 1;
      buff[offset + 16] = bits * 2;
      buff[offset + 17] = 0;
      buff[offset + 18] = 0;
      buff[offset + 19] = 0;
      sock._sQlen += 20;
      sock.flush();
    },
    clientEncodings(sock, encodings2) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 2;
      buff[offset + 1] = 0;
      buff[offset + 2] = encodings2.length >> 8;
      buff[offset + 3] = encodings2.length;
      let j = offset + 4;
      for (let i = 0; i < encodings2.length; i++) {
        const enc = encodings2[i];
        buff[j] = enc >> 24;
        buff[j + 1] = enc >> 16;
        buff[j + 2] = enc >> 8;
        buff[j + 3] = enc;
        j += 4;
      }
      sock._sQlen += j - offset;
      sock.flush();
    },
    fbUpdateRequest(sock, incremental, x, y, w, h) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      if (typeof x === "undefined") {
        x = 0;
      }
      if (typeof y === "undefined") {
        y = 0;
      }
      buff[offset] = 3;
      buff[offset + 1] = incremental ? 1 : 0;
      buff[offset + 2] = x >> 8 & 255;
      buff[offset + 3] = x & 255;
      buff[offset + 4] = y >> 8 & 255;
      buff[offset + 5] = y & 255;
      buff[offset + 6] = w >> 8 & 255;
      buff[offset + 7] = w & 255;
      buff[offset + 8] = h >> 8 & 255;
      buff[offset + 9] = h & 255;
      sock._sQlen += 10;
      sock.flush();
    },
    xvpOp(sock, ver, op) {
      const buff = sock._sQ;
      const offset = sock._sQlen;
      buff[offset] = 250;
      buff[offset + 1] = 0;
      buff[offset + 2] = ver;
      buff[offset + 3] = op;
      sock._sQlen += 4;
      sock.flush();
    }
  };
  RFB.cursors = {
    none: {
      rgbaPixels: new Uint8Array(),
      w: 0,
      h: 0,
      hotx: 0,
      hoty: 0
    },
    dot: {
      rgbaPixels: new Uint8Array([
        255,
        255,
        255,
        255,
        0,
        0,
        0,
        255,
        255,
        255,
        255,
        255,
        0,
        0,
        0,
        255,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        255,
        255,
        255,
        255,
        255,
        0,
        0,
        0,
        255,
        255,
        255,
        255,
        255
      ]),
      w: 3,
      h: 3,
      hotx: 1,
      hoty: 1
    }
  };

  // app/webutil.js
  function initLogging2(level) {
    "use strict";
    if (typeof level !== "undefined") {
      initLogging(level);
    } else {
      const param = document.location.href.match(/logging=([A-Za-z0-9._-]*)/);
      initLogging(param || void 0);
    }
  }
  function getQueryVar(name, defVal) {
    "use strict";
    const re = new RegExp(".*[?&]" + name + "=([^&#]*)"), match = "".concat(document.location.href, window.location.hash).match(re);
    if (typeof defVal === "undefined") {
      defVal = null;
    }
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return defVal;
  }
  function getHashVar(name, defVal) {
    "use strict";
    const re = new RegExp(".*[&#]" + name + "=([^&]*)"), match = document.location.hash.match(re);
    if (typeof defVal === "undefined") {
      defVal = null;
    }
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return defVal;
  }
  function getConfigVar(name, defVal) {
    "use strict";
    const val = getHashVar(name);
    if (val === null) {
      return getQueryVar(name, defVal);
    }
    return val;
  }
  var settings = {};
  function initSettings() {
    if (!window.chrome || !window.chrome.storage) {
      settings = {};
      return Promise.resolve();
    }
    return new Promise((resolve) => window.chrome.storage.sync.get(resolve)).then((cfg) => {
      settings = cfg;
    });
  }
  function setSetting(name, value) {
    settings[name] = value;
  }
  function writeSetting(name, value) {
    "use strict";
    if (settings[name] === value)
      return;
    settings[name] = value;
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.set(settings);
    } else {
      localStorage.setItem(name, value);
    }
  }
  function readSetting(name, defaultValue) {
    "use strict";
    let value;
    if (name in settings || window.chrome && window.chrome.storage) {
      value = settings[name];
    } else {
      value = localStorage.getItem(name);
      settings[name] = value;
    }
    if (typeof value === "undefined") {
      value = null;
    }
    if (value === null && typeof defaultValue !== "undefined") {
      return defaultValue;
    }
    return value;
  }

  // app/pve.js
  function PVEUI(UI2) {
    this.consoletype = getQueryVar("console");
    this.vmid = getQueryVar("vmid");
    this.vmname = getQueryVar("vmname");
    this.nodename = getQueryVar("node");
    this.resize = getQueryVar("resize");
    this.cmd = getQueryVar("cmd");
    this.fullscreen = getQueryVar("isFullscreen");
    this.lastFBWidth = void 0;
    this.lastFBHeight = void 0;
    this.sizeUpdateTimer = void 0;
    this.UI = UI2;
    var baseUrl = "/nodes/" + this.nodename;
    var url;
    var params = {websocket: 1};
    var title;
    switch (this.consoletype) {
      case "kvm":
        baseUrl += "/qemu/" + this.vmid;
        url = baseUrl + "/vncproxy";
        title = "VM " + this.vmid;
        if (this.vmname) {
          title += " ('" + this.vmname + "')";
        }
        break;
      case "lxc":
        baseUrl += "/lxc/" + this.vmid;
        url = baseUrl + "/vncproxy";
        title = "CT " + this.vmid;
        if (this.vmname) {
          title += " ('" + this.vmname + "')";
        }
        break;
      case "shell":
        url = baseUrl + "/vncshell";
        title = "node '" + this.nodename + "'";
        break;
      case "upgrade":
        url = baseUrl + "/vncshell";
        params.cmd = "upgrade";
        title = "System upgrade on node " + this.nodename;
        break;
      case "cmd":
        url = baseUrl + "/vncshell";
        params.cmd = decodeURI(this.cmd);
        title = "Install Ceph on node " + this.nodename;
        break;
      default:
        throw "implement me";
        break;
    }
    if (this.resize == "scale" && (this.consoletype === "lxc" || this.consoletype === "shell")) {
      var size = this.getFBSize();
      params.width = size.width;
      params.height = size.height;
    }
    this.baseUrl = baseUrl;
    this.url = url;
    this.params = params;
    document.title = title;
  }
  PVEUI.prototype = {
    urlEncode: function(object) {
      var i, value, params = [];
      for (i in object) {
        if (object.hasOwnProperty(i)) {
          value = object[i];
          if (value === void 0)
            value = "";
          params.push(encodeURIComponent(i) + "=" + encodeURIComponent(String(value)));
        }
      }
      return params.join("&");
    },
    API2Request: function(reqOpts) {
      var me = this;
      reqOpts.method = reqOpts.method || "GET";
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var scope = reqOpts.scope || this;
        var result;
        var errmsg;
        if (xhr.readyState === 4) {
          var ctype = xhr.getResponseHeader("Content-Type");
          if (xhr.status === 200) {
            if (ctype.match(/application\/json;/)) {
              result = JSON.parse(xhr.responseText);
            } else {
              errmsg = "got unexpected content type " + ctype;
            }
          } else {
            errmsg = "Error " + xhr.status + ": " + xhr.statusText;
          }
        } else {
          errmsg = "Connection error - server offline?";
        }
        if (errmsg !== void 0) {
          if (reqOpts.failure) {
            reqOpts.failure.call(scope, errmsg, xhr.status);
          }
        } else {
          if (reqOpts.success) {
            reqOpts.success.call(scope, result);
          }
        }
        if (reqOpts.callback) {
          reqOpts.callback.call(scope, errmsg === void 0);
        }
      };
      var data = me.urlEncode(reqOpts.params || {});
      if (reqOpts.method === "GET") {
        xhr.open(reqOpts.method, "/api2/json" + reqOpts.url + "?" + data);
      } else {
        xhr.open(reqOpts.method, "/api2/json" + reqOpts.url);
      }
      xhr.setRequestHeader("Cache-Control", "no-cache");
      if (reqOpts.method === "POST" || reqOpts.method === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("CSRFPreventionToken", PVE.CSRFPreventionToken);
        xhr.send(data);
      } else if (reqOpts.method === "GET") {
        xhr.send();
      } else {
        throw "unknown method";
      }
    },
    pve_detect_migrated_vm: function() {
      var me = this;
      if (me.consoletype === "kvm") {
        me.API2Request({
          url: "/cluster/resources",
          method: "GET",
          success: function(result) {
            var list = result.data;
            list.every(function(item) {
              if (item.type === "qemu" && item.vmid == me.vmid) {
                var url = "?" + me.urlEncode({
                  console: me.consoletype,
                  novnc: 1,
                  vmid: me.vmid,
                  vmname: me.vmname,
                  node: item.node,
                  resize: me.resize
                });
                location.href = url;
                return false;
              }
              return true;
            });
          }
        });
      } else if (me.consoletype === "lxc") {
        var migrating;
        var check = setInterval(function() {
          if (migrating === void 0 || migrating === true) {
            me.UI.showStatus("Waiting for connection...", "warning", 5e3);
            me.API2Request({
              url: me.baseUrl + "/config",
              method: "GET",
              success: function(result) {
                var lock = result.data.lock;
                if (lock == "migrate") {
                  migrating = true;
                  me.UI.showStatus("Migration detected, waiting...", "warning", 5e3);
                } else {
                  migrating = false;
                }
              },
              failure: function() {
                migrating = false;
              }
            });
          } else {
            me.UI.showStatus("Connection resumed", "warning");
            clearInterval(check);
            me.API2Request({
              url: "/cluster/resources",
              method: "GET",
              success: function(result) {
                var list = result.data;
                list.every(function(item) {
                  if (item.type === "lxc" && item.vmid == me.vmid) {
                    var url = "?" + me.urlEncode({
                      console: me.consoletype,
                      novnc: 1,
                      vmid: me.vmid,
                      vmname: me.vmname,
                      node: item.node,
                      resize: me.resize
                    });
                    location.href = url;
                    return false;
                  }
                  return true;
                });
              }
            });
          }
        }, 5e3);
      }
    },
    pve_vm_command: function(cmd, params, reload, mustConfirm = true) {
      var me = this;
      var baseUrl;
      var confirmMsg = "";
      switch (cmd) {
        case "start":
          reload = 1;
        case "shutdown":
        case "stop":
        case "reset":
        case "suspend":
        case "resume":
          confirmMsg = "Do you really want to " + cmd + " VM/CT {0}?";
          break;
        case "reload":
          location.reload();
          break;
        default:
          throw "implement me " + cmd;
      }
      confirmMsg = confirmMsg.replace("{0}", me.vmid);
      if (confirmMsg !== "" && mustConfirm && confirm(confirmMsg) !== true) {
        return;
      }
      me.UI.closePVECommandPanel();
      if (me.consoletype === "kvm") {
        baseUrl = "/nodes/" + me.nodename + "/qemu/" + me.vmid;
      } else if (me.consoletype === "lxc") {
        baseUrl = "/nodes/" + me.nodename + "/lxc/" + me.vmid;
      } else {
        throw "unknown VM type";
      }
      me.API2Request({
        params,
        url: baseUrl + "/status/" + cmd,
        method: "POST",
        failure: function(msg) {
          if (cmd === "start" && msg.match(/already running/) !== null) {
            me.UI.showStatus("VM command '" + cmd + "' successful", "normal");
            setTimeout(function() {
              location.reload();
            }, 1e3);
          } else {
            me.UI.showStatus(msg, "warning");
          }
        },
        success: function() {
          me.UI.showStatus("VM command '" + cmd + "' successful", "normal");
          if (reload) {
            setTimeout(function() {
              location.reload();
            }, 1e3);
          }
          ;
        }
      });
    },
    addPVEHandlers: function() {
      var me = this;
      document.getElementById("pve_commands_button").addEventListener("click", me.UI.togglePVECommandPanel);
      document.getElementById("noVNC_disconnect_button").classList.add("pve_hidden");
      if (me.consoletype === "kvm") {
        document.getElementById("noVNC_clipboard_button").classList.add("pve_hidden");
      }
      if (me.consoletype === "shell" || me.consoletype === "upgrade") {
        document.getElementById("pve_commands_button").classList.add("pve_hidden");
      }
      if (me.fullscreen) {
        document.getElementById("noVNC_fullscreen_button").classList.add("pve_hidden");
      }
      document.getElementById("pve_start_button").addEventListener("click", function() {
        me.pve_vm_command("start", {}, void 0, false);
      });
      var commandArray = [
        {cmd: "start", kvm: 1, lxc: 1},
        {cmd: "stop", kvm: 1, lxc: 1},
        {cmd: "shutdown", kvm: 1, lxc: 1},
        {cmd: "suspend", kvm: 1},
        {cmd: "resume", kvm: 1},
        {cmd: "reset", kvm: 1},
        {cmd: "reload", kvm: 1, lxc: 1, shell: 1}
      ];
      commandArray.forEach(function(item) {
        var el = document.getElementById("pve_command_" + item.cmd);
        if (!el) {
          return;
        }
        if (item[me.consoletype] === 1) {
          el.onclick = function() {
            me.pve_vm_command(item.cmd);
          };
        } else {
          el.classList.add("pve_hidden");
        }
      });
    },
    getFBSize: function() {
      var oh;
      var ow;
      if (window.innerHeight) {
        oh = window.innerHeight;
        ow = window.innerWidth;
      } else if (document.documentElement && document.documentElement.clientHeight) {
        oh = document.documentElement.clientHeight;
        ow = document.documentElement.clientWidth;
      } else if (document.body) {
        oh = document.body.clientHeight;
        ow = document.body.clientWidth;
      } else {
        throw "can't get window size";
      }
      return {width: ow, height: oh};
    },
    initConnection: function(callback) {
      let me = this;
      me.API2Request({
        url: me.url,
        method: "POST",
        params: me.params,
        success: function(result) {
          var wsparams = me.urlEncode({
            port: result.data.port,
            vncticket: result.data.ticket
          });
          document.getElementById("noVNC_password_input").value = result.data.ticket;
          me.UI.forceSetting("path", "api2/json" + me.baseUrl + "/vncwebsocket?" + wsparams);
          callback();
        },
        failure: function(msg) {
          me.UI.showStatus(msg, "error");
        }
      });
    },
    pveStart: function(callback) {
      var me = this;
      if (me.consoletype === "kvm" || me.consoletype === "lxc") {
        me.API2Request({
          url: `${me.baseUrl}/status/current`,
          method: "GET",
          success: function(result) {
            let status = result.data.status;
            if (status === "running") {
              me.initConnection(callback);
            } else {
              document.getElementById("pve_start_dlg").classList.add("noVNC_open");
            }
          },
          failure: function(msg, code) {
            if (code === 403) {
              me.initConnection(callback);
            } else {
              me.UI.showStatus(msg, "error");
            }
          }
        });
      } else {
        me.initConnection(callback);
      }
    },
    updateFBSize: function(rfb, width, height) {
      var me = this;
      try {
        me.lastFBWidth = Math.floor((width + 1) / 2) * 2;
        me.lastFBHeight = Math.floor((height + 1) / 2) * 2;
        if (me.sizeUpdateTimer !== void 0) {
          clearInterval(me.sizeUpdateTimer);
        }
        var update_size = function() {
          var clip = me.UI.getSetting("view_clip");
          var resize = me.UI.getSetting("resize");
          var autoresize = me.UI.getSetting("autoresize");
          if (clip || resize === "scale" || !autoresize) {
            return;
          }
          if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            return;
          }
          var oldsize = me.getFBSize();
          var offsetw = me.lastFBWidth - oldsize.width;
          var offseth = me.lastFBHeight - oldsize.height;
          if (offsetw !== 0 || offseth !== 0) {
            try {
              window.resizeBy(offsetw, offseth);
            } catch (e2) {
              console.log("resizing did not work", e2);
            }
          }
        };
        update_size();
        me.sizeUpdateTimer = setInterval(update_size, 1e3);
      } catch (e2) {
        console.log(e2);
      }
    }
  };

  // app/ui.js
  var PAGE_TITLE = "noVNC";
  var UI = {
    connected: false,
    desktopName: "",
    statusTimeout: null,
    hideKeyboardTimeout: null,
    idleControlbarTimeout: null,
    closeControlbarTimeout: null,
    controlbarGrabbed: false,
    controlbarDrag: false,
    controlbarMouseDownClientY: 0,
    controlbarMouseDownOffsetY: 0,
    lastKeyboardinput: null,
    defaultKeyboardinputLen: 100,
    inhibitReconnect: true,
    reconnectCallback: null,
    reconnectPassword: null,
    prime() {
      return initSettings().then(() => {
        if (document.readyState === "interactive" || document.readyState === "complete") {
          return UI.start();
        }
        return new Promise((resolve, reject) => {
          document.addEventListener("DOMContentLoaded", () => UI.start().then(resolve).catch(reject));
        });
      });
    },
    start() {
      UI.PVE = new PVEUI(UI);
      UI.initSettings();
      l10n.translateDOM();
      if (!window.isSecureContext) {
        UI.showStatus(localization_default("HTTPS is required for full functionality"), "error");
      }
      fetch("/novnc/package.json").then((response) => {
        if (!response.ok) {
          throw Error("" + response.status + " " + response.statusText);
        }
        return response.json();
      }).then((packageInfo) => {
        Array.from(document.getElementsByClassName("noVNC_version")).forEach((el) => el.innerText = packageInfo.version);
      }).catch((err2) => {
        Error2("Couldn't fetch package.json: " + err2);
        Array.from(document.getElementsByClassName("noVNC_version_wrapper")).concat(Array.from(document.getElementsByClassName("noVNC_version_separator"))).forEach((el) => el.style.display = "none");
      });
      if (isTouchDevice) {
        setTimeout(() => window.scrollTo(0, 1), 100);
      }
      if (readSetting("controlbar_pos") === "right") {
        UI.toggleControlbarSide();
      }
      UI.initFullscreen();
      UI.addControlbarHandlers();
      UI.addTouchSpecificHandlers();
      UI.addExtraKeysHandlers();
      UI.addMachineHandlers();
      UI.addConnectionControlHandlers();
      UI.addClipboardHandlers();
      UI.addSettingsHandlers();
      UI.PVE.addPVEHandlers();
      document.getElementById("noVNC_status").addEventListener("click", UI.hideStatus);
      UI.keyboardinputReset();
      UI.openControlbar();
      UI.updateViewClip();
      UI.updateVisualState("init");
      document.documentElement.classList.remove("noVNC_loading");
      UI.PVE.pveStart(function() {
        UI.connect();
      });
      return Promise.resolve(UI.rfb);
    },
    initFullscreen() {
      if (!isSafari() && (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.body.msRequestFullscreen)) {
        document.getElementById("noVNC_fullscreen_button").classList.remove("noVNC_hidden");
        UI.addFullscreenHandlers();
      }
    },
    initSettings() {
      const llevels = ["error", "warn", "info", "debug"];
      for (let i = 0; i < llevels.length; i += 1) {
        UI.addOption(document.getElementById("noVNC_setting_logging"), llevels[i], llevels[i]);
      }
      UI.initSetting("logging", "warn");
      UI.updateLogging();
      let port = window.location.port;
      if (!port) {
        if (window.location.protocol.substring(0, 5) == "https") {
          port = 443;
        } else if (window.location.protocol.substring(0, 4) == "http") {
          port = 80;
        }
      }
      UI.initSetting("host", window.location.hostname);
      UI.initSetting("port", port);
      UI.initSetting("encrypt", true);
      UI.initSetting("view_clip", false);
      UI.initSetting("resize", "off");
      UI.initSetting("quality", 6);
      UI.initSetting("compression", 2);
      UI.initSetting("autoresize", true);
      UI.initSetting("local_cursor", true);
      UI.initSetting("shared", true);
      UI.initSetting("view_only", false);
      UI.initSetting("show_dot", false);
      UI.initSetting("path", "websockify");
      UI.initSetting("repeaterID", "");
      UI.initSetting("reconnect", false);
      UI.initSetting("reconnect_delay", 5e3);
      UI.setupSettingLabels();
    },
    setupSettingLabels() {
      const labels = document.getElementsByTagName("LABEL");
      for (let i = 0; i < labels.length; i++) {
        const htmlFor = labels[i].htmlFor;
        if (htmlFor != "") {
          const elem = document.getElementById(htmlFor);
          if (elem)
            elem.label = labels[i];
        } else {
          const children = labels[i].children;
          for (let j = 0; j < children.length; j++) {
            if (children[j].form !== void 0) {
              children[j].label = labels[i];
              break;
            }
          }
        }
      }
    },
    addControlbarHandlers() {
      document.getElementById("noVNC_control_bar").addEventListener("mousemove", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("mouseup", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("mousedown", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("keydown", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("mousedown", UI.keepControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("keydown", UI.keepControlbar);
      document.getElementById("noVNC_view_drag_button").addEventListener("click", UI.toggleViewDrag);
      document.getElementById("noVNC_control_bar_handle").addEventListener("mousedown", UI.controlbarHandleMouseDown);
      document.getElementById("noVNC_control_bar_handle").addEventListener("mouseup", UI.controlbarHandleMouseUp);
      document.getElementById("noVNC_control_bar_handle").addEventListener("mousemove", UI.dragControlbarHandle);
      window.addEventListener("resize", UI.updateControlbarHandle);
      const exps = document.getElementsByClassName("noVNC_expander");
      for (let i = 0; i < exps.length; i++) {
        exps[i].addEventListener("click", UI.toggleExpander);
      }
    },
    addTouchSpecificHandlers() {
      document.getElementById("noVNC_keyboard_button").addEventListener("click", UI.toggleVirtualKeyboard);
      UI.touchKeyboard = new keyboard_default(document.getElementById("noVNC_keyboardinput"));
      UI.touchKeyboard.onkeyevent = UI.keyEvent;
      UI.touchKeyboard.grab();
      document.getElementById("noVNC_keyboardinput").addEventListener("input", UI.keyInput);
      document.getElementById("noVNC_keyboardinput").addEventListener("focus", UI.onfocusVirtualKeyboard);
      document.getElementById("noVNC_keyboardinput").addEventListener("blur", UI.onblurVirtualKeyboard);
      document.getElementById("noVNC_keyboardinput").addEventListener("submit", () => false);
      document.documentElement.addEventListener("mousedown", UI.keepVirtualKeyboard, true);
      document.getElementById("noVNC_control_bar").addEventListener("touchstart", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("touchmove", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("touchend", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("input", UI.activateControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("touchstart", UI.keepControlbar);
      document.getElementById("noVNC_control_bar").addEventListener("input", UI.keepControlbar);
      document.getElementById("noVNC_control_bar_handle").addEventListener("touchstart", UI.controlbarHandleMouseDown);
      document.getElementById("noVNC_control_bar_handle").addEventListener("touchend", UI.controlbarHandleMouseUp);
      document.getElementById("noVNC_control_bar_handle").addEventListener("touchmove", UI.dragControlbarHandle);
    },
    addExtraKeysHandlers() {
      document.getElementById("noVNC_toggle_extra_keys_button").addEventListener("click", UI.toggleExtraKeys);
      document.getElementById("noVNC_toggle_ctrl_button").addEventListener("click", UI.toggleCtrl);
      document.getElementById("noVNC_toggle_windows_button").addEventListener("click", UI.toggleWindows);
      document.getElementById("noVNC_toggle_alt_button").addEventListener("click", UI.toggleAlt);
      document.getElementById("noVNC_send_tab_button").addEventListener("click", UI.sendTab);
      document.getElementById("noVNC_send_esc_button").addEventListener("click", UI.sendEsc);
      document.getElementById("noVNC_send_ctrl_alt_del_button").addEventListener("click", UI.sendCtrlAltDel);
    },
    addMachineHandlers() {
      document.getElementById("noVNC_shutdown_button").addEventListener("click", () => UI.rfb.machineShutdown());
      document.getElementById("noVNC_reboot_button").addEventListener("click", () => UI.rfb.machineReboot());
      document.getElementById("noVNC_reset_button").addEventListener("click", () => UI.rfb.machineReset());
      document.getElementById("noVNC_power_button").addEventListener("click", UI.togglePowerPanel);
    },
    addConnectionControlHandlers() {
      document.getElementById("noVNC_disconnect_button").addEventListener("click", UI.disconnect);
      document.getElementById("noVNC_connect_button").addEventListener("click", UI.connect);
      document.getElementById("noVNC_cancel_reconnect_button").addEventListener("click", UI.cancelReconnect);
      document.getElementById("noVNC_approve_server_button").addEventListener("click", UI.approveServer);
      document.getElementById("noVNC_reject_server_button").addEventListener("click", UI.rejectServer);
      document.getElementById("noVNC_credentials_button").addEventListener("click", UI.setCredentials);
    },
    addClipboardHandlers() {
      document.getElementById("noVNC_clipboard_button").addEventListener("click", UI.toggleClipboardPanel);
      document.getElementById("noVNC_clipboard_text").addEventListener("change", UI.clipboardSend);
    },
    addSettingChangeHandler(name, changeFunc) {
      const settingElem = document.getElementById("noVNC_setting_" + name);
      if (changeFunc === void 0) {
        changeFunc = () => UI.saveSetting(name);
      }
      settingElem.addEventListener("change", changeFunc);
    },
    addSettingsHandlers() {
      document.getElementById("noVNC_settings_button").addEventListener("click", UI.toggleSettingsPanel);
      UI.addSettingChangeHandler("encrypt");
      UI.addSettingChangeHandler("resize");
      UI.addSettingChangeHandler("resize", UI.applyResizeMode);
      UI.addSettingChangeHandler("resize", UI.updateViewClip);
      UI.addSettingChangeHandler("autoresize");
      UI.addSettingChangeHandler("quality");
      UI.addSettingChangeHandler("quality", UI.updateQuality);
      UI.addSettingChangeHandler("compression");
      UI.addSettingChangeHandler("compression", UI.updateCompression);
      UI.addSettingChangeHandler("view_clip");
      UI.addSettingChangeHandler("view_clip", UI.updateViewClip);
      UI.addSettingChangeHandler("shared");
      UI.addSettingChangeHandler("view_only");
      UI.addSettingChangeHandler("view_only", UI.updateViewOnly);
      UI.addSettingChangeHandler("show_dot");
      UI.addSettingChangeHandler("show_dot", UI.updateShowDotCursor);
      UI.addSettingChangeHandler("local_cursor");
      UI.addSettingChangeHandler("local_cursor", UI.updateLocalCursor);
      UI.addSettingChangeHandler("host");
      UI.addSettingChangeHandler("port");
      UI.addSettingChangeHandler("path");
      UI.addSettingChangeHandler("repeaterID");
      UI.addSettingChangeHandler("logging");
      UI.addSettingChangeHandler("logging", UI.updateLogging);
      UI.addSettingChangeHandler("reconnect");
      UI.addSettingChangeHandler("reconnect_delay");
    },
    addFullscreenHandlers() {
      document.getElementById("noVNC_fullscreen_button").addEventListener("click", UI.toggleFullscreen);
      window.addEventListener("fullscreenchange", UI.updateFullscreenButton);
      window.addEventListener("mozfullscreenchange", UI.updateFullscreenButton);
      window.addEventListener("webkitfullscreenchange", UI.updateFullscreenButton);
      window.addEventListener("msfullscreenchange", UI.updateFullscreenButton);
    },
    updateVisualState(state) {
      document.documentElement.classList.remove("noVNC_connecting");
      document.documentElement.classList.remove("noVNC_connected");
      document.documentElement.classList.remove("noVNC_disconnecting");
      document.documentElement.classList.remove("noVNC_reconnecting");
      const transitionElem = document.getElementById("noVNC_transition_text");
      switch (state) {
        case "init":
          break;
        case "connecting":
          transitionElem.textContent = localization_default("Connecting...");
          document.documentElement.classList.add("noVNC_connecting");
          break;
        case "connected":
          UI.connected = true;
          UI.inhibit_reconnect = false;
          UI.pveAllowMigratedTest = true;
          document.documentElement.classList.add("noVNC_connected");
          break;
        case "disconnecting":
          transitionElem.textContent = localization_default("Disconnecting...");
          document.documentElement.classList.add("noVNC_disconnecting");
          break;
        case "disconnected":
          UI.showStatus(localization_default("Disconnected"));
          if (UI.pveAllowMigratedTest === true) {
            UI.pveAllowMigratedTest = false;
            UI.PVE.pve_detect_migrated_vm();
          }
          break;
        case "reconnecting":
          transitionElem.textContent = localization_default("Reconnecting...");
          document.documentElement.classList.add("noVNC_reconnecting");
          break;
        default:
          Error2("Invalid visual state: " + state);
          UI.showStatus(localization_default("Internal error"), "error");
          return;
      }
      if (UI.connected) {
        UI.updateViewClip();
        UI.disableSetting("encrypt");
        UI.disableSetting("shared");
        UI.disableSetting("host");
        UI.disableSetting("port");
        UI.disableSetting("path");
        UI.disableSetting("repeaterID");
        UI.closeControlbarTimeout = setTimeout(UI.closeControlbar, 2e3);
      } else {
        UI.enableSetting("encrypt");
        UI.enableSetting("shared");
        UI.enableSetting("host");
        UI.enableSetting("port");
        UI.enableSetting("path");
        UI.enableSetting("repeaterID");
        UI.updatePowerButton();
        UI.keepControlbar();
      }
      UI.closeAllPanels();
      document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
      document.getElementById("noVNC_credentials_dlg").classList.remove("noVNC_open");
    },
    showStatus(text, statusType, time) {
      const statusElem = document.getElementById("noVNC_status");
      if (typeof statusType === "undefined") {
        statusType = "normal";
      }
      if (statusElem.classList.contains("noVNC_open")) {
        if (statusElem.classList.contains("noVNC_status_error")) {
          return;
        }
        if (statusElem.classList.contains("noVNC_status_warn") && statusType === "normal") {
          return;
        }
      }
      clearTimeout(UI.statusTimeout);
      switch (statusType) {
        case "error":
          statusElem.classList.remove("noVNC_status_warn");
          statusElem.classList.remove("noVNC_status_normal");
          statusElem.classList.add("noVNC_status_error");
          break;
        case "warning":
        case "warn":
          statusElem.classList.remove("noVNC_status_error");
          statusElem.classList.remove("noVNC_status_normal");
          statusElem.classList.add("noVNC_status_warn");
          break;
        case "normal":
        case "info":
        default:
          statusElem.classList.remove("noVNC_status_error");
          statusElem.classList.remove("noVNC_status_warn");
          statusElem.classList.add("noVNC_status_normal");
          break;
      }
      statusElem.textContent = text;
      statusElem.classList.add("noVNC_open");
      if (typeof time === "undefined") {
        time = 1500;
      }
      if (statusType !== "error") {
        UI.statusTimeout = window.setTimeout(UI.hideStatus, time);
      }
    },
    hideStatus() {
      clearTimeout(UI.statusTimeout);
      document.getElementById("noVNC_status").classList.remove("noVNC_open");
    },
    activateControlbar(event) {
      clearTimeout(UI.idleControlbarTimeout);
      document.getElementById("noVNC_control_bar_anchor").classList.remove("noVNC_idle");
      UI.idleControlbarTimeout = window.setTimeout(UI.idleControlbar, 2e3);
    },
    idleControlbar() {
      if (document.getElementById("noVNC_control_bar").contains(document.activeElement) && document.hasFocus()) {
        UI.activateControlbar();
        return;
      }
      document.getElementById("noVNC_control_bar_anchor").classList.add("noVNC_idle");
    },
    keepControlbar() {
      clearTimeout(UI.closeControlbarTimeout);
    },
    openControlbar() {
      document.getElementById("noVNC_control_bar").classList.add("noVNC_open");
    },
    closeControlbar() {
      UI.closeAllPanels();
      document.getElementById("noVNC_control_bar").classList.remove("noVNC_open");
      UI.rfb.focus();
    },
    toggleControlbar() {
      if (document.getElementById("noVNC_control_bar").classList.contains("noVNC_open")) {
        UI.closeControlbar();
      } else {
        UI.openControlbar();
      }
    },
    toggleControlbarSide() {
      const bar = document.getElementById("noVNC_control_bar");
      const barDisplayStyle = window.getComputedStyle(bar).display;
      if (barDisplayStyle !== "none") {
        bar.style.transitionDuration = "0s";
        bar.addEventListener("transitionend", () => bar.style.transitionDuration = "");
      }
      const anchor = document.getElementById("noVNC_control_bar_anchor");
      if (anchor.classList.contains("noVNC_right")) {
        writeSetting("controlbar_pos", "left");
        anchor.classList.remove("noVNC_right");
      } else {
        writeSetting("controlbar_pos", "right");
        anchor.classList.add("noVNC_right");
      }
      UI.controlbarDrag = true;
      UI.showControlbarHint(false, false);
    },
    showControlbarHint(show, animate = true) {
      const hint = document.getElementById("noVNC_control_bar_hint");
      if (animate) {
        hint.classList.remove("noVNC_notransition");
      } else {
        hint.classList.add("noVNC_notransition");
      }
      if (show) {
        hint.classList.add("noVNC_active");
      } else {
        hint.classList.remove("noVNC_active");
      }
    },
    dragControlbarHandle(e2) {
      if (!UI.controlbarGrabbed)
        return;
      const ptr = getPointerEvent(e2);
      const anchor = document.getElementById("noVNC_control_bar_anchor");
      if (ptr.clientX < window.innerWidth * 0.1) {
        if (anchor.classList.contains("noVNC_right")) {
          UI.toggleControlbarSide();
        }
      } else if (ptr.clientX > window.innerWidth * 0.9) {
        if (!anchor.classList.contains("noVNC_right")) {
          UI.toggleControlbarSide();
        }
      }
      if (!UI.controlbarDrag) {
        const dragDistance = Math.abs(ptr.clientY - UI.controlbarMouseDownClientY);
        if (dragDistance < dragThreshold)
          return;
        UI.controlbarDrag = true;
      }
      const eventY = ptr.clientY - UI.controlbarMouseDownOffsetY;
      UI.moveControlbarHandle(eventY);
      e2.preventDefault();
      e2.stopPropagation();
      UI.keepControlbar();
      UI.activateControlbar();
    },
    moveControlbarHandle(viewportRelativeY) {
      const handle = document.getElementById("noVNC_control_bar_handle");
      const handleHeight = handle.getBoundingClientRect().height;
      const controlbarBounds = document.getElementById("noVNC_control_bar").getBoundingClientRect();
      const margin = 10;
      if (handleHeight === 0 || controlbarBounds.height === 0) {
        return;
      }
      let newY = viewportRelativeY;
      if (newY < controlbarBounds.top + margin) {
        newY = controlbarBounds.top + margin;
      } else if (newY > controlbarBounds.top + controlbarBounds.height - handleHeight - margin) {
        newY = controlbarBounds.top + controlbarBounds.height - handleHeight - margin;
      }
      if (controlbarBounds.height < handleHeight + margin * 2) {
        newY = controlbarBounds.top + (controlbarBounds.height - handleHeight) / 2;
      }
      const parentRelativeY = newY - controlbarBounds.top;
      handle.style.transform = "translateY(" + parentRelativeY + "px)";
    },
    updateControlbarHandle() {
      const handle = document.getElementById("noVNC_control_bar_handle");
      const handleBounds = handle.getBoundingClientRect();
      UI.moveControlbarHandle(handleBounds.top);
    },
    controlbarHandleMouseUp(e2) {
      if (e2.type == "mouseup" && e2.button != 0)
        return;
      if (UI.controlbarGrabbed && !UI.controlbarDrag) {
        UI.toggleControlbar();
        e2.preventDefault();
        e2.stopPropagation();
        UI.keepControlbar();
        UI.activateControlbar();
      }
      UI.controlbarGrabbed = false;
      UI.showControlbarHint(false);
    },
    controlbarHandleMouseDown(e2) {
      if (e2.type == "mousedown" && e2.button != 0)
        return;
      const ptr = getPointerEvent(e2);
      const handle = document.getElementById("noVNC_control_bar_handle");
      const bounds = handle.getBoundingClientRect();
      if (e2.type === "mousedown") {
        setCapture(handle);
      }
      UI.controlbarGrabbed = true;
      UI.controlbarDrag = false;
      UI.showControlbarHint(true);
      UI.controlbarMouseDownClientY = ptr.clientY;
      UI.controlbarMouseDownOffsetY = ptr.clientY - bounds.top;
      e2.preventDefault();
      e2.stopPropagation();
      UI.keepControlbar();
      UI.activateControlbar();
    },
    toggleExpander(e2) {
      if (this.classList.contains("noVNC_open")) {
        this.classList.remove("noVNC_open");
      } else {
        this.classList.add("noVNC_open");
      }
    },
    initSetting(name, defVal) {
      let val = getConfigVar(name);
      if (val === null) {
        val = readSetting(name, defVal);
      }
      setSetting(name, val);
      UI.updateSetting(name);
      return val;
    },
    forceSetting(name, val) {
      setSetting(name, val);
      UI.updateSetting(name);
      UI.disableSetting(name);
    },
    updateSetting(name) {
      let value = UI.getSetting(name);
      const ctrl = document.getElementById("noVNC_setting_" + name);
      if (ctrl.type === "checkbox") {
        ctrl.checked = value;
      } else if (typeof ctrl.options !== "undefined") {
        for (let i = 0; i < ctrl.options.length; i += 1) {
          if (ctrl.options[i].value === value) {
            ctrl.selectedIndex = i;
            break;
          }
        }
      } else {
        ctrl.value = value;
      }
    },
    saveSetting(name) {
      const ctrl = document.getElementById("noVNC_setting_" + name);
      let val;
      if (ctrl.type === "checkbox") {
        val = ctrl.checked;
      } else if (typeof ctrl.options !== "undefined") {
        val = ctrl.options[ctrl.selectedIndex].value;
      } else {
        val = ctrl.value;
      }
      writeSetting(name, val);
      return val;
    },
    getSetting(name) {
      const ctrl = document.getElementById("noVNC_setting_" + name);
      let val = readSetting(name);
      if (typeof val !== "undefined" && val !== null && ctrl.type === "checkbox") {
        if (val.toString().toLowerCase() in {"0": 1, no: 1, false: 1}) {
          val = false;
        } else {
          val = true;
        }
      }
      return val;
    },
    disableSetting(name) {
      const ctrl = document.getElementById("noVNC_setting_" + name);
      ctrl.disabled = true;
      ctrl.label.classList.add("noVNC_disabled");
    },
    enableSetting(name) {
      const ctrl = document.getElementById("noVNC_setting_" + name);
      ctrl.disabled = false;
      ctrl.label.classList.remove("noVNC_disabled");
    },
    closeAllPanels() {
      UI.closeSettingsPanel();
      UI.closePowerPanel();
      UI.closeClipboardPanel();
      UI.closeExtraKeys();
      UI.closePVECommandPanel();
    },
    openSettingsPanel() {
      UI.closeAllPanels();
      UI.openControlbar();
      UI.updateSetting("encrypt");
      UI.updateSetting("view_clip");
      UI.updateSetting("resize");
      UI.updateSetting("quality");
      UI.updateSetting("compression");
      UI.updateSetting("shared");
      UI.updateSetting("view_only");
      UI.updateSetting("path");
      UI.updateSetting("repeaterID");
      UI.updateSetting("logging");
      UI.updateSetting("reconnect");
      UI.updateSetting("reconnect_delay");
      document.getElementById("noVNC_settings").classList.add("noVNC_open");
      document.getElementById("noVNC_settings_button").classList.add("noVNC_selected");
    },
    closeSettingsPanel() {
      document.getElementById("noVNC_settings").classList.remove("noVNC_open");
      document.getElementById("noVNC_settings_button").classList.remove("noVNC_selected");
    },
    toggleSettingsPanel() {
      if (document.getElementById("noVNC_settings").classList.contains("noVNC_open")) {
        UI.closeSettingsPanel();
      } else {
        UI.openSettingsPanel();
      }
    },
    openPowerPanel() {
      UI.closeAllPanels();
      UI.openControlbar();
      document.getElementById("noVNC_power").classList.add("noVNC_open");
      document.getElementById("noVNC_power_button").classList.add("noVNC_selected");
    },
    closePowerPanel() {
      document.getElementById("noVNC_power").classList.remove("noVNC_open");
      document.getElementById("noVNC_power_button").classList.remove("noVNC_selected");
    },
    togglePowerPanel() {
      if (document.getElementById("noVNC_power").classList.contains("noVNC_open")) {
        UI.closePowerPanel();
      } else {
        UI.openPowerPanel();
      }
    },
    updatePowerButton() {
      if (UI.connected && UI.rfb.capabilities.power && !UI.rfb.viewOnly) {
        document.getElementById("noVNC_power_button").classList.remove("noVNC_hidden");
      } else {
        document.getElementById("noVNC_power_button").classList.add("noVNC_hidden");
        UI.closePowerPanel();
      }
    },
    openClipboardPanel() {
      UI.closeAllPanels();
      UI.openControlbar();
      document.getElementById("noVNC_clipboard").classList.add("noVNC_open");
      document.getElementById("noVNC_clipboard_button").classList.add("noVNC_selected");
    },
    closeClipboardPanel() {
      document.getElementById("noVNC_clipboard").classList.remove("noVNC_open");
      document.getElementById("noVNC_clipboard_button").classList.remove("noVNC_selected");
    },
    toggleClipboardPanel() {
      if (document.getElementById("noVNC_clipboard").classList.contains("noVNC_open")) {
        UI.closeClipboardPanel();
      } else {
        UI.openClipboardPanel();
      }
    },
    clipboardReceive(e2) {
      Debug(">> UI.clipboardReceive: " + e2.detail.text.substr(0, 40) + "...");
      document.getElementById("noVNC_clipboard_text").value = e2.detail.text;
      Debug("<< UI.clipboardReceive");
    },
    clipboardSend() {
      const text = document.getElementById("noVNC_clipboard_text").value;
      Debug(">> UI.clipboardSend: " + text.substr(0, 40) + "...");
      UI.rfb.clipboardPasteFrom(text);
      Debug("<< UI.clipboardSend");
    },
    openConnectPanel() {
      document.getElementById("noVNC_connect_dlg").classList.add("noVNC_open");
    },
    closeConnectPanel() {
      document.getElementById("noVNC_connect_dlg").classList.remove("noVNC_open");
    },
    connect(event, password) {
      if (typeof UI.rfb !== "undefined") {
        return;
      }
      const host = UI.getSetting("host");
      const port = UI.getSetting("port");
      const path = UI.getSetting("path");
      if (typeof password === "undefined") {
        password = getConfigVar("password");
        UI.reconnectPassword = password;
      }
      var password = document.getElementById("noVNC_password_input").value;
      if (!password) {
        password = getConfigVar("password");
      }
      if (password === null) {
        password = void 0;
      }
      UI.hideStatus();
      if (!host) {
        Error2("Can't connect when host is: " + host);
        UI.showStatus(localization_default("Must set host"), "error");
        return;
      }
      UI.closeConnectPanel();
      UI.updateVisualState("connecting");
      let url;
      url = UI.getSetting("encrypt") ? "wss" : "ws";
      url += "://" + host;
      if (port) {
        url += ":" + port;
      }
      url += "/" + path;
      UI.rfb = new rfb_default(document.getElementById("noVNC_container"), url, {
        shared: UI.getSetting("shared"),
        repeaterID: UI.getSetting("repeaterID"),
        credentials: {password}
      });
      UI.rfb.addEventListener("connect", UI.connectFinished);
      UI.rfb.addEventListener("disconnect", UI.disconnectFinished);
      UI.rfb.addEventListener("serververification", UI.serverVerify);
      UI.rfb.addEventListener("credentialsrequired", UI.credentials);
      UI.rfb.addEventListener("securityfailure", UI.securityFailed);
      UI.rfb.addEventListener("clippingviewport", UI.updateViewDrag);
      UI.rfb.addEventListener("capabilities", UI.updatePowerButton);
      UI.rfb.addEventListener("clipboard", UI.clipboardReceive);
      UI.rfb.addEventListener("bell", UI.bell);
      UI.rfb.addEventListener("desktopname", UI.updateDesktopName);
      UI.rfb.addEventListener("fbresize", UI.updateSessionSize);
      UI.rfb.clipViewport = UI.getSetting("view_clip");
      UI.rfb.localCursor = UI.getSetting("local_cursor");
      UI.rfb.scaleViewport = UI.getSetting("resize") === "scale";
      UI.rfb.resizeSession = UI.getSetting("resize") === "remote";
      UI.rfb.qualityLevel = parseInt(UI.getSetting("quality"));
      UI.rfb.compressionLevel = parseInt(UI.getSetting("compression"));
      UI.rfb.showDotCursor = UI.getSetting("show_dot");
      UI.updateViewOnly();
    },
    disconnect() {
      UI.rfb.disconnect();
      UI.connected = false;
      UI.inhibitReconnect = true;
      UI.updateVisualState("disconnecting");
    },
    reconnect() {
      UI.reconnectCallback = null;
      if (UI.inhibitReconnect) {
        return;
      }
      UI.connect(null, UI.reconnectPassword);
    },
    cancelReconnect() {
      if (UI.reconnectCallback !== null) {
        clearTimeout(UI.reconnectCallback);
        UI.reconnectCallback = null;
      }
      UI.updateVisualState("disconnected");
      UI.openControlbar();
      UI.openConnectPanel();
    },
    connectFinished(e2) {
      UI.connected = true;
      UI.inhibitReconnect = false;
      let msg;
      if (UI.getSetting("encrypt")) {
        msg = localization_default("Connected (encrypted) to ") + UI.desktopName;
      } else {
        msg = localization_default("Connected (unencrypted) to ") + UI.desktopName;
      }
      UI.showStatus(msg);
      UI.updateVisualState("connected");
      UI.rfb.focus();
    },
    disconnectFinished(e2) {
      const wasConnected = UI.connected;
      UI.connected = false;
      UI.rfb = void 0;
      if (!e2.detail.clean) {
        UI.updateVisualState("disconnected");
        if (wasConnected) {
          UI.showStatus(localization_default("Something went wrong, connection is closed"), "error");
        } else {
          UI.showStatus(localization_default("Failed to connect to server"), "error");
        }
      }
      if (UI.getSetting("reconnect", false) === true && !UI.inhibitReconnect) {
        UI.updateVisualState("reconnecting");
        const delay = parseInt(UI.getSetting("reconnect_delay"));
        UI.reconnectCallback = setTimeout(UI.reconnect, delay);
        return;
      } else {
        UI.updateVisualState("disconnected");
        UI.showStatus(localization_default("Disconnected"), "normal");
      }
      document.title = PAGE_TITLE;
      UI.openControlbar();
      UI.openConnectPanel();
    },
    securityFailed(e2) {
      let msg = "";
      if ("reason" in e2.detail) {
        msg = localization_default("New connection has been rejected with reason: ") + e2.detail.reason;
      } else {
        msg = localization_default("New connection has been rejected");
      }
      UI.showStatus(msg, "error");
    },
    async serverVerify(e2) {
      const type = e2.detail.type;
      if (type === "RSA") {
        const publickey = e2.detail.publickey;
        let fingerprint = await window.crypto.subtle.digest("SHA-1", publickey);
        fingerprint = Array.from(new Uint8Array(fingerprint).slice(0, 8)).map((x) => x.toString(16).padStart(2, "0")).join("-");
        document.getElementById("noVNC_verify_server_dlg").classList.add("noVNC_open");
        document.getElementById("noVNC_fingerprint").innerHTML = fingerprint;
      }
    },
    approveServer(e2) {
      e2.preventDefault();
      document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
      UI.rfb.approveServer();
    },
    rejectServer(e2) {
      e2.preventDefault();
      document.getElementById("noVNC_verify_server_dlg").classList.remove("noVNC_open");
      UI.disconnect();
    },
    credentials(e2) {
      document.getElementById("noVNC_username_block").classList.remove("noVNC_hidden");
      document.getElementById("noVNC_password_block").classList.remove("noVNC_hidden");
      let inputFocus = "none";
      if (e2.detail.types.indexOf("username") === -1) {
        document.getElementById("noVNC_username_block").classList.add("noVNC_hidden");
      } else {
        inputFocus = inputFocus === "none" ? "noVNC_username_input" : inputFocus;
      }
      if (e2.detail.types.indexOf("password") === -1) {
        document.getElementById("noVNC_password_block").classList.add("noVNC_hidden");
      } else {
        inputFocus = inputFocus === "none" ? "noVNC_password_input" : inputFocus;
      }
      document.getElementById("noVNC_credentials_dlg").classList.add("noVNC_open");
      setTimeout(() => document.getElementById(inputFocus).focus(), 100);
      Warn("Server asked for credentials");
      UI.showStatus(localization_default("Credentials are required"), "warning");
    },
    setCredentials(e2) {
      e2.preventDefault();
      let inputElemUsername = document.getElementById("noVNC_username_input");
      const username = inputElemUsername.value;
      let inputElemPassword = document.getElementById("noVNC_password_input");
      const password = inputElemPassword.value;
      inputElemPassword.value = "";
      UI.rfb.sendCredentials({username, password});
      UI.reconnectPassword = password;
      document.getElementById("noVNC_credentials_dlg").classList.remove("noVNC_open");
    },
    toggleFullscreen() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        if (getQueryVar("resize") !== "scale") {
          UI.forceSetting("resize", "off");
          UI.enableSetting("resize");
        }
      } else {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.body.msRequestFullscreen) {
          document.body.msRequestFullscreen();
        }
        UI.forceSetting("resize", "scale");
        UI.enableSetting("resize");
      }
      UI.applyResizeMode();
      UI.updateFullscreenButton();
    },
    updateFullscreenButton() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        document.getElementById("noVNC_fullscreen_button").classList.add("noVNC_selected");
      } else {
        document.getElementById("noVNC_fullscreen_button").classList.remove("noVNC_selected");
      }
    },
    applyResizeMode() {
      if (!UI.rfb)
        return;
      UI.rfb.scaleViewport = UI.getSetting("resize") === "scale";
      UI.rfb.resizeSession = UI.getSetting("resize") === "remote";
    },
    updateViewClip() {
      if (!UI.rfb)
        return;
      const scaling = UI.getSetting("resize") === "scale";
      let brokenScrollbars = false;
      if (!hasScrollbarGutter) {
        if (isIOS() || isAndroid() || isMac() || isChromeOS()) {
          brokenScrollbars = true;
        }
      }
      if (scaling) {
        UI.forceSetting("view_clip", false);
        UI.rfb.clipViewport = false;
      } else if (brokenScrollbars) {
        UI.forceSetting("view_clip", true);
        UI.rfb.clipViewport = true;
      } else {
        UI.enableSetting("view_clip");
        UI.rfb.clipViewport = UI.getSetting("view_clip");
      }
      UI.updateViewDrag();
    },
    toggleViewDrag() {
      if (!UI.rfb)
        return;
      UI.rfb.dragViewport = !UI.rfb.dragViewport;
      UI.updateViewDrag();
    },
    updateViewDrag() {
      if (!UI.connected)
        return;
      const viewDragButton = document.getElementById("noVNC_view_drag_button");
      if ((!UI.rfb.clipViewport || !UI.rfb.clippingViewport) && UI.rfb.dragViewport) {
        UI.rfb.dragViewport = false;
      }
      if (UI.rfb.dragViewport) {
        viewDragButton.classList.add("noVNC_selected");
      } else {
        viewDragButton.classList.remove("noVNC_selected");
      }
      if (UI.rfb.clipViewport) {
        viewDragButton.classList.remove("noVNC_hidden");
      } else {
        viewDragButton.classList.add("noVNC_hidden");
      }
      viewDragButton.disabled = !UI.rfb.clippingViewport;
    },
    updateQuality() {
      if (!UI.rfb)
        return;
      UI.rfb.qualityLevel = parseInt(UI.getSetting("quality"));
    },
    updateCompression() {
      if (!UI.rfb)
        return;
      UI.rfb.compressionLevel = parseInt(UI.getSetting("compression"));
    },
    showVirtualKeyboard() {
      if (!isTouchDevice)
        return;
      const input = document.getElementById("noVNC_keyboardinput");
      if (document.activeElement == input)
        return;
      input.focus();
      try {
        const l = input.value.length;
        input.setSelectionRange(l, l);
      } catch (err2) {
      }
    },
    hideVirtualKeyboard() {
      if (!isTouchDevice)
        return;
      const input = document.getElementById("noVNC_keyboardinput");
      if (document.activeElement != input)
        return;
      input.blur();
    },
    toggleVirtualKeyboard() {
      if (document.getElementById("noVNC_keyboard_button").classList.contains("noVNC_selected")) {
        UI.hideVirtualKeyboard();
      } else {
        UI.showVirtualKeyboard();
      }
    },
    onfocusVirtualKeyboard(event) {
      document.getElementById("noVNC_keyboard_button").classList.add("noVNC_selected");
      if (UI.rfb) {
        UI.rfb.focusOnClick = false;
      }
    },
    onblurVirtualKeyboard(event) {
      document.getElementById("noVNC_keyboard_button").classList.remove("noVNC_selected");
      if (UI.rfb) {
        UI.rfb.focusOnClick = true;
      }
    },
    keepVirtualKeyboard(event) {
      const input = document.getElementById("noVNC_keyboardinput");
      if (document.activeElement != input) {
        return;
      }
      if (event.target.form !== void 0) {
        switch (event.target.type) {
          case "text":
          case "email":
          case "search":
          case "password":
          case "tel":
          case "url":
          case "textarea":
          case "select-one":
          case "select-multiple":
            return;
        }
      }
      event.preventDefault();
    },
    keyboardinputReset() {
      const kbi = document.getElementById("noVNC_keyboardinput");
      kbi.value = new Array(UI.defaultKeyboardinputLen).join("_");
      UI.lastKeyboardinput = kbi.value;
    },
    keyEvent(keysym, code, down) {
      if (!UI.rfb)
        return;
      UI.rfb.sendKey(keysym, code, down);
    },
    keyInput(event) {
      if (!UI.rfb)
        return;
      const newValue = event.target.value;
      if (!UI.lastKeyboardinput) {
        UI.keyboardinputReset();
      }
      const oldValue = UI.lastKeyboardinput;
      let newLen;
      try {
        newLen = Math.max(event.target.selectionStart, newValue.length);
      } catch (err2) {
        newLen = newValue.length;
      }
      const oldLen = oldValue.length;
      let inputs = newLen - oldLen;
      let backspaces = inputs < 0 ? -inputs : 0;
      for (let i = 0; i < Math.min(oldLen, newLen); i++) {
        if (newValue.charAt(i) != oldValue.charAt(i)) {
          inputs = newLen - i;
          backspaces = oldLen - i;
          break;
        }
      }
      for (let i = 0; i < backspaces; i++) {
        UI.rfb.sendKey(keysym_default.XK_BackSpace, "Backspace");
      }
      for (let i = newLen - inputs; i < newLen; i++) {
        UI.rfb.sendKey(keysymdef_default.lookup(newValue.charCodeAt(i)));
      }
      if (newLen > 2 * UI.defaultKeyboardinputLen) {
        UI.keyboardinputReset();
      } else if (newLen < 1) {
        UI.keyboardinputReset();
        event.target.blur();
        setTimeout(event.target.focus.bind(event.target), 0);
      } else {
        UI.lastKeyboardinput = newValue;
      }
    },
    openExtraKeys() {
      UI.closeAllPanels();
      UI.openControlbar();
      document.getElementById("noVNC_modifiers").classList.add("noVNC_open");
      document.getElementById("noVNC_toggle_extra_keys_button").classList.add("noVNC_selected");
    },
    closeExtraKeys() {
      document.getElementById("noVNC_modifiers").classList.remove("noVNC_open");
      document.getElementById("noVNC_toggle_extra_keys_button").classList.remove("noVNC_selected");
    },
    toggleExtraKeys() {
      if (document.getElementById("noVNC_modifiers").classList.contains("noVNC_open")) {
        UI.closeExtraKeys();
      } else {
        UI.openExtraKeys();
      }
    },
    sendEsc() {
      UI.sendKey(keysym_default.XK_Escape, "Escape");
    },
    sendTab() {
      UI.sendKey(keysym_default.XK_Tab, "Tab");
    },
    toggleCtrl() {
      const btn = document.getElementById("noVNC_toggle_ctrl_button");
      if (btn.classList.contains("noVNC_selected")) {
        UI.sendKey(keysym_default.XK_Control_L, "ControlLeft", false);
        btn.classList.remove("noVNC_selected");
      } else {
        UI.sendKey(keysym_default.XK_Control_L, "ControlLeft", true);
        btn.classList.add("noVNC_selected");
      }
    },
    toggleWindows() {
      const btn = document.getElementById("noVNC_toggle_windows_button");
      if (btn.classList.contains("noVNC_selected")) {
        UI.sendKey(keysym_default.XK_Super_L, "MetaLeft", false);
        btn.classList.remove("noVNC_selected");
      } else {
        UI.sendKey(keysym_default.XK_Super_L, "MetaLeft", true);
        btn.classList.add("noVNC_selected");
      }
    },
    toggleAlt() {
      const btn = document.getElementById("noVNC_toggle_alt_button");
      if (btn.classList.contains("noVNC_selected")) {
        UI.sendKey(keysym_default.XK_Alt_L, "AltLeft", false);
        btn.classList.remove("noVNC_selected");
      } else {
        UI.sendKey(keysym_default.XK_Alt_L, "AltLeft", true);
        btn.classList.add("noVNC_selected");
      }
    },
    sendCtrlAltDel() {
      UI.rfb.sendCtrlAltDel();
      UI.rfb.focus();
      UI.idleControlbar();
    },
    sendKey(keysym, code, down) {
      UI.rfb.sendKey(keysym, code, down);
      if (document.getElementById("noVNC_keyboard_button").classList.contains("noVNC_selected")) {
        document.getElementById("noVNC_keyboardinput").focus();
      } else {
        UI.rfb.focus();
      }
      UI.idleControlbar();
    },
    togglePVECommandPanel: function() {
      if (document.getElementById("pve_commands").classList.contains("noVNC_open")) {
        UI.closePVECommandPanel();
      } else {
        UI.openPVECommandPanel();
      }
    },
    openPVECommandPanel: function() {
      var me = this;
      UI.closeAllPanels();
      UI.openControlbar();
      document.getElementById("pve_commands").classList.add("noVNC_open");
      document.getElementById("pve_commands_button").classList.add("noVNC_selected");
    },
    closePVECommandPanel: function() {
      document.getElementById("pve_commands").classList.remove("noVNC_open");
      document.getElementById("pve_commands_button").classList.remove("noVNC_selected");
    },
    updateSessionSize: function(e2) {
      var rfb = e2.detail.rfb;
      var width = e2.detail.width;
      var height = e2.detail.height;
      UI.PVE.updateFBSize(rfb, width, height);
      UI.applyResizeMode();
      UI.updateViewClip();
    },
    updateLocalCursor() {
      if (!UI.rfb)
        return;
      UI.rfb.localCursor = UI.getSetting("local_cursor");
    },
    updateViewOnly() {
      if (!UI.rfb)
        return;
      UI.rfb.viewOnly = UI.getSetting("view_only");
      if (UI.rfb.viewOnly) {
        document.getElementById("noVNC_keyboard_button").classList.add("noVNC_hidden");
        document.getElementById("noVNC_toggle_extra_keys_button").classList.add("noVNC_hidden");
        document.getElementById("noVNC_clipboard_button").classList.add("noVNC_hidden");
      } else {
        document.getElementById("noVNC_keyboard_button").classList.remove("noVNC_hidden");
        document.getElementById("noVNC_toggle_extra_keys_button").classList.remove("noVNC_hidden");
        document.getElementById("noVNC_clipboard_button").classList.remove("noVNC_hidden");
      }
    },
    updateShowDotCursor() {
      if (!UI.rfb)
        return;
      UI.rfb.showDotCursor = UI.getSetting("show_dot");
    },
    updateLogging() {
      initLogging2(UI.getSetting("logging"));
    },
    updateDesktopName(e2) {
      UI.desktopName = e2.detail.name;
      document.title = e2.detail.name + " - " + PAGE_TITLE;
    },
    bell(e2) {
      if (getConfigVar("bell", "on") === "on") {
        const promise = document.getElementById("noVNC_bell").play();
        if (promise) {
          promise.catch((e3) => {
            if (e3.name === "NotAllowedError") {
            } else {
              Error2("Unable to play bell: " + e3);
            }
          });
        }
      }
    },
    addOption(selectbox, text, value) {
      const optn = document.createElement("OPTION");
      optn.text = text;
      optn.value = value;
      selectbox.options.add(optn);
    }
  };
  var LINGUAS = ["cs", "de", "el", "es", "fr", "it", "ja", "ko", "nl", "pl", "pt_BR", "ru", "sv", "tr", "zh_CN", "zh_TW"];
  l10n.setup(LINGUAS);
  if (l10n.language === "en" || l10n.dictionary !== void 0) {
    UI.prime();
  } else {
    fetch("/novnc/app/locale/" + l10n.language + ".json").then((response) => {
      if (!response.ok) {
        throw Error("" + response.status + " " + response.statusText);
      }
      return response.json();
    }).then((translations) => {
      l10n.dictionary = translations;
    }).catch((err2) => Error2("Failed to load translations: " + err2)).then(UI.prime);
  }
  var ui_default = UI;
})();
