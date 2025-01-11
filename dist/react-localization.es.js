import f from "react";
function h() {
  const i = "en-US";
  if (typeof navigator > "u")
    return i;
  const e = navigator;
  if (e) {
    if (e.language)
      return e.language;
    if (e.languages && e.languages[0])
      return e.languages[0];
    if (e.userLanguage)
      return e.userLanguage;
    if (e.browserLanguage)
      return e.browserLanguage;
  }
  return i;
}
function d(i, e) {
  if (e[i]) return i;
  const t = i.indexOf("-"), a = t >= 0 ? i.substring(0, t) : i;
  return e[a] ? a : Object.keys(e)[0];
}
function _(i) {
  const e = ["_interfaceLanguage", "_language", "_defaultLanguage", "_defaultLanguageFirstLevelKeys", "_props"];
  i.forEach((t) => {
    if (e.indexOf(t) !== -1)
      throw new Error(`${t} cannot be used as a key. It is a reserved word.`);
  });
}
function p(i) {
  let e = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let a = 0; a < i; a += 1) e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
const g = /(\{[\d|\w]+\})/, o = /(\$ref\{[\w|.]+\})/;
class L {
  /**
   * Constructor used to provide the strings objects in various language and the optional callback to get
   * the interface language
   * @param {*} props - the strings object
   * @param {Function} options.customLanguageInterface - the optional method to use to get the InterfaceLanguage
   * @param {Boolean} options.pseudo - convert all strings to pseudo, helpful when implementing
   * @param {Boolean} options.pseudoMultipleLanguages - add 40% to pseudo, helps with translations in the future
   * @param {Boolean} options.logsEnabled - Enable/Disable console.log outputs (default=true)
   */
  constructor(e, t) {
    typeof t == "function" && (t = {
      customLanguageInterface: t
    }), this._opts = Object.assign({}, {
      customLanguageInterface: h,
      pseudo: !1,
      pseudoMultipleLanguages: !1,
      logsEnabled: !0
    }, t), this._interfaceLanguage = this._opts.customLanguageInterface(), this._language = this._interfaceLanguage, this.setContent(e);
  }
  /**
   * Set the strings objects based on the parameter passed in the constructor
   * @param {*} props
   */
  setContent(e) {
    const [t] = Object.keys(e);
    this._defaultLanguage = t, this._defaultLanguageFirstLevelKeys = [], this._props = e, _(Object.keys(e[this._defaultLanguage])), Object.keys(this._props[this._defaultLanguage]).forEach((a) => {
      typeof this._props[this._defaultLanguage][a] == "string" && this._defaultLanguageFirstLevelKeys.push(a);
    }), this.setLanguage(this._interfaceLanguage), this._opts.pseudo && this._pseudoAllValues(this._props);
  }
  /**
   * Replace all strings to pseudo value
   * @param {Object} obj - Loopable object
   */
  _pseudoAllValues(e) {
    Object.keys(e).forEach((t) => {
      if (typeof e[t] == "object")
        this._pseudoAllValues(e[t]);
      else if (typeof e[t] == "string") {
        if (e[t].indexOf("[") === 0 && e[t].lastIndexOf("]") === e[t].length - 1)
          return;
        const a = e[t].split(" ");
        for (let s = 0; s < a.length; s += 1)
          if (!a[s].match(g)) {
            if (!a[s].match(o)) {
              let n = a[s].length;
              this._opts.pseudoMultipleLanguages && (n = parseInt(n * 1.4, 10)), a[s] = p(n);
            }
          }
        e[t] = `[${a.join(" ")}]`;
      }
    });
  }
  /**
   * Can be used from ouside the class to force a particular language
   * indipendently from the interface one
   * @param {*} language
   */
  setLanguage(e) {
    const t = d(e, this._props), a = Object.keys(this._props)[0];
    if (this._language = t, this._props[t]) {
      for (let n = 0; n < this._defaultLanguageFirstLevelKeys.length; n += 1)
        delete this[this._defaultLanguageFirstLevelKeys[n]];
      let s = Object.assign({}, this._props[this._language]);
      Object.keys(s).forEach((n) => {
        this[n] = s[n];
      }), a !== this._language && (s = this._props[a], this._fallbackValues(s, this));
    }
  }
  /**
   * Load fallback values for missing translations
   * @param {*} defaultStrings
   * @param {*} strings
   */
  _fallbackValues(e, t) {
    Object.keys(e).forEach((a) => {
      Object.prototype.hasOwnProperty.call(e, a) && !t[a] && t[a] !== "" ? (t[a] = e[a], this._opts.logsEnabled && console.log(`🚧 👷 key '${a}' not found in localizedStrings for language ${this._language} 🚧`)) : typeof t[a] != "string" && this._fallbackValues(e[a], t[a]);
    });
  }
  /**
   * The current language displayed (could differ from the interface language
   * if it has been forced manually and a matching translation has been found)
   */
  getLanguage() {
    return this._language;
  }
  /**
   * The current interface language (could differ from the language displayed)
   */
  getInterfaceLanguage() {
    return this._interfaceLanguage;
  }
  /**
   * Return an array containing the available languages passed as props in the constructor
   */
  getAvailableLanguages() {
    return this._availableLanguages || (this._availableLanguages = [], Object.keys(this._props).forEach((e) => {
      this._availableLanguages.push(e);
    })), this._availableLanguages;
  }
  // Format the passed string replacing the numbered or tokenized placeholders
  // eg. 1: I'd like some {0} and {1}, or just {0}
  // eg. 2: I'd like some {bread} and {butter}, or just {bread}
  // eg. 3: I'd like some $ref{bread} and $ref{butter}, or just $ref{bread}
  // Use example:
  // eg. 1: strings.formatString(strings.question, strings.bread, strings.butter)
  // eg. 2: strings.formatString(strings.question, { bread: strings.bread, butter: strings.butter })
  // eg. 3: strings.formatString(strings.question)
  formatString(e, ...t) {
    let a = e || "";
    return typeof a == "string" && (a = this.getString(e, null, !0) || a), a.split(o).filter((n) => !!n).map((n) => {
      if (n.match(o)) {
        const l = n.slice(5, -1), r = this.getString(l);
        return r || (this._opts.logsEnabled && console.log(`No Localization ref found for '${n}' in string '${e}'`), `$ref(id:${l})`);
      }
      return n;
    }).join("").split(g).filter((n) => !!n).map((n) => {
      if (n.match(g)) {
        const l = n.slice(1, -1);
        let r = t[l];
        if (r === void 0) {
          const u = t[0][l];
          if (u !== void 0)
            r = u;
          else
            return r;
        }
        return r;
      }
      return n;
    }).join("");
  }
  // Return a string with the passed key in a different language or defalt if not set
  // We allow deep . notation for finding strings
  getString(e, t, a = !1) {
    try {
      let s = this._props[t || this._language];
      const n = e.split(".");
      for (let l = 0; l < n.length; l += 1) {
        if (s[n[l]] === void 0)
          throw Error(n[l]);
        s = s[n[l]];
      }
      return s;
    } catch (s) {
      !a && this._opts.logsEnabled && console.log(`No localization found for key '${e}' and language '${t}', failed on ${s.message}`);
    }
    return null;
  }
  /**
   * The current props (locale object)
   */
  getContent() {
    return this._props;
  }
}
const c = /(\{[\d|\w]+\})/;
L.prototype.formatString = (i, ...e) => {
  let t = !1;
  const a = (i || "").split(c).filter((s) => !!s).map((s, n) => {
    if (s.match(c)) {
      const l = s.slice(1, -1);
      let r = e[l];
      if (r == null) {
        const u = e[0] ? e[0][l] : void 0;
        if (u !== void 0)
          r = u;
        else
          return r;
      }
      return f.isValidElement(r) ? (t = !0, f.Children.toArray(r).map((u) => ({ ...u, key: n.toString() }))) : r;
    }
    return s;
  });
  return t ? a : a.join("");
};
export {
  L as default
};
