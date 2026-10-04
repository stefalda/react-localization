import e from "react";
//#region node_modules/localized-strings/lib/LocalizedStrings.es.js
function t() {
	let e = "en-US";
	if (typeof navigator > "u") return e;
	let t = navigator;
	if (t) {
		if (t.language) return t.language;
		if (t.languages && t.languages[0]) return t.languages[0];
		if ("userLanguage" in t) return t.userLanguage;
		if ("browserLanguage" in t) return t.browserLanguage;
	}
	return e;
}
function n(e, t) {
	if (t[e]) return e;
	let n = e.indexOf("-"), r = n >= 0 ? e.substring(0, n) : e;
	return t[r] ? r : Object.keys(t)[0];
}
function r(e) {
	let t = [
		"_interfaceLanguage",
		"_language",
		"_defaultLanguage",
		"_defaultLanguageFirstLevelKeys",
		"_props"
	];
	e.forEach((e) => {
		if (t.indexOf(e) !== -1) throw Error(`${e} cannot be used as a key. It is a reserved word.`);
	});
}
function i(e) {
	let t = "";
	for (let n = 0; n < e; n += 1) t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62));
	return t;
}
var a = /(\{[\d|\w]+\})/, o = /(\$ref\{[\w|.]+\})/, s = class {
	_opts;
	_interfaceLanguage;
	_language;
	_defaultLanguage;
	_defaultLanguageFirstLevelKeys;
	_props;
	_availableLanguages;
	constructor(e, n) {
		typeof n == "function" && (n = { customLanguageInterface: n }), this._opts = {
			customLanguageInterface: t,
			pseudo: !1,
			pseudoMultipleLanguages: !1,
			logsEnabled: !0,
			...n
		}, this._interfaceLanguage = this._opts.customLanguageInterface(), this._language = this._interfaceLanguage, this.setContent(e);
	}
	setContent(e) {
		let [t] = Object.keys(e);
		this._defaultLanguage = t, this._defaultLanguageFirstLevelKeys = [], this._props = e, r(Object.keys(e[this._defaultLanguage])), Object.keys(this._props[this._defaultLanguage]).forEach((e) => {
			typeof this._props[this._defaultLanguage][e] == "string" && this._defaultLanguageFirstLevelKeys.push(e);
		}), this.setLanguage(this._interfaceLanguage), this._opts.pseudo && this._pseudoAllValues(this._props);
	}
	_pseudoAllValues(e) {
		Object.keys(e).forEach((t) => {
			if (typeof e[t] == "object") this._pseudoAllValues(e[t]);
			else if (typeof e[t] == "string") {
				if (e[t].indexOf("[") === 0 && e[t].lastIndexOf("]") === e[t].length - 1) return;
				let n = e[t].split(" ");
				for (let e = 0; e < n.length; e += 1) {
					if (n[e].match(a) || n[e].match(o)) continue;
					let t = n[e].length;
					this._opts.pseudoMultipleLanguages && (t = Math.floor(t * 1.4)), n[e] = i(t);
				}
				e[t] = `[${n.join(" ")}]`;
			}
		});
	}
	setLanguage(e) {
		let t = n(e, this._props), r = Object.keys(this._props)[0];
		if (this._language = t, this._props[t]) {
			for (let e of this._defaultLanguageFirstLevelKeys) delete this[e];
			let e = { ...this._props[this._language] };
			Object.keys(e).forEach((t) => {
				this[t] = e[t];
			}), r !== this._language && (e = this._props[r], this._fallbackValues(e, this));
		}
	}
	_fallbackValues(e, t) {
		Object.keys(e).forEach((n) => {
			Object.prototype.hasOwnProperty.call(e, n) && !t[n] && t[n] !== "" ? (t[n] = e[n], this._opts.logsEnabled && console.log(`🚧 👷 key '${n}' not found in localizedStrings for language ${this._language} 🚧`)) : typeof t[n] != "string" && this._fallbackValues(e[n], t[n]);
		});
	}
	getLanguage() {
		return this._language;
	}
	getInterfaceLanguage() {
		return this._interfaceLanguage;
	}
	getAvailableLanguages() {
		return this._availableLanguages ||= Object.keys(this._props), this._availableLanguages;
	}
	formatString(e, ...t) {
		let n = e || "";
		return typeof n == "string" && (n = this.getString(e, null, !0) || n), n.split(o).filter(Boolean).map((t) => {
			if (t.match(o)) {
				let n = t.slice(5, -1);
				return this.getString(n) || (this._opts.logsEnabled && console.log(`No Localization ref found for '${t}' in string '${e}'`), `$ref(id:${n})`);
			}
			return t;
		}).join("").split(a).filter(Boolean).map((e) => {
			if (e.match(a)) {
				let n = e.slice(1, -1), r = t[n];
				return r === void 0 && t[0] && (r = t[0][n]), r;
			}
			return e;
		}).join("");
	}
	getString(e, t, n = !1) {
		try {
			let n = this._props[t || this._language], r = e.split(".");
			for (let e of r) {
				if (n[e] === void 0) throw Error(e);
				n = n[e];
			}
			return n;
		} catch (r) {
			!n && this._opts.logsEnabled && console.log(`No localization found for key '${e}' and language '${t}', failed on ${r.message}`);
		}
		return null;
	}
	getContent() {
		return this._props;
	}
}, c = /(\{\w+\})/, l = /(\$ref\{[\w|.]+\})/;
s.prototype.formatString = function(t, ...n) {
	let r = (t ? this.getString(t, null, !0) || t : "").split(l).filter((e) => !!e).map((e) => {
		if (e.match(l)) {
			let t = e.slice(5, -1);
			return this.getString(t) || `$ref(id:${t})`;
		}
		return e;
	}).join(""), i = !1, a = r.split(c).filter((e) => !!e).map((t, r) => {
		if (t.match(c)) {
			let a = t.slice(1, -1), o = n[a];
			if (o == null) {
				let e = n[0] ? n[0][a] : void 0;
				if (e !== void 0) o = e;
				else return o;
			}
			return e.isValidElement(o) ? (i = !0, e.Children.toArray(o).map((t) => e.cloneElement(t, { key: r.toString() }))) : o;
		}
		return t;
	});
	return i ? a : a.join("");
};
var u = s;
//#endregion
export { u as default };
