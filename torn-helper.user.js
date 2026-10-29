// ==UserScript==
// @name         Torn-Helper
// @namespace    torn-hedef-araci
// @version      1.4.0
// @description  Torn için hedef listesi, Ranked War, faction yönetimi ve yurtdışı fiyat karşılaştırma paneli
// @homepageURL  https://github.com/DgkYY/Torn-Helper
// @supportURL   https://github.com/DgkYY/Torn-Helper/issues
// @updateURL    https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/DgkYY/Torn-Helper/main/torn-helper.user.js
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_listValues
// @grant        GM_deleteValue
// @noframes
// @connect      api.torn.com
// @connect      ffscouter.com
// @connect      api.prombot.co.uk
// @connect      yata.yt
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;
  if (document.getElementById('torn-hedef-araci')) return;

  var CSS = "\n/* D\u00fczen: tek s\u00fctun ara\u00e7 sayfas\u0131. \u00dcstte Torn ba\u011flant\u0131s\u0131, sonra ekleme formu, alt\u0131nda \u00e7er\u00e7eveli sat\u0131r listesi; her sat\u0131r\u0131n sa\u011f\u0131nda b\u00fcy\u00fck Sald\u0131r d\u00fc\u011fmesi. */\n:host {\n  color-scheme: light;\n  --bg: #e9edf2;\n  --surface: #f6f8fa;\n  --fg: #1a2230;\n  --muted: #566274;\n  --line: #ccd4de;\n  --accent: #b3261e;\n  --accent-fg: #ffffff;\n  --chip: #dbe2ea;\n  --ok-bg: #d2ead8;\n  --ok-fg: #17592b;\n  --warn-bg: #f3e2bd;\n  --warn-fg: #6b4a05;\n  --focus: #2457b3;\n  --font-display: \"Barlow Condensed\", \"Arial Narrow\", \"Helvetica Neue\", Arial, sans-serif;\n  --font-body: \"IBM Plex Sans\", system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  --font-mono: \"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace;\n}\n@media (prefers-color-scheme: dark) {\n  :host {\n    color-scheme: dark;\n    --bg: #12171e;\n    --surface: #1a212b;\n    --fg: #e3e8ef;\n    --muted: #97a3b3;\n    --line: #2d3744;\n    --accent: #c93a31;\n    --chip: #263040;\n    --ok-bg: #1d3a29;\n    --ok-fg: #8fd4a4;\n    --warn-bg: #43361a;\n    --warn-fg: #e5c06f;\n    --focus: #86abea;\n  }\n}\n* { box-sizing: border-box; }\n.shell {\n  position: fixed; inset: 0; z-index: 2147483000; overflow: auto; margin: 0;\n  background: var(--bg);\n  color: var(--fg);\n  font-family: var(--font-body);\n  font-size: 15px;\n  line-height: 1.45;\n  padding-block: max(24px, env(safe-area-inset-top, 0px)) max(40px, env(safe-area-inset-bottom, 0px));\n  padding-left: max(16px, env(safe-area-inset-left, 0px));\n  padding-right: max(16px, env(safe-area-inset-right, 0px));\n}\n[hidden] { display: none !important; }\n.app { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }\nbutton, input, textarea, select { font: inherit; color: inherit; }\n:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }\n\n.top { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 6px 24px; }\n.eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }\nh1 { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: 40px; line-height: 1.05; letter-spacing: 0.01em; text-wrap: balance; }\n.stats { margin: 0; display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 13px; color: var(--muted); }\n.stats div { display: flex; gap: 6px; align-items: baseline; }\n.stats dt { order: 2; }\n.stats dd { margin: 0; order: 1; font-family: var(--font-mono); font-size: 15px; font-weight: 500; color: var(--fg); font-variant-numeric: tabular-nums; }\n\n.panel { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px; }\n.panel h2 { margin: 0 0 10px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600; }\n.row-form { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }\n.field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }\n.field span { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }\n.field.f-key { flex: 1 1 240px; }\n.field.f-id { flex: 0 1 150px; }\n.field.f-name { flex: 1 1 160px; }\n.field.f-note { flex: 2 1 200px; }\ninput[type=\"text\"], input[type=\"password\"], input[type=\"search\"], select, textarea {\n  width: 100%;\n  min-height: 42px;\n  padding: 8px 10px;\n  background: var(--bg);\n  border: 1px solid var(--line);\n  border-radius: 6px;\n}\ninput::placeholder, textarea::placeholder { color: var(--muted); opacity: 0.8; }\n.mono { font-family: var(--font-mono); font-size: 14px; }\n.msg { margin: 8px 0 0; min-height: 1.4em; font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }\n.msg.err { color: var(--accent); }\n.hint { margin: 6px 0 0; font-size: 13px; color: var(--muted); max-width: 72ch; }\n.hint a { color: var(--fg); }\n\n.btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n  min-height: 42px; padding: 8px 16px;\n  background: var(--surface); color: var(--fg);\n  border: 1px solid var(--line); border-radius: 6px;\n  font-weight: 600; text-decoration: none; cursor: pointer;\n}\n.btn:hover { border-color: var(--muted); }\n.btn:disabled { opacity: 0.55; cursor: default; }\n.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }\n.btn.primary:hover { filter: brightness(1.08); }\n\n.tools { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }\n.tools .field.f-search { flex: 1 1 200px; }\n.tools .field.f-sort { flex: 0 1 220px; }\n.tools .btn { flex: 0 0 auto; }\n.check { display: inline-flex; align-items: center; gap: 8px; min-height: 42px; font-size: 14px; cursor: pointer; }\n.check input { width: 18px; height: 18px; margin: 0; }\n\n.list { list-style: none; margin: 0; padding: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }\n.row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-areas: \"who atk\" \"meta atk\" \"acts atk\";\n  column-gap: 14px; row-gap: 4px;\n  align-items: center;\n  padding: 12px 14px;\n}\n.row + .row { border-top: 1px solid var(--line); }\n.who { grid-area: who; display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; min-width: 0; }\n.name { font-weight: 600; font-size: 17px; overflow-wrap: anywhere; }\n.name.empty { font-weight: 400; font-style: italic; color: var(--muted); }\n.uid { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }\n.chip { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background: var(--chip); border-radius: 4px; padding: 1px 7px; align-self: center; }\n.chip.ok { background: var(--ok-bg); color: var(--ok-fg); }\n.chip.warn { background: var(--warn-bg); color: var(--warn-fg); }\n.is-today .name { color: var(--muted); }\n.meta { grid-area: meta; display: flex; flex-wrap: wrap; gap: 0 12px; font-size: 13px; color: var(--muted); min-width: 0; }\n.meta .note { color: var(--fg); overflow-wrap: anywhere; }\n.acts { grid-area: acts; display: flex; flex-wrap: wrap; gap: 0 14px; }\n.atk {\n  grid-area: atk;\n  display: inline-flex; align-items: center; justify-content: center;\n  min-width: 108px; min-height: 52px; padding: 0 18px;\n  background: var(--accent); color: var(--accent-fg);\n  border-radius: 6px;\n  font-family: var(--font-display); font-weight: 700; font-size: 24px; letter-spacing: 0.06em; text-transform: uppercase;\n  text-decoration: none;\n}\n.atk:hover { filter: brightness(1.1); }\n.atk:active { transform: translateY(1px); }\n.link { background: none; border: 0; padding: 6px 0; min-height: 32px; color: var(--muted); font-size: 13px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }\n.link:hover { color: var(--fg); }\n.link.danger.armed { color: var(--accent); font-weight: 600; }\n\n.row.editing { grid-template-columns: minmax(0, 1fr); grid-template-areas: \"edit\" \"acts\"; }\n.edit-grid { grid-area: edit; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }\n.edit-grid label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); min-width: 0; }\n.edit-grid input { text-transform: none; letter-spacing: 0; color: var(--fg); font-size: 15px; }\n\n.empty { background: var(--surface); border: 1px dashed var(--line); border-radius: 8px; padding: 22px 18px; }\n.empty h2 { margin: 0 0 6px; font-family: var(--font-display); font-size: 24px; font-weight: 700; letter-spacing: 0; text-transform: none; color: var(--fg); }\n.empty p { margin: 0 0 6px; max-width: 62ch; color: var(--muted); }\n.empty code { font-family: var(--font-mono); font-size: 13px; color: var(--fg); }\n\ndetails.panel { padding: 0; }\ndetails.panel > summary { cursor: pointer; padding: 12px 14px; font-weight: 600; list-style-position: inside; }\ndetails.panel .inner { padding: 0 14px 14px; display: flex; flex-direction: column; gap: 10px; }\ndetails.panel .inner p { margin: 0; font-size: 13px; color: var(--muted); max-width: 70ch; }\ntextarea { min-height: 120px; resize: vertical; line-height: 1.5; }\n.btn-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }\n.btn-row .msg { margin: 0; }\n\n.status { margin: 0; font-size: 12px; color: var(--muted); }\n.status.err { color: var(--accent); }\n\n.mystats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px 16px; flex: 1 1 320px; font-size: 13px; color: var(--muted); }\n.mystats b { display: block; font-family: var(--font-mono); font-weight: 500; font-size: 15px; color: var(--fg); font-variant-numeric: tabular-nums; }\n.field.f-total { flex: 0 1 180px; }\n.field.f-num { flex: 0 1 96px; }\n.field.f-sel { flex: 1 1 200px; }\n.atk.add { background: var(--chip); color: var(--fg); border: 0; cursor: pointer; font-size: 20px; }\n.atk.add[aria-disabled=\"true\"] { opacity: 0.6; cursor: default; }\n.found { margin-top: 4px; }\n.view { display: flex; flex-direction: column; gap: 18px; }\n.backrow { display: flex; }\n.modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }\n.mode { text-align: left; display: flex; flex-direction: column; gap: 8px; padding: 18px; min-height: 130px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; cursor: pointer; }\n.mode:hover { border-color: var(--accent); }\n.mode-t { font-family: var(--font-display); font-weight: 700; font-size: 30px; line-height: 1.1; letter-spacing: 0.01em; }\n.mode-d { color: var(--muted); font-size: 14px; max-width: 46ch; }\n.mode .tag { align-self: flex-start; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background: var(--chip); border-radius: 4px; padding: 1px 7px; }\n.shell[data-mode=\"war\"] .h-only, .shell[data-mode=\"fac\"] .h-only, body[data-mode=\"trv\"] .h-only { display: none; }\n.topbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.langsw { display: flex; gap: 4px; }\n.langsw .btn { padding: 4px 12px; min-height: 0; font-size: 13px; }\n.btn.on { background: var(--accent); color: var(--accent-fg); border-color: transparent; }\ndetails#halo > summary { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: 0.04em; text-transform: uppercase; }\n.tabs { display: flex; gap: 6px; flex-wrap: wrap; }\n.tabs .btn.on { background: var(--accent); color: var(--accent-fg); border-color: transparent; }\n.fpane { display: flex; flex-direction: column; gap: 16px; }\n.frow { display: flex; flex-wrap: wrap; gap: 4px 14px; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--line); }\n.frow .nm { font-weight: 600; min-width: 140px; }\n.frow .dim { color: var(--muted); font-size: 13px; }\n.fcard { border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }\n.fcard h3 { margin: 0; padding: 10px 12px; font-size: 15px; border-bottom: 1px solid var(--line); }\n.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }\n.big { font-family: var(--font-mono, monospace); font-size: 20px; font-weight: 700; }\n.payrow { display: grid; grid-template-columns: minmax(0,1fr) 90px 120px auto; gap: 8px 12px; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--line); }\n.payrow input[type=text] { width: 100%; }\n.payrow .amt { text-align: right; font-weight: 600; }\n.payrow.done { opacity: 0.55; }\n.payrow .acts { display: flex; gap: 10px; flex-wrap: wrap; }\n@media (max-width: 640px) { .payrow { grid-template-columns: 1fr 80px 100px; } .payrow .acts { grid-column: 1 / -1; } }\n.row.off { opacity: 0.62; }\n.selbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }\n.selbar .cnt { font-weight: 600; }\n.selbar .btn.armed { background: var(--danger, #b3261e); color: #fff; border-color: transparent; }\n.selbox { width: 20px; height: 20px; margin: 0 8px 0 0; flex: none; }\n.who .selbox { vertical-align: middle; }\n.statsrow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; }\n.btn.small { min-height: 32px; padding: 4px 12px; font-size: 13px; }\n.qcard { display: flex; flex-direction: column; gap: 8px; }\n.qcard .who { gap: 2px 10px; }\n.qcard .name { font-size: 22px; }\n.qbtns { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }\n.qbtns .atk { min-height: 64px; min-width: 180px; font-size: 32px; }\n.qbtns .btn { min-height: 64px; }\n.qnext { font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }\n.qmeta { font-size: 13px; color: var(--muted); }\n.qhead { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }\n.qhead h2 { margin: 0 0 10px; }\n.qenergy { font-family: var(--font-mono); font-size: 12px; background: var(--chip); border-radius: 4px; padding: 2px 8px; white-space: nowrap; font-variant-numeric: tabular-nums; }\n.qenergy.low { background: var(--warn-bg); color: var(--warn-fg); }\n@media (max-width: 480px) {\n  h1 { font-size: 34px; }\n  .atk { min-width: 92px; padding: 0 12px; font-size: 22px; }\n  .row { padding: 12px; }\n}\n@media (prefers-reduced-motion: reduce) { .atk:active { transform: none; } }\n.foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 10px; border-top: 1px solid var(--line); }\n.foot .dim { color: var(--muted); font-size: 12px; }\n.us-only { display: none !important; }\n\n.x-open { position: fixed; left: 10px; bottom: 70px; z-index: 2147482999; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); font-family: var(--font-body); font-size: 13px; font-weight: 600; cursor: pointer; opacity: 0.92; }\n.x-open:hover { border-color: var(--accent); opacity: 1; }\n.shell:not(.wide) { left: auto; width: min(680px, 100vw); border-left: 1px solid var(--line); box-shadow: -10px 0 32px rgba(0,0,0,0.35); }\n.topbar { max-width: 860px; margin: 0 auto 12px; }\n.tb-extra { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }\n.tb-extra .btn { padding: 4px 12px; min-height: 0; font-size: 13px; }\n.us-only { display: inline-flex !important; }\n.mini { position: fixed; top: 8px; right: 8px; z-index: 2147483001; width: min(350px, calc(100vw - 16px)); background: var(--surface); color: var(--fg); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); font-family: var(--font-body); font-size: 13px; line-height: 1.4; }\n.mini.left { right: auto; left: 8px; }\n.mini-h { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 6px 8px; border-bottom: 1px solid var(--line); }\n.mini-btns { margin-left: auto; white-space: nowrap; }\n.mini .qbtns .atk { font-size: 18px; padding: 8px 18px; min-height: 42px; }\n.mini .qenergy { font-size: 11px; }\n.tips { position: fixed; right: 8px; bottom: 8px; z-index: 2147483001; width: min(390px, calc(100vw - 16px)); background: var(--surface); color: var(--fg); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); font-family: var(--font-body); font-size: 13px; line-height: 1.4; }\n.tips-sort { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }\n.tips-sort .btn { padding: 2px 10px; min-height: 0; font-size: 12px; }\n.tips-sort .dim { margin-left: auto; color: var(--muted); }\n.tip { padding: 6px 0; border-top: 1px solid var(--line); }\n.tip1 b { font-size: 14px; }\n.tip2 { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 12px; }\n.tip .dim { color: var(--muted); }\n.mini-title { font-weight: 700; flex: 1; }\n.mini-btns { display: flex; gap: 4px; }\n.mini-btns button { padding: 2px 8px; min-height: 0; font-size: 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--fg); cursor: pointer; }\n.mini-b { padding: 8px 10px; }\n.mini .name { font-weight: 700; font-size: 16px; }\n.mini .qcard { border: 0; padding: 0; background: none; }\n\n";
  var HTML = "<div class=\"app\">\n  <div class=\"topbar\" id=\"topbar\">\n    <div class=\"langsw\" role=\"group\" aria-label=\"Dil\">\n      <button type=\"button\" class=\"btn\" data-lang=\"tr\">TR</button>\n      <button type=\"button\" class=\"btn\" data-lang=\"en\">EN</button>\n    </div>\n    <span class=\"tb-extra\"><button type=\"button\" class=\"btn\" id=\"x-mini\" data-mini=\"auto\" title=\"Mini pencere\">Mini pencere</button> <button type=\"button\" class=\"btn\" id=\"x-wide\" title=\"Geni\u015f\">Geni\u015f</button> <button type=\"button\" class=\"btn\" id=\"x-close\">Kapat &times;</button></span>\n  </div>\n  <div class=\"view\" id=\"view-home\" hidden>\n    <header class=\"top\">\n      <div>\n        <p class=\"eyebrow\">Torn City</p>\n        <h1>Torn-Helper</h1>\n      </div>\n    </header>\n    <div class=\"modes\">\n      <button type=\"button\" class=\"mode\" data-go=\"halloween\">\n        <span class=\"mode-t\">Halloween / Mug modu</span>\n        <span class=\"mode-d\">Hedef listesi, s\u0131ra modu, tatl\u0131 sayac\u0131, mug takibi, kolay hedef bulucu ve networth etiketleri.</span>\n      </button>\n      <button type=\"button\" class=\"mode\" data-go=\"war\">\n        <span class=\"mode-t\">Ranked War modu</span>\n        <span class=\"mode-d\">Rakip faction \u00fcyelerini \u00e7eker, hastane s\u00fcresini canl\u0131 izler, FF'ye g\u00f6re s\u0131ralar ve s\u0131radaki hedefi verir.</span>\n        <span class=\"tag\">Yeni, ilk s\u00fcr\u00fcm</span>\n      </button>\n      <button type=\"button\" class=\"mode\" data-go=\"fac\">\n        <span class=\"mode-t\">Faction y\u00f6netimi</span>\n        <span class=\"mode-d\">War vuru\u015flar\u0131na g\u00f6re payout hesapla, \u00f6denenleri i\u015faretle, her \u00fcye i\u00e7in \u00f6deme sayfas\u0131n\u0131 a\u00e7.</span>\n        <span class=\"tag\">Yeni, ilk s\u00fcr\u00fcm</span>\n      </button>\n      <button type=\"button\" class=\"mode\" data-go=\"trv\">\n        <span class=\"mode-t\">Yurtd\u0131\u015f\u0131 fiyatlar\u0131</span>\n        <span class=\"mode-d\">Yurtd\u0131\u015f\u0131 ma\u011faza stoklar\u0131n\u0131 Torn piyasa de\u011feriyle kar\u015f\u0131la\u015ft\u0131r\u0131r, u\u00e7u\u015f ba\u015f\u0131na ve saat ba\u015f\u0131na k\u00e2r\u0131 hesaplar.</span>\n        <span class=\"tag\">Yeni, ilk s\u00fcr\u00fcm</span>\n      </button>\n    </div>\n    <label class=\"check\"><input type=\"checkbox\" id=\"mode-remember\"> Sonraki a\u00e7\u0131l\u0131\u015fta son kulland\u0131\u011f\u0131m modla ba\u015fla</label>\n    <div id=\"key-host-home\" class=\"keyhost\"></div>\n  </div>\n\n  <div class=\"view\" id=\"view-war\" hidden>\n    <div class=\"backrow\"><button type=\"button\" class=\"link\" data-go=\"home\">&larr; Modlar</button></div>\n    <header class=\"top\">\n      <div>\n        <p class=\"eyebrow\">Torn City</p>\n        <h1>Ranked War</h1>\n      </div>\n      <dl class=\"stats\" aria-label=\"\u00d6zet\">\n        <div><dt>\u00fcye</dt><dd id=\"w-total\">0</dd></div>\n        <div><dt>sald\u0131r\u0131ya haz\u0131r</dt><dd id=\"w-ready\">0</dd></div>\n        <div><dt>hastanede</dt><dd id=\"w-hosp\">0</dd></div>\n      </dl>\n    </header>\n\n    <section class=\"panel\" aria-label=\"Rakip faction\">\n      <h2>Rakip faction</h2>\n      <div class=\"row-form\">\n        <label class=\"field\" style=\"flex:1 1 240px\"><span>Faction ID veya profil linki</span><input id=\"w-fid\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"\u00f6r. 12345\"></label>\n        <button type=\"button\" class=\"btn primary\" id=\"w-load\">\u00dcyeleri \u00e7ek</button>\n        <label class=\"check\"><input type=\"checkbox\" id=\"w-auto\" checked> Otomatik yenile (20 sn)</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"w-keys\"> Klavye: Enter sald\u0131r\u0131r, S atlar</label>\n      </div>\n      <p id=\"w-msg\" class=\"msg\" role=\"status\"></p>\n      <p class=\"hint\" style=\"margin-top:0\">Faction ID'si, faction profil sayfas\u0131n\u0131n adresinde ID= ile ba\u015flayan say\u0131d\u0131r. \u00dcye listesi tek istekle gelir, bu y\u00fczden durumlar s\u0131k yenilenebilir. Sald\u0131r\u0131 sayac\u0131 yaln\u0131zca bu sayfadan bas\u0131lan Sald\u0131r d\u00fc\u011fmelerini sayar.</p>\n    </section>\n\n    <div id=\"key-host-war\" class=\"keyhost\"></div>\n\n    <section class=\"panel\" id=\"w-queue\" aria-label=\"S\u0131radaki hedef\">\n      <div class=\"qhead\"><h2>S\u0131radaki hedef</h2><span id=\"w-energy\" class=\"qenergy\" hidden></span></div>\n      <div id=\"w-card\"></div>\n      <div class=\"row-form\" style=\"margin-top:12px\">\n        <button type=\"button\" class=\"btn us-only\" data-mini=\"war\">Mini pencereye ge\u00e7</button>\n        <label class=\"check us-only\"><input type=\"checkbox\" class=\"opt-same\" checked> Sald\u0131r\u0131y\u0131 ayn\u0131 sekmede a\u00e7 ve mini pencereye ge\u00e7</label>\n      </div>\n      <p id=\"w-info\" class=\"hint\"></p>\n    </section>\n\n    <section class=\"tools\" aria-label=\"S\u00fczge\u00e7ler\">\n      <label class=\"field f-num\"><span>Min FF</span><input id=\"w-ffmin\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" value=\"2\"></label>\n      <label class=\"field f-num\"><span>Maks FF</span><input id=\"w-ffmax\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" value=\"3\"></label>\n      <label class=\"field f-sort\"><span>S\u0131ralama</span>\n        <select id=\"w-sort\">\n          <option value=\"ffdesc\">FF y\u00fcksek \u00f6nce (daha \u00e7ok respect)</option>\n          <option value=\"ffasc\">FF d\u00fc\u015f\u00fck \u00f6nce (daha kolay)</option>\n          <option value=\"hosp\">Hastaneden \u00e7\u0131k\u0131\u015f\u0131 yak\u0131n \u00f6nce</option>\n          <option value=\"level\">Seviye (y\u00fcksek \u00f6nce)</option>\n          <option value=\"name\">\u0130sme g\u00f6re</option>\n        </select>\n      </label>\n      <label class=\"field f-num\" style=\"flex:0 1 130px\"><span>Ayn\u0131 hedefe ara (sn)</span><input id=\"w-gap\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"30\"></label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"w-okay\" checked> Sadece sald\u0131r\u0131labilir</label>\n    </section>\n\n    <p id=\"w-count\" class=\"status\"></p>\n    <ul id=\"w-list\" class=\"list\" hidden></ul>\n    <div id=\"w-empty\" class=\"empty\">\n      <h2>Rakip faction y\u00fcklenmedi</h2>\n      <p>Yukar\u0131ya rakip faction'\u0131n ID'sini yaz\u0131p \"\u00dcyeleri \u00e7ek\"e bas. Torn API anahtar\u0131n\u0131 a\u015fa\u011f\u0131daki b\u00f6l\u00fcmden kaydetmen gerekir.</p>\n      <p>FF de\u011ferleri i\u00e7in FF Scouter anahtar\u0131 da gerekir. Yoksa liste FF olmadan gelir.</p>\n    </div>\n\n    <section class=\"panel\" aria-label=\"Sava\u015f sayac\u0131\">\n      <h2>Sava\u015f sayac\u0131</h2>\n      <div class=\"row-form\">\n        <div class=\"mystats\" id=\"w-stats\"></div>\n        <button type=\"button\" class=\"btn\" id=\"w-reset\">Sayac\u0131 s\u0131f\u0131rla</button>\n      </div>\n    </section>\n  </div>\n\n  <div class=\"view\" id=\"view-trv\" hidden>\n    <div class=\"backrow\"><button type=\"button\" class=\"link\" data-go=\"home\">&larr; Modlar</button></div>\n    <header class=\"top\">\n      <div><p class=\"eyebrow\">Torn City</p><h1>Yurtd\u0131\u015f\u0131 fiyatlar\u0131</h1></div>\n      <dl class=\"stats\" aria-label=\"\u00d6zet\">\n        <div><dt>\u00fcr\u00fcn</dt><dd id=\"t-n\">0</dd></div>\n        <div><dt>k\u00e2rl\u0131</dt><dd id=\"t-pos\">0</dd></div>\n        <div><dt>en iyi k\u00e2r/saat</dt><dd id=\"t-best\">-</dd></div>\n      </dl>\n    </header>\n    <div id=\"key-host-trv\" class=\"keyhost\"></div>\n    <section class=\"panel\" aria-label=\"Ayarlar\">\n      <h2>Hesap ayarlar\u0131</h2>\n      <div class=\"row-form\">\n        <label class=\"field f-num\"><span>Ta\u015f\u0131ma kapasitesi</span><input id=\"t-cap\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"15\"></label>\n        <label class=\"field f-num\"><span>U\u00e7u\u015f t\u00fcr\u00fc</span>\n          <select id=\"t-fly\">\n            <option value=\"1\">Standart</option>\n            <option value=\"0.7\">Airstrip (yakla\u015f\u0131k -30%)</option>\n            <option value=\"0.5\">WLT (yakla\u015f\u0131k -50%)</option>\n            <option value=\"0.3\">Business (yakla\u015f\u0131k -70%)</option>\n          </select>\n        </label>\n        <label class=\"field f-num\"><span>Sat\u0131\u015f kesintisi %</span><input id=\"t-fee\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" value=\"0\"></label>\n        <label class=\"field f-num\"><span>\u00dclke</span><select id=\"t-country\"><option value=\"\">Hepsi</option></select></label>\n        <label class=\"field f-sort\"><span>S\u0131ralama</span>\n          <select id=\"t-sort\">\n            <option value=\"hour\">K\u00e2r / saat</option>\n            <option value=\"trip\">K\u00e2r / u\u00e7u\u015f</option>\n            <option value=\"unit\">Adet ba\u015f\u0131na k\u00e2r</option>\n            <option value=\"qty\">Stok</option>\n          </select>\n        </label>\n      </div>\n      <div class=\"row-form\">\n        <label class=\"check\"><input type=\"checkbox\" id=\"t-onlypos\" checked> Sadece k\u00e2rl\u0131lar</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"t-instock\" checked> Sadece stokta olanlar</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"t-auto\"> Otomatik yenile (60 sn)</label>\n        <label class=\"check us-only\"><input type=\"checkbox\" class=\"opt-tips\" checked> U\u00e7u\u015f sayfas\u0131nda \u00f6nerileri otomatik a\u00e7</label>\n        <button type=\"button\" class=\"btn primary\" id=\"t-load\">Verileri \u00e7ek</button>\n      </div>\n      <p id=\"t-msg\" class=\"msg\" role=\"status\"></p>\n      <p class=\"hint\" style=\"margin-top:0\">Stok ve al\u0131\u015f fiyatlar\u0131 herkese a\u00e7\u0131k topluluk servislerinden (Prombot, yedek olarak YATA) gelir. Torn taraf\u0131ndaki de\u011fer, Torn'un verdi\u011fi ortalama piyasa de\u011feridir. Pazardaki ger\u00e7ek en ucuz ilan farkl\u0131 olabilir. U\u00e7u\u015f s\u00fcreleri standart de\u011ferlerdir, kapasiteni ve u\u00e7u\u015f t\u00fcr\u00fcn\u00fc kendin gir.</p>\n    </section>\n    <p id=\"t-count\" class=\"status\"></p>\n    <div id=\"t-list\" class=\"fcard\" hidden></div>\n  </div>\n\n  <div class=\"view\" id=\"view-fac\" hidden>\n    <div class=\"backrow\"><button type=\"button\" class=\"link\" data-go=\"home\">&larr; Modlar</button></div>\n    <header class=\"top\">\n      <div><p class=\"eyebrow\">Torn City</p><h1>Faction y\u00f6netimi</h1></div>\n      <dl class=\"stats\" aria-label=\"\u00d6zet\">\n        <div><dt>\u00fcye</dt><dd id=\"f-n\">0</dd></div>\n        <div><dt>toplam vuru\u015f</dt><dd id=\"f-hits\">0</dd></div>\n        <div><dt>kalan \u00f6deme</dt><dd id=\"f-left\">$0</dd></div>\n      </dl>\n    </header>\n    <div id=\"key-host-fac\" class=\"keyhost\"></div>\n    <div class=\"tabs\" role=\"tablist\" id=\"f-tabs\">\n      <button type=\"button\" class=\"btn on\" data-ftab=\"war\">War payout</button>\n      <button type=\"button\" class=\"btn\" data-ftab=\"mem\">\u00dcyeler</button>\n      <button type=\"button\" class=\"btn\" data-ftab=\"oc\">OC takibi</button>\n      <button type=\"button\" class=\"btn\" data-ftab=\"me\">Cooldown ve barlar</button>\n      <button type=\"button\" class=\"btn\" data-ftab=\"bak\">Yedek</button>\n    </div>\n    <div class=\"fpane\" data-pane=\"war\">\n\n    <section class=\"panel\" aria-label=\"War vuru\u015flar\u0131\">\n      <h2>War payout</h2>\n      <div class=\"row-form\">\n        <label class=\"field\" style=\"flex:1 1 150px\"><span>Faction ID (bo\u015fsa kendin)</span><input id=\"f-fid\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"otomatik\"></label>\n        <label class=\"field\" style=\"flex:1 1 150px\"><span>War ID / rapor ID</span><input id=\"f-war\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"\u00f6r. 12345\"></label>\n        <button type=\"button\" class=\"btn primary\" id=\"f-load\">Vuru\u015flar\u0131 \u00e7ek</button>\n      </div>\n      <p id=\"f-msg\" class=\"msg\" role=\"status\"></p>\n      <details>\n        <summary>API \u00e7al\u0131\u015fmazsa elle yap\u0131\u015ft\u0131r</summary>\n        <p class=\"hint\">Her sat\u0131ra bir \u00fcye: <code>ID \u0130sim vuru\u015f</code> ya da <code>\u0130sim vuru\u015f</code>. Sat\u0131rlar mevcut listeye eklenir.</p>\n        <textarea id=\"f-paste\" rows=\"5\" class=\"mono\" style=\"width:100%\"></textarea>\n        <button type=\"button\" class=\"btn\" id=\"f-paste-go\">Listeye ekle</button>\n      </details>\n    </section>\n\n    <section class=\"tools\" aria-label=\"\u00d6deme ayarlar\u0131\">\n      <label class=\"field f-num\"><span>Vuru\u015f ba\u015f\u0131 \u00fccret</span><input id=\"f-rate\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"\u00f6r. 250k\"></label>\n      <label class=\"field f-num\"><span>Min. vuru\u015f</span><input id=\"f-min\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"0\"></label>\n      <label class=\"field f-num\"><span>Havuz (\u00fccreti hesaplat)</span><input id=\"f-pool\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"\u00f6r. 500m\"></label>\n      <button type=\"button\" class=\"btn\" id=\"f-pool-go\">Havuzdan \u00fccreti hesapla</button>\n    </section>\n\n    <div id=\"f-list\"></div>\n    <p id=\"f-empty\" class=\"hint\">Hen\u00fcz \u00fcye yok. Vuru\u015flar\u0131 \u00e7ek ya da elle yap\u0131\u015ft\u0131r.</p>\n    <div class=\"row-form\">\n      <button type=\"button\" class=\"btn\" id=\"f-copy\">\u00d6deme listesini kopyala</button>\n      <button type=\"button\" class=\"btn\" id=\"f-unpaid\">\u00d6dendileri s\u0131f\u0131rla</button>\n      <button type=\"button\" class=\"btn\" id=\"f-clear\">Listeyi temizle</button>\n      <a class=\"link\" id=\"f-vault\" href=\"https://www.torn.com/factions.php?step=your#/tab=controls\" target=\"_blank\" rel=\"noopener noreferrer\">Faction kontrol sayfas\u0131</a>\n    </div>\n    <p class=\"hint\">\u00d6demeyi Torn kendi i\u00e7inde yapar: \"\u00d6deme sayfas\u0131\" \u00fcyenin profilini a\u00e7ar, tutar yan\u0131nda haz\u0131r durur ve \"Tutar\u0131 kopyala\" ile panoya al\u0131rs\u0131n. Bu ara\u00e7 para g\u00f6ndermez, yaln\u0131zca hesab\u0131 ve \u00f6dendi i\u015faretini tutar.</p>\n    </div>\n\n    <div class=\"fpane\" data-pane=\"mem\" hidden>\n      <section class=\"panel\" aria-label=\"\u00dcyeler\">\n        <h2>Faction \u00fcyeleri</h2>\n        <div class=\"row-form\">\n          <button type=\"button\" class=\"btn primary\" id=\"fm-load\">\u00dcyeleri \u00e7ek</button>\n          <label class=\"field f-num\"><span>Pasif say\u0131ls\u0131n (g\u00fcn)</span><input id=\"fm-days\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"3\"></label>\n          <button type=\"button\" class=\"btn\" id=\"fm-copy\">Pasifleri kopyala</button>\n        </div>\n        <p id=\"fm-msg\" class=\"msg\" role=\"status\"></p>\n        <p class=\"hint\" style=\"margin-top:0\">Kendi faction'\u0131n listesi gelir. Anahtar\u0131nda Faction eri\u015fimi a\u00e7\u0131k olmal\u0131. Son aktiflik zaman\u0131 Torn'un verdi\u011fi \"last action\" de\u011feridir.</p>\n      </section>\n      <p id=\"fm-sum\" class=\"status\"></p>\n      <div id=\"fm-list\" class=\"fcard\" hidden></div>\n    </div>\n\n    <div class=\"fpane\" data-pane=\"oc\" hidden>\n      <section class=\"panel\" aria-label=\"OC takibi\">\n        <h2>Organized crime takibi</h2>\n        <div class=\"row-form\">\n          <button type=\"button\" class=\"btn primary\" id=\"oc-load\">OC'leri \u00e7ek</button>\n        </div>\n        <p id=\"oc-msg\" class=\"msg\" role=\"status\"></p>\n        <p class=\"hint\" style=\"margin-top:0\">Toplanan ve planlanan crime'lar, slotlardaki \u00fcyeler ve hi\u00e7bir crime'da olmayan \u00fcyeler. \u00d6d\u00fcl oranlar\u0131n\u0131 Torn kendisi da\u011f\u0131t\u0131r, burada g\u00f6sterilmez.</p>\n      </section>\n      <div id=\"oc-idle\" class=\"fcard\" hidden></div>\n      <div id=\"oc-list\" class=\"cards\"></div>\n    </div>\n\n    <div class=\"fpane\" data-pane=\"me\" hidden>\n      <section class=\"panel\" aria-label=\"Ki\u015fisel durum\">\n        <h2>Cooldown ve barlar</h2>\n        <div class=\"row-form\">\n          <button type=\"button\" class=\"btn primary\" id=\"me-load\">Yenile</button>\n          <label class=\"check\"><input type=\"checkbox\" id=\"me-auto\" checked> Otomatik yenile (30 sn)</label>\n        </div>\n        <p id=\"me-msg\" class=\"msg\" role=\"status\"></p>\n        <p class=\"hint\" style=\"margin-top:0\">Yaln\u0131zca kendi hesab\u0131n. Herkes kendi anahtar\u0131yla kendi durumunu g\u00f6r\u00fcr.</p>\n      </section>\n      <div id=\"me-cards\" class=\"cards\"></div>\n    </div>\n\n    <div class=\"fpane\" data-pane=\"bak\" hidden>\n      <section class=\"panel\" aria-label=\"Yedek\">\n        <h2>T\u00fcm veriyi yedekle</h2>\n        <p class=\"hint\" style=\"margin-top:0\">Hedef listesi, ayarlar, sava\u015f ve payout kay\u0131tlar\u0131 tek bir metin olarak kaydedilir. Ba\u015fka bir taray\u0131c\u0131ya ya da cihaza ta\u015f\u0131yabilirsin.</p>\n        <label class=\"check\"><input type=\"checkbox\" id=\"bk-keys\"> API anahtarlar\u0131n\u0131 da dahil et (yede\u011fi kimseyle payla\u015fma)</label>\n        <div class=\"row-form\">\n          <button type=\"button\" class=\"btn primary\" id=\"bk-export\">Yedek olu\u015ftur</button>\n          <button type=\"button\" class=\"btn\" id=\"bk-download\">Dosya olarak indir</button>\n          <button type=\"button\" class=\"btn\" id=\"bk-import\">Yede\u011fi geri y\u00fckle</button>\n          <input type=\"file\" id=\"bk-file\" accept=\".json,application/json,text/plain\" hidden>\n        </div>\n        <textarea id=\"bk-text\" rows=\"8\" class=\"mono\" style=\"width:100%\" placeholder=\"Yedek metni burada g\u00f6r\u00fcn\u00fcr. Geri y\u00fcklemek i\u00e7in buraya yap\u0131\u015ft\u0131r ya da dosya se\u00e7.\"></textarea>\n        <p id=\"bk-msg\" class=\"msg\" role=\"status\"></p>\n      </section>\n    </div>\n  </div>\n\n  <div class=\"view\" id=\"view-halloween\" hidden>\n  <div class=\"backrow\"><button type=\"button\" class=\"link\" data-go=\"home\">&larr; Modlar</button></div>\n  <header class=\"top\">\n    <div>\n      <p class=\"eyebrow\">Torn City</p>\n      <h1>Hedef Listesi</h1>\n    </div>\n    <div class=\"statsrow\">\n    <dl class=\"stats\" aria-label=\"\u00d6zet\">\n      <div><dt>hedef</dt><dd id=\"st-total\">0</dd></div>\n      <div><dt>sald\u0131r\u0131ya haz\u0131r</dt><dd id=\"st-ready\">0</dd></div>\n      <div><dt>bug\u00fcn sald\u0131r\u0131lan</dt><dd id=\"st-today\">0</dd></div>\n    </dl>\n      <button type=\"button\" class=\"btn small\" id=\"top-today\" title=\"Bug\u00fcnk\u00fc sald\u0131r\u0131 say\u0131lar\u0131n\u0131 s\u0131f\u0131rlar ve mug korumas\u0131ndaki hedeflerin korumas\u0131n\u0131 kald\u0131r\u0131r. Toplam sald\u0131r\u0131 kay\u0131tlar\u0131n silinmez.\">Bug\u00fcn\u00fc s\u0131f\u0131rla</button>\n    </div>\n  </header>\n\n  <section class=\"panel\" id=\"queue\" aria-label=\"S\u0131ra modu\">\n    <div class=\"qhead\"><h2>S\u0131ra modu</h2><span id=\"q-energy\" class=\"qenergy\" hidden></span></div>\n    <div id=\"q-card\"></div>\n    <div class=\"row-form\" style=\"margin-top:12px\">\n      <label class=\"field f-num\" style=\"flex:0 1 130px\"><span>Ayn\u0131 hedefe ara (dk)</span><input id=\"q-gap\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"10\"></label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"q-auto\" checked> Durumu otomatik kontrol et</label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"q-mug\"> Mug modu</label>\n      <label class=\"check\"><input type=\"checkbox\" id=\"q-keys\"> Klavye: Enter sald\u0131r\u0131r, S atlar</label>\n      <button type=\"button\" class=\"btn us-only\" data-mini=\"halloween\">Mini pencereye ge\u00e7</button>\n      <label class=\"check us-only\"><input type=\"checkbox\" class=\"opt-same\" checked> Sald\u0131r\u0131y\u0131 ayn\u0131 sekmede a\u00e7 ve mini pencereye ge\u00e7</label>\n    </div>\n    <p id=\"q-info\" class=\"hint\"></p>\n    <p class=\"hint\" style=\"margin-top:0\">S\u0131ra, a\u015fa\u011f\u0131daki \"S\u0131ralama\" se\u00e7imine g\u00f6re dizilir. \"Sadece kolaylar\" ve \"Min networth\" s\u00fczge\u00e7leri s\u0131raya da uygulan\u0131r. Mug modunda networth'\u00fc y\u00fcksek olanlar \u00f6ne al\u0131n\u0131r ve 12 saat i\u00e7inde mug ettiklerin atlan\u0131r.</p>\n  </section>\n\n  <details class=\"panel\" id=\"halo\" aria-label=\"Halloween sayac\u0131\">\n    <summary>Halloween sayac\u0131</summary>\n    <div class=\"inner\">\n    <div class=\"row-form\">\n      <div class=\"mystats\" id=\"halo-stats\"></div>\n      <label class=\"field f-sel\"><span>Sepet seviyesi</span>\n        <select id=\"h-level\">\n          <option value=\"0\">Spooky \u00b7 %35 (0+ tatl\u0131)</option>\n          <option value=\"1\">Creepy \u00b7 %40 (5+ tatl\u0131)</option>\n          <option value=\"2\">Freaky \u00b7 %45 (15+ tatl\u0131)</option>\n          <option value=\"3\">Frightful \u00b7 %50 (40+ tatl\u0131)</option>\n          <option value=\"4\">Haunting \u00b7 %55 (90+ tatl\u0131)</option>\n          <option value=\"5\">Shocking \u00b7 %60 (190+ tatl\u0131)</option>\n          <option value=\"6\">Terrifying \u00b7 %65 (440+ tatl\u0131)</option>\n          <option value=\"7\">Horrifying \u00b7 %70 (940+ tatl\u0131)</option>\n          <option value=\"8\">Petrifying \u00b7 %75 (1.940+ tatl\u0131)</option>\n          <option value=\"9\">Nightmarish \u00b7 %80 (4.440+ tatl\u0131)</option>\n        </select>\n      </label>\n      <label class=\"field f-num\"><span>Ek bonus %</span><input id=\"h-bonus\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" value=\"0\"></label>\n      <label class=\"field f-num\"><span>\u00c7arpan</span><input id=\"h-mult\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" value=\"1\"></label>\n      <button type=\"button\" class=\"btn\" id=\"h-plus\" title=\"Oyunda sayfa d\u0131\u015f\u0131 yapt\u0131\u011f\u0131n bir sald\u0131r\u0131y\u0131 ekle\">+1</button>\n      <button type=\"button\" class=\"btn\" id=\"h-minus\" title=\"Son kayd\u0131 geri al\">&minus;1</button>\n      <button type=\"button\" class=\"btn\" id=\"h-today\" title=\"Bug\u00fcnk\u00fc sald\u0131r\u0131 say\u0131lar\u0131n\u0131 s\u0131f\u0131rlar ve mug korumas\u0131ndaki hedeflerin korumas\u0131n\u0131 kald\u0131r\u0131r. Toplam sald\u0131r\u0131 kay\u0131tlar\u0131n silinmez.\">Bug\u00fcn\u00fc s\u0131f\u0131rla</button>\n      <button type=\"button\" class=\"btn\" id=\"h-reset\">Sayac\u0131 s\u0131f\u0131rla</button>\n    </div>\n    <p class=\"hint\">Her sald\u0131r\u0131 ayn\u0131 tatl\u0131 \u015fans\u0131n\u0131 ta\u015f\u0131r, hedefin kim oldu\u011fu fark etmez. \u015eans sepet seviyene g\u00f6re otomatik hesaplan\u0131r: Spooky'de %35, her seviyede %5 artar, Nightmarish'te %80 olur. Korkun\u00e7 giysi ve silah\u0131n \u015fans\u0131 ne kadar art\u0131rd\u0131\u011f\u0131n\u0131 wiki vermiyor. Bunu biliyorsan \"Ek bonus\" kutusuna yaz. \u00c7arpan y\u00fckseltmeleri de ger\u00e7ek say\u0131y\u0131 de\u011fi\u015ftirdi\u011fi i\u00e7in beklenen tatl\u0131 kaba bir tahmindir. Saya\u00e7 yaln\u0131zca bu sayfadan bas\u0131lan Sald\u0131r d\u00fc\u011fmelerini sayar.</p>\n    </div>\n  </details>\n\n  <div id=\"key-host-h\" class=\"keyhost\">\n  <section class=\"panel\" id=\"keysec\" aria-label=\"Torn ba\u011flant\u0131s\u0131\">\n    <h2>Torn ba\u011flant\u0131s\u0131</h2>\n    <div class=\"row-form\">\n      <label class=\"field f-key\"><span>API anahtar\u0131</span><input id=\"api-key\" type=\"password\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"Limited Access anahtar\u0131n\u0131 yap\u0131\u015ft\u0131r\"></label>\n      <button type=\"button\" class=\"btn\" id=\"key-save\">Kaydet ve ba\u011flan</button>\n      <label class=\"field f-key\"><span>FF Scouter anahtar\u0131 (iste\u011fe ba\u011fl\u0131)</span><input id=\"ff-key\" type=\"password\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"Bo\u015fsa yukar\u0131daki anahtar kullan\u0131l\u0131r\"></label>\n      <button type=\"button\" class=\"btn h-only\" id=\"ff-fetch\">FF de\u011ferlerini \u00e7ek</button>\n      <button type=\"button\" class=\"btn h-only\" id=\"sync\">Hedeflerimi \u00e7ek</button>\n      <button type=\"button\" class=\"btn h-only\" id=\"refresh\">Durumlar\u0131 yenile</button>\n    </div>\n    <p id=\"api-msg\" class=\"msg\" role=\"status\"></p>\n    <p id=\"ff-msg\" class=\"msg\" role=\"status\" style=\"margin-top:0\"></p>\n    <p class=\"hint\">Anahtar yaln\u0131zca bu taray\u0131c\u0131da saklan\u0131r ve sadece api.torn.com'a g\u00f6nderilir. FF de\u011ferleri ffscouter.com'dan gelir. Bunun i\u00e7in orada kay\u0131tl\u0131 olman gerekir ve anahtar\u0131n o siteye de g\u00f6nderilir. Torn'da <a href=\"https://www.torn.com/preferences.php#tab=api\" target=\"_blank\" rel=\"noopener noreferrer\">Ayarlar &rarr; API Key</a> sayfas\u0131ndan Limited Access seviyesinde bir anahtar olu\u015ftur. <button type=\"button\" class=\"link\" id=\"key-del\" hidden>Kay\u0131tl\u0131 anahtar\u0131 sil</button></p>\n    <details id=\"dbg\" hidden style=\"margin-top:8px\">\n      <summary class=\"hint\" style=\"cursor:pointer\">Torn'un verdi\u011fi yan\u0131t (hata ay\u0131klama)</summary>\n      <textarea id=\"dbg-t\" class=\"mono\" readonly style=\"margin-top:8px\"></textarea>\n    </details>\n  </section>\n  </div>\n\n  <section class=\"panel\" aria-label=\"Senin statlar\u0131n\">\n    <h2>Senin statlar\u0131n</h2>\n    <div class=\"row-form\">\n      <div class=\"mystats\" id=\"mystats\"></div>\n      <label class=\"field f-total\"><span>Toplam stat (elle)</span><input id=\"my-total\" class=\"mono\" type=\"text\" inputmode=\"decimal\" autocomplete=\"off\" placeholder=\"\u00f6r. 850m veya 1.2b\"></label>\n      <button type=\"button\" class=\"btn\" id=\"stats-set\">Uygula</button>\n      <button type=\"button\" class=\"btn\" id=\"stats-fetch\">Statlar\u0131m\u0131 \u00e7ek</button>\n    </div>\n    <p id=\"stats-msg\" class=\"msg\" role=\"status\"></p>\n    <p class=\"hint\">Sat\u0131rlardaki y\u00fczde, rakibin tahmini toplam stat\u0131n\u0131n seninkine oran\u0131d\u0131r ve bilgi i\u00e7indir. Zorluk etiketi FF Scouter'\u0131n Fair Fight de\u011ferine g\u00f6re verilir. Rakip statlar\u0131 tahmindir, kendi statlar\u0131n Torn'dan gelen ger\u00e7ek de\u011ferlerdir.</p>\n  </section>\n\n  <details class=\"panel\" id=\"finder-box\" open>\n    <summary>Kolay hedef bul</summary>\n    <div class=\"inner\">\n      <p>FF Scouter hesab\u0131ndaki statlar\u0131na g\u00f6re her oyuncu i\u00e7in bir Fair Fight (FF) de\u011feri hesaplar. FF ne kadar d\u00fc\u015f\u00fckse hedef senin i\u00e7in o kadar kolayd\u0131r (2 ve alt\u0131 kolay, 3.5 ve alt\u0131 orta). Be\u011fendiklerini tek dokunu\u015fla listene ekle. \"Networth'leri de getir\" a\u00e7\u0131ksa her aday i\u00e7in ayr\u0131ca Torn'a sorulur ve 50 aday i\u00e7in yakla\u015f\u0131k yar\u0131m dakika s\u00fcrer. Sonu\u00e7lar networth'e g\u00f6re s\u0131ralan\u0131r. \"Min networth\" doluysa alt\u0131ndakiler elenir. Daha \u00f6nce bulunan oyuncular bir daha g\u00f6sterilmez. \u0130lk 50 sonu\u00e7 t\u00fckenirse sayfa aramay\u0131 seviye ve FF aral\u0131klar\u0131na b\u00f6lerek yeni oyuncu arar. Ekledi\u011fin oyuncular\u0131n ad\u0131 \"Durumlar\u0131 yenile\" ile gelir.</p>\n      <div class=\"row-form\">\n        <label class=\"field f-num\"><span>Min seviye</span><input id=\"fd-min\" class=\"mono\" type=\"text\" inputmode=\"numeric\" value=\"1\"></label>\n        <label class=\"field f-num\"><span>Maks seviye</span><input id=\"fd-max\" class=\"mono\" type=\"text\" inputmode=\"numeric\" value=\"100\"></label>\n        <label class=\"field f-sel\"><span>Zorluk s\u0131n\u0131r\u0131</span>\n          <select id=\"fd-ratio\">\n            <option value=\"2\" selected>Kolay: FF 2.0'a kadar</option>\n            <option value=\"2.5\">Kolay-orta: FF 2.5'a kadar</option>\n            <option value=\"3.5\">Orta: FF 3.5'a kadar</option>\n            <option value=\"4.5\">Zor: FF 4.5'a kadar</option>\n          </select>\n        </label>\n        <label class=\"field f-num\"><span>Maks FF</span><input id=\"fd-maxff\" class=\"mono\" type=\"text\" inputmode=\"decimal\" placeholder=\"bo\u015f\"></label>\n        <label class=\"field f-num\" style=\"flex:0 1 130px\"><span>Min networth</span><input id=\"fd-nw\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"bo\u015f\"></label>\n        <label class=\"field f-num\"><span>Adet</span><input id=\"fd-limit\" class=\"mono\" type=\"text\" inputmode=\"numeric\" value=\"50\"></label>\n      </div>\n      <div class=\"row-form\">\n        <label class=\"check\"><input type=\"checkbox\" id=\"fd-inactive\" checked> 14+ g\u00fcnd\u00fcr aktif olmayanlar</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"fd-faction\"> Sadece factions\u0131zlar</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"fd-nw-show\" checked> Networth'leri de getir (yava\u015f)</label>\n        <label class=\"check\"><input type=\"checkbox\" id=\"fd-unseen\" checked> Daha \u00f6nce bulunanlar\u0131 g\u00f6sterme</label>\n      </div>\n      <div class=\"btn-row\">\n        <button type=\"button\" class=\"btn primary\" id=\"find-go\">Hedefleri bul</button>\n        <label class=\"field f-num\" style=\"flex:0 1 120px\"><span>Havuz hedefi</span><input id=\"fd-pool\" class=\"mono\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" value=\"200\"></label>\n        <button type=\"button\" class=\"btn\" id=\"pool-go\" title=\"S\u00fczge\u00e7lere uyan yeni oyuncular\u0131 tarar ve do\u011frudan listene ekler\">Havuzu doldur</button>\n        <button type=\"button\" class=\"btn\" id=\"seen-reset\" title=\"Daha \u00f6nce bulunan oyuncular\u0131n kayd\u0131n\u0131 siler\">G\u00f6r\u00fclenleri s\u0131f\u0131rla (0)</button>\n        <button type=\"button\" class=\"btn\" id=\"find-addall\" hidden>Hepsini ekle</button>\n        <span id=\"find-msg\" class=\"msg\" role=\"status\"></span>\n      </div>\n      <ul id=\"found\" class=\"list found\" hidden></ul>\n    </div>\n  </details>\n\n  <section class=\"panel\" aria-label=\"Hedef ekle\">\n    <h2>Elle ekle</h2>\n    <form id=\"add-form\" class=\"row-form\" autocomplete=\"off\">\n      <label class=\"field f-id\"><span>Oyuncu ID</span><input id=\"f-id\" class=\"mono\" type=\"text\" inputmode=\"numeric\" placeholder=\"1234567 veya profil linki\"></label>\n      <label class=\"field f-name\"><span>\u0130sim</span><input id=\"f-name\" type=\"text\" maxlength=\"60\" placeholder=\"iste\u011fe ba\u011fl\u0131\"></label>\n      <label class=\"field f-note\"><span>Not</span><input id=\"f-note\" type=\"text\" maxlength=\"140\" placeholder=\"\u00f6r. savunmas\u0131 zay\u0131f, gece aktif\"></label>\n      <button class=\"btn\" type=\"submit\">Ekle</button>\n    </form>\n    <p id=\"add-msg\" class=\"msg\" role=\"status\"></p>\n  </section>\n\n  <section class=\"tools\" aria-label=\"Liste ara\u00e7lar\u0131\">\n    <label class=\"field f-search\"><span>Ara</span><input id=\"q\" type=\"search\" placeholder=\"isim, ID veya not\"></label>\n    <label class=\"field f-sort\"><span>S\u0131ralama</span>\n      <select id=\"sort\">\n        <option value=\"sira\">Sald\u0131r\u0131 s\u0131ras\u0131</option>\n        <option value=\"yeni\">Son eklenen \u00f6nce</option>\n        <option value=\"isim\">\u0130sme g\u00f6re</option>\n        <option value=\"kolay\">Kolayl\u0131k (kolay \u00f6nce)</option>\n        <option value=\"nw\">Networth (y\u00fcksek \u00f6nce)</option>\n        <option value=\"ff\">Fair Fight (y\u00fcksek \u00f6nce)</option>\n        <option value=\"seviye\">Seviyeye g\u00f6re</option>\n        <option value=\"id\">ID'ye g\u00f6re</option>\n        <option value=\"cok\">En \u00e7ok sald\u0131r\u0131lan</option>\n      </select>\n    </label>\n    <label class=\"check\"><input type=\"checkbox\" id=\"only-ok\"> Sadece Okay olanlar</label>\n    <label class=\"check\"><input type=\"checkbox\" id=\"only-easy\"> Sadece kolaylar</label>\n    <label class=\"field f-num\" style=\"flex:0 1 130px\"><span>Min networth</span><input id=\"min-nw\" class=\"mono\" type=\"text\" autocomplete=\"off\" placeholder=\"\u00f6r. 500m\"></label>\n    <button type=\"button\" class=\"btn\" id=\"nw-fetch\">Networth \u00e7ek</button>\n    <button type=\"button\" class=\"btn\" id=\"sel-mode\">Toplu se\u00e7</button>\n    <a id=\"next\" class=\"btn primary\" href=\"#\" target=\"_blank\" rel=\"noopener noreferrer\" hidden>S\u0131radaki hedefe sald\u0131r</a>\n  </section>\n\n  <p id=\"nw-msg\" class=\"msg\" role=\"status\" style=\"margin:0\"></p>\n  <p class=\"hint\" style=\"margin:0\">Mug tavan\u0131 = networth \u00d7 %5. Mug, hedefin cebindeki nakdin yakla\u015f\u0131k %5'ini (en fazla %10) al\u0131r. Networth ise banka, hisse, e\u015fya ve m\u00fclk\u00fc de i\u00e7erir, o y\u00fczden ger\u00e7ek kazan\u00e7 \u00e7o\u011fu zaman tavandan \u00e7ok daha d\u00fc\u015f\u00fck olur.</p>\n  <div id=\"selbar\" class=\"selbar\" hidden>\n    <span class=\"cnt\" id=\"sel-cnt\">0 se\u00e7ili</span>\n    <button type=\"button\" class=\"btn\" id=\"sel-vis\">G\u00f6r\u00fcnenlerin hepsini se\u00e7</button>\n    <button type=\"button\" class=\"btn\" id=\"sel-none\">Se\u00e7imi temizle</button>\n    <button type=\"button\" class=\"btn\" id=\"sel-del\" disabled>Se\u00e7ilenleri sil</button>\n    <button type=\"button\" class=\"btn\" id=\"sel-off\">Bitti</button>\n  </div>\n  <ul id=\"list\" class=\"list\" hidden></ul>\n\n  <div id=\"empty\" class=\"empty\" hidden>\n    <h2>Listen bo\u015f</h2>\n    <p>Yukar\u0131daki \"Hedeflerimi \u00e7ek\" d\u00fc\u011fmesi Torn'daki hedef listeni buraya getirir. API anahtar\u0131n\u0131 kaydetmen yeterli.</p>\n    <p>\u0130stersen ID'leri elle ya da a\u015fa\u011f\u0131daki \"Toplu ekle\" b\u00f6l\u00fcm\u00fcnden yap\u0131\u015ft\u0131rabilirsin. <code>Ad [1234567]</code>, <code>1234567 Ad</code>, <code>1234567</code> ve profil linkleri \u00e7al\u0131\u015f\u0131r.</p>\n  </div>\n\n  <details class=\"panel\" id=\"bulk-box\">\n    <summary>Toplu ekle</summary>\n    <div class=\"inner\">\n      <p>Her sat\u0131ra bir hedef yaz. Listede olan ID'ler tekrar eklenmez.</p>\n      <textarea id=\"bulk\" class=\"mono\" placeholder=\"Ad [1234567]&#10;7654321 Ba\u015fka Ad&#10;https://www.torn.com/profiles.php?XID=1111111\"></textarea>\n      <div class=\"btn-row\">\n        <button type=\"button\" class=\"btn\" id=\"bulk-go\">\u0130\u00e7e aktar</button>\n        <span id=\"bulk-msg\" class=\"msg\" role=\"status\"></span>\n      </div>\n    </div>\n  </details>\n\n  <details class=\"panel\" id=\"xls-box\">\n    <summary>Excel'e kopyala ve yedekle</summary>\n    <div class=\"inner\">\n      <p>Metin sekmeyle ayr\u0131lm\u0131\u015f s\u00fctunlar i\u00e7erir. Kopyalay\u0131p Excel veya Google Sheets'te A1 h\u00fccresine yap\u0131\u015ft\u0131rabilirsin. Ayn\u0131 metni \"Toplu ekle\" b\u00f6l\u00fcm\u00fcne yap\u0131\u015ft\u0131rarak listeyi geri y\u00fckleyebilirsin.</p>\n      <textarea id=\"xls\" class=\"mono\" readonly></textarea>\n      <div class=\"btn-row\">\n        <button type=\"button\" class=\"btn\" id=\"xls-copy\">Kopyala</button>\n        <span id=\"xls-msg\" class=\"msg\" role=\"status\"></span>\n      </div>\n    </div>\n  </details>\n\n  <p id=\"status\" class=\"status\"></p>\n  </div>\n  <footer class=\"foot\" id=\"foot\">\n    <button type=\"button\" class=\"btn\" id=\"bug-open\">Hata bildir</button>\n    <button type=\"button\" class=\"btn\" id=\"bug-copy\">Raporu kopyala</button>\n    <span class=\"dim\" id=\"foot-ver\"></span>\n  </footer>\n</div>";

  var host = document.createElement('div');
  host.id = 'torn-hedef-araci';
  (document.body || document.documentElement).appendChild(host);
  var root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = '<style>' + CSS + '</style><button type="button" class="x-open" id="x-open">Torn-Helper</button><div class="mini" id="mini" hidden><div class="mini-h"><span class="mini-title" id="mini-title"></span><span class="mini-en qenergy" id="mini-en" hidden></span><span class="mini-btns"><button type="button" id="mini-side" title="Yan değiştir">&harr;</button><button type="button" id="mini-full">Genişlet</button><button type="button" id="mini-x" title="Kapat">&times;</button></span></div><div class="mini-b" id="mini-b"></div></div><div class="tips" id="tips" hidden><div class="mini-h"><span class="mini-title" id="tips-title"></span><span class="mini-btns"><button type="button" id="tips-all">Tüm fiyatlar</button><button type="button" id="tips-x" title="Kapat">&times;</button></span></div><div class="mini-b" id="tips-b"></div></div><div class="shell" id="shell" hidden>' + HTML + '</div>';
  var shell = root.getElementById('shell');
  var miniEl = root.getElementById('mini'), openBtn = root.getElementById('x-open');

  /* depolama: Tampermonkey'in kendi deposu (torn.com sayfası göremez), her anahtar ayrı */
  var KV = 'kv:';
  try {
    var oldStore = GM_getValue('store', null);
    if (oldStore && typeof oldStore === 'object' && Object.keys(oldStore).length) {
      Object.keys(oldStore).forEach(function (k) { if (GM_getValue(KV + k, null) === null) GM_setValue(KV + k, oldStore[k]); });
      GM_setValue('store', {});
    }
  } catch (e) {}
  var LS = {
    getItem: function (k) { var v = GM_getValue(KV + k, null); return v === null || v === undefined ? null : String(v); },
    setItem: function (k, v) { GM_setValue(KV + k, String(v)); },
    removeItem: function (k) { GM_deleteValue(KV + k); },
    keys: function () { try { return GM_listValues().filter(function (x) { return x.indexOf(KV) === 0; }).map(function (x) { return x.slice(KV.length); }); } catch (e) { return []; } }
  };

  /* ağ: CORS sorunu olmasın diye Tampermonkey üzerinden */
  var ALLOWED_HOSTS = ['api.torn.com', 'ffscouter.com', 'api.prombot.co.uk', 'yata.yt'];
  function gmFetch(url) {
    var pu;
    try { pu = new URL(url); } catch (e) { return Promise.reject(new TypeError('bad url')); }
    if (pu.protocol !== 'https:' || ALLOWED_HOSTS.indexOf(pu.hostname) < 0) return Promise.reject(new TypeError('blocked host'));
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET', url: url, timeout: 25000,
        onload: function (r) {
          resolve({ ok: r.status >= 200 && r.status < 300, status: r.status, text: function () { return Promise.resolve(r.responseText); }, json: function () { try { return Promise.resolve(JSON.parse(r.responseText)); } catch (e) { return Promise.reject(e); } } });
        },
        onerror: function () { reject(new TypeError('network')); },
        ontimeout: function () { reject(new TypeError('timeout')); }
      });
    });
  }

  /* pencere durumu: btn (sadece düğme), mini (küçük pencere), full (yan panel) */
  var UI_LS = 'torn-ui-v1';
  var ui = { state: 'btn', miniMode: 'halloween', side: 'right', wide: false, sameTab: true, tips: true };
  try { Object.assign(ui, JSON.parse(LS.getItem(UI_LS) || '{}')); } catch (e) {}
  if (ui.state !== 'mini') ui.state = 'btn';
  function saveUi() { LS.setItem(UI_LS, JSON.stringify(ui)); }
  function isOpen() { return ui.state !== 'btn'; }
  function applyUi() {
    openBtn.hidden = ui.state !== 'btn';
    shell.hidden = ui.state !== 'full';
    miniEl.hidden = ui.state !== 'mini';
    shell.classList.toggle('wide', !!ui.wide);
    miniEl.classList.toggle('left', ui.side === 'left');
  }
  function setState(s) {
    ui.state = s; saveUi(); applyUi();
    if (s !== 'btn' && !booted) boot();
    if (THOST.onchange) THOST.onchange(s);
  }
  var THOST = {
    ui: ui, save: saveUi, onchange: null, setState: setState,
    state: function () { return ui.state; },
    setMini: function (m) { ui.miniMode = m; setState('mini'); },
    prepare: function (m) { ui.miniMode = m; ui.state = 'mini'; saveUi(); },
    onTravel: function () { return onTravel(); },
    travelEnter: null, travelLeave: null,
    rateGet: function () { try { var a = GM_getValue('rl', []); return Array.isArray(a) ? a : []; } catch (e) { return []; } },
    rateSet: function (a) { try { GM_setValue('rl', a); } catch (e) {} },
    pollGate: function (name, ms) {
      try { var k = 'poll-' + name, t = Number(GM_getValue(k, 0)) || 0, now = Date.now(); if (now - t < ms * 0.9) return false; GM_setValue(k, now); return true; } catch (e) { return true; }
    }
  };

  function onTravel() {
    try {
      return location.pathname.indexOf('page.php') > -1 && /[?&]sid=travel(&|$)/i.test(location.search) && !(document.body && document.body.dataset && document.body.dataset.abroad === 'true');
    } catch (e) { return false; }
  }
  var wasTravel = false;
  function checkTravel() {
    var on = onTravel();
    if (on === wasTravel) return;
    wasTravel = on;
    if (on) {
      if (ui.tips === false) return;
      if (!booted) boot();
      if (THOST.travelEnter) THOST.travelEnter();
    } else if (THOST.travelLeave) THOST.travelLeave();
  }

  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;

(function () {
  'use strict';
  var LS_KEY = 'torn-hedef-listesi-v1';
  var KEY_LS = 'torn-api-key-v1';
  var targets = {};
  var editingId = null;
  var armedDelete = null;
  var selMode = false, selIds = {}, selArm = false, selTimer = null, lastView = [];
  var armTimer = null;
  var busy = false;
  var stopFlag = false;

  function $(id) { return root.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function atkUrl(id) { return 'https://www.torn.com/page.php?sid=attack&user2ID=' + id; }
  function profUrl(id) { return 'https://www.torn.com/profiles.php?XID=' + id; }
  function isToday(ts) {
    return !!ts && new Date(ts).toDateString() === new Date().toDateString() && ts >= ((alog && alog.todayFrom) || 0);
  }
  function ago(ts) {
    if (!ts) return 'hiç saldırılmadı';
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'az önce';
    var m = Math.floor(s / 60);
    if (m < 60) return m + ' dk önce';
    var h = Math.floor(m / 60);
    if (h < 24) return h + ' sa önce';
    return Math.floor(h / 24) + ' gün önce';
  }
  function remain(sec) {
    if (sec < 60) return 'az kaldı';
    var m = Math.floor(sec / 60);
    if (m < 60) return m + ' dk';
    var h = Math.floor(m / 60);
    if (h < 24) return h + ' sa ' + (m % 60) + ' dk';
    return Math.floor(h / 24) + ' gün ' + (h % 24) + ' sa';
  }
  function setStatus(text, isErr) {
    var el = $('status');
    el.textContent = text;
    el.className = 'status' + (isErr ? ' err' : '');
  }
  function say(id, text, isErr) {
    var el = $(id);
    el.textContent = text;
    el.className = 'msg' + (isErr ? ' err' : '');
  }

  /* ---------- kayıt (yalnızca bu tarayıcı) ---------- */
  var storeOk = true;
  function loadLocal() {
    try {
      var raw = LS.getItem(LS_KEY);
      if (raw) JSON.parse(raw).forEach(function (t) { if (t && t.id) targets[t.id] = t; });
    } catch (e) { storeOk = false; }
  }
  function save() {
    try {
      LS.setItem(LS_KEY, JSON.stringify(Object.keys(targets).map(function (k) { return targets[k]; })));
    } catch (e) {
      storeOk = false;
      setStatus('Bu tarayıcı kayıt tutmuyor. Sayfayı kapatınca liste silinir. "Excel\'e kopyala ve yedekle" bölümünden yedek al.', true);
    }
  }
  function getKey() { try { return LS.getItem(KEY_LS) || ''; } catch (e) { return ''; } }
  var FF_LS = 'torn-ff-key-v1', FF_OK = 'torn-ff-ok-v1';
  function ffOwnKey() { try { return LS.getItem(FF_LS) || ''; } catch (e) { return ''; } }
  function ffKey() { return ffOwnKey() || getKey(); }
  function setFfKey(v) { try { if (v) LS.setItem(FF_LS, v); else LS.removeItem(FF_LS); } catch (e) {} }
  function ffWorked() { try { return LS.getItem(FF_OK) === '1'; } catch (e) { return false; } }
  function setFfWorked() { try { LS.setItem(FF_OK, '1'); } catch (e) {} }
  function setKey(v) { try { if (v) LS.setItem(KEY_LS, v); else LS.removeItem(KEY_LS); } catch (e) {} }

  /* ---------- Torn API ---------- */
  function apiError(e) {
    var code = e && e.code, msg = (e && (e.error || e.message)) || 'bilinmeyen hata';
    var err;
    if (code === 2) err = new Error('API anahtarı geçersiz. Anahtarı kontrol et.');
    else if (code === 5) err = new Error('Torn çok sık istek geldiğini söylüyor. Bir dakika bekleyip tekrar dene.');
    else if (code === 16) err = new Error('Bu anahtarın erişim seviyesi yetmiyor. Limited Access seviyesinde yeni bir anahtar oluştur.');
    else err = new Error('Torn hata verdi (' + code + '): ' + msg);
    err.code = code;
    return err;
  }
  var RATE_MAX = 55, rateLocal = [];
  function rateGate() {
    return new Promise(function (resolve) {
      (function tryIt() {
        var now = Date.now(), arr = (HOSTAPI && HOSTAPI.rateGet ? HOSTAPI.rateGet() : rateLocal).filter(function (t) { return now - t < 60000; });
        if (arr.length >= RATE_MAX) { setTimeout(tryIt, 1500); return; }
        arr.push(now);
        if (HOSTAPI && HOSTAPI.rateSet) HOSTAPI.rateSet(arr); else rateLocal = arr;
        resolve();
      })();
    });
  }
  function pollOk(name, ms) { return HOSTAPI && HOSTAPI.pollGate ? HOSTAPI.pollGate(name, ms) : true; }
  function apiGet(path, params, base) {
    var u = new URL('https://api.torn.com' + (base == null ? '/v2' : base) + path);
    Object.keys(params || {}).forEach(function (k) { u.searchParams.set(k, params[k]); });
    u.searchParams.set('key', getKey());
    u.searchParams.set('comment', 'torn-helper');
    return rateGate().then(function () { return gmFetch(u.toString()); }).then(function (r) {
      return r.json().then(function (j) { return { j: j, status: r.status }; }, function () {
        throw new Error('Torn okunabilir bir yanıt vermedi (HTTP ' + r.status + ').');
      });
    }, function () {
      var e = new Error('Torn\'a bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın Torn API\'sine istek atmasını engelliyor olabilir.');
      e.net = true;
      throw e;
    }).then(function (res) {
      if (res.j && res.j.error) throw apiError(res.j.error);
      return res.j;
    });
  }
  function pickList(j) {
    if (Array.isArray(j)) return j;
    if (!j || typeof j !== 'object') return null;
    var names = ['list', 'targets', 'contacts'];
    for (var i = 0; i < names.length; i++) {
      var v = j[names[i]];
      if (Array.isArray(v)) return v;
      if (v && typeof v === 'object') {
        return Object.keys(v).map(function (k) { return Object.assign({ id: k }, v[k]); });
      }
    }
    var keys = Object.keys(j);
    for (var k = 0; k < keys.length; k++) if (Array.isArray(j[keys[k]])) return j[keys[k]];
    return null;
  }
  function normStatus(s) {
    if (!s) return null;
    if (typeof s === 'string') return { state: s, description: s, until: 0 };
    return { state: s.state || '', description: s.description || '', until: s.until || 0 };
  }
  function showRaw(obj) {
    $('dbg').hidden = false;
    try { $('dbg-t').value = JSON.stringify(obj, null, 2).slice(0, 4000); } catch (e) { $('dbg-t').value = String(obj); }
  }
  async function fetchAllTargets() {
    var cats = ['Targets', 'targets'], cat = null, page = null, lastErr = null, i;
    for (i = 0; i < cats.length; i++) {
      try { page = await apiGet('/user/list', { cat: cats[i], limit: 50, offset: 0, striptags: 'true' }); cat = cats[i]; break; }
      catch (e) { lastErr = e; if (e.code === 2 || e.code === 5 || e.code === 16 || e.net) throw e; }
    }
    if (!cat) throw lastErr;
    var out = [], offset = 0;
    for (var n = 0; n < 40; n++) {
      var l = pickList(page);
      if (!l) { var e2 = new Error('Torn\'dan beklenmeyen bir yanıt geldi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.'); e2.raw = page; throw e2; }
      out = out.concat(l);
      if (l.length < 50) break;
      offset += 50;
      await sleep(700);
      page = await apiGet('/user/list', { cat: cat, limit: 50, offset: offset, striptags: 'true' });
    }
    return out;
  }
  function setBusy(b) {
    busy = b;
    $('sync').disabled = b;
    $('key-save').disabled = b;
    $('refresh').textContent = (b && !stopFlag && $('refresh').getAttribute('data-run')) ? 'Durdur' : 'Durumları yenile';
    $('refresh').disabled = b && !$('refresh').getAttribute('data-run');
  }
  async function syncTargets(auto) {
    if (busy) return;
    if (!getKey()) { say('api-msg', 'Önce API anahtarını kaydet.', true); return; }
    setBusy(true);
    say('api-msg', 'Hedeflerin Torn\'dan çekiliyor…', false);
    try {
      var items = await fetchAllTargets();
      var added = 0, updated = 0, now = Date.now();
      items.forEach(function (it) {
        var id = String(it.id || it.user_id || it.player_id || '').replace(/\D/g, '');
        if (!id) return;
        var st = normStatus(it.status);
        var t = targets[id];
        if (!t) {
          t = targets[id] = { id: id, name: '', note: '', addedAt: now, attacks: 0, lastAttack: 0 };
          added++;
        } else { updated++; }
        if (it.name) t.name = it.name;
        if (it.level) t.level = it.level;
        if (st) { t.status = st; t.checkedAt = now; }
      });
      save();
      render(true);
      say('api-msg', items.length + ' hedef alındı: ' + added + ' yeni' + (updated ? ', ' + updated + ' tanesi güncellendi' : '') + '.', false);
      if (!items.length) say('api-msg', 'Torn\'da hedef listen boş görünüyor.', false);
      if (items.length && ffWorked()) await fetchFF(true);
    } catch (e) {
      say('api-msg', e.message || 'Bağlantı kurulamadı.', true);
      if (e.raw) showRaw(e.raw);
    }
    setBusy(false);
  }
  async function refreshStatuses() {
    if (busy) { stopFlag = true; return; }
    if (!getKey()) { say('api-msg', 'Önce API anahtarını kaydet.', true); return; }
    var list = order(all(), 'sira');
    if (!list.length) { say('api-msg', 'Yenilenecek hedef yok.', true); return; }
    stopFlag = false;
    $('refresh').setAttribute('data-run', '1');
    setBusy(true);
    var done = 0;
    try {
      for (var i = 0; i < list.length; i++) {
        if (stopFlag) break;
        say('api-msg', 'Durumlar yenileniyor: ' + (i + 1) + '/' + list.length, false);
        var j = await apiGet('/user/' + list[i].id + '/basic', { striptags: 'true' });
        var p = (j && j.profile) || j || {};
        var st = normStatus(p.status);
        var t = targets[list[i].id];
        if (t) {
          if (st) { t.status = st; t.checkedAt = Date.now(); }
          if (p.name && !t.name) t.name = p.name;
          if (p.level) t.level = p.level;
        }
        done++;
        if (done % 5 === 0) { save(); render(false); }
        await sleep(700);
      }
      say('api-msg', (stopFlag ? 'Durduruldu. ' : 'Bitti. ') + done + ' hedefin durumu yenilendi.', false);
    } catch (e) {
      say('api-msg', (e.message || 'Hata oluştu.') + (done ? ' (' + done + ' hedef yenilendi.)' : ''), true);
    }
    $('refresh').removeAttribute('data-run');
    stopFlag = false;
    save();
    setBusy(false);
    render(true);
  }

  /* ---------- FF Scouter ---------- */
  var ffBusy = false;
  function fmtBs(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '';
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'b';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
    if (n >= 1e3) return Math.round(n / 1e3) + 'k';
    return String(Math.round(n));
  }
  function ffChip(t) {
    if (t.ff == null) return '';
    var ff = Number(t.ff);
    if (!isFinite(ff)) return '';
    var bs = t.bsHuman || fmtBs(t.bs);
    var title = 'Fair Fight tahmini' + (t.ffAt ? ' (' + ago(t.ffAt) + ' alındı)' : '') + '. Stat değeri bir tahmindir.';
    return '<span class="chip" title="' + esc(title) + '">FF ' + ff.toFixed(2) + (bs ? ' · ~' + esc(bs) : '') + '</span>';
  }
  async function fetchFF(auto) {
    if (ffBusy) return;
    var key = ffKey();
    if (!key) { say('ff-msg', 'Önce bir API anahtarı kaydet.', true); return; }
    var ids = all().map(function (t) { return t.id; });
    if (!ids.length) { say('ff-msg', 'Önce listeye hedef ekle.', true); return; }
    ffBusy = true;
    $('ff-fetch').disabled = true;
    say('ff-msg', 'FF Scouter değerleri alınıyor…', false);
    try {
      var got = 0;
      for (var i = 0; i < ids.length; i += 200) {
        var u = new URL('https://ffscouter.com/api/v1/get-stats');
        u.searchParams.set('key', key);
        u.searchParams.set('targets', ids.slice(i, i + 200).join(','));
        var r;
        try { r = await gmFetch(u.toString()); }
        catch (e) { throw new Error('FF Scouter\'a bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın ffscouter.com\'a istek atmasını engelliyor olabilir.'); }
        var j;
        try { j = await r.json(); } catch (e) { throw new Error('FF Scouter okunabilir bir yanıt vermedi (HTTP ' + r.status + ').'); }
        if (!Array.isArray(j)) {
          showRaw(j);
          var m = j && (j.error || j.message);
          if (r.status === 429) throw new Error('FF Scouter çok sık istek geldiğini söylüyor. Bir dakika bekle.');
          throw new Error('FF Scouter hata verdi' + (m ? ': ' + (typeof m === 'string' ? m : JSON.stringify(m)) : '') + '. Anahtarın ffscouter.com\'da kayıtlı olduğundan emin ol.');
        }
        j.forEach(function (it) {
          var t = targets[String(it && it.player_id)];
          if (!t || it.fair_fight == null) return;
          t.ff = it.fair_fight;
          t.bs = it.bs_estimate;
          t.bsHuman = it.bs_estimate_human || '';
          t.ffAt = Date.now();
          got++;
        });
        if (i + 200 < ids.length) await sleep(600);
      }
      save();
      render(true);
      setFfWorked();
      say('ff-msg', got ? got + ' hedef için FF değeri alındı.' : 'FF Scouter bu hedefler için tahmin vermedi.', !got);
    } catch (e) {
      say('ff-msg', e.message || 'FF değerleri alınamadı.', true);
    }
    ffBusy = false;
    $('ff-fetch').disabled = false;
  }

  /* ---------- kendi statların ve kolay hedef ---------- */
  var MY_LS = 'torn-mystats-v1';
  var my = { total: 0, str: 0, def: 0, spd: 0, dex: 0, manual: false, at: 0 };
  var found = [];
  function loadMy() { try { var r = LS.getItem(MY_LS); if (r) Object.assign(my, JSON.parse(r)); } catch (e) {} }
  function saveMy() { try { LS.setItem(MY_LS, JSON.stringify(my)); } catch (e) {} }
  function parseHuman(str) {
    var m = String(str || '').trim().toLowerCase().replace(/\s/g, '').replace(',', '.').match(/^(\d+(?:\.\d+)?)([kmb]?)$/);
    if (!m) return null;
    return parseFloat(m[1]) * { '': 1, k: 1e3, m: 1e6, b: 1e9 }[m[2]];
  }
  function fmtFull(n) { return Math.round(n).toLocaleString(loc()); }
  function deepFind(o, key, depth) {
    depth = depth || 0;
    if (!o || typeof o !== 'object' || depth > 4) return undefined;
    if (Object.prototype.hasOwnProperty.call(o, key)) return o[key];
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length; i++) { var r = deepFind(o[ks[i]], key, depth + 1); if (r !== undefined) return r; }
    return undefined;
  }
  function statNum(v) {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v !== '' && !isNaN(v)) return Number(v);
    if (v && typeof v === 'object') {
      if (typeof v.value === 'number') return v.value;
      if (typeof v.total === 'number') return v.total;
    }
    return null;
  }
  function renderStats() {
    var el = $('mystats');
    if (!my.total) { el.innerHTML = '<span>Henüz stat yok. Torn\'dan çek ya da toplamı elle yaz.</span>'; return; }
    var cells = [['Toplam', my.total]];
    if (my.str) cells.push(['Güç', my.str]);
    if (my.def) cells.push(['Savunma', my.def]);
    if (my.spd) cells.push(['Hız', my.spd]);
    if (my.dex) cells.push(['Çeviklik', my.dex]);
    el.innerHTML = cells.map(function (c) { return '<div>' + c[0] + '<b>' + fmtFull(c[1]) + '</b></div>'; }).join('') +
      '<div>Kaynak<b style="font-size:13px">' + (my.manual ? 'elle girildi' : 'Torn, ' + esc(ago(my.at))) + '</b></div>';
  }
  async function fetchMyStats() {
    if (!getKey()) { say('stats-msg', 'Önce Torn API anahtarını kaydet.', true); return; }
    say('stats-msg', 'Statların alınıyor…', false);
    try {
      var j = await apiGet('/user/battlestats', {});
      var s1 = statNum(deepFind(j, 'strength')), d1 = statNum(deepFind(j, 'defense')), sp = statNum(deepFind(j, 'speed')), dx = statNum(deepFind(j, 'dexterity')), t = statNum(deepFind(j, 'total'));
      if (t == null && s1 != null && d1 != null && sp != null && dx != null) t = s1 + d1 + sp + dx;
      if (!t) { showRaw(j); throw new Error('Torn\'un yanıtından statlarını okuyamadım. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim. Toplamı elle de yazabilirsin.'); }
      my = { total: t, str: s1 || 0, def: d1 || 0, spd: sp || 0, dex: dx || 0, manual: false, at: Date.now() };
      saveMy(); renderStats(); render(true); renderFound();
      say('stats-msg', 'Statların güncellendi.', false);
    } catch (e) { say('stats-msg', e.message || 'Statlar alınamadı.', true); }
  }
  function setManualTotal() {
    var v = parseHuman($('my-total').value);
    if (!v || v < 1000) { say('stats-msg', 'Toplam statı 850m, 1.2b ya da 950000000 gibi yaz.', true); return; }
    my = { total: v, str: 0, def: 0, spd: 0, dex: 0, manual: true, at: Date.now() };
    saveMy(); renderStats(); render(true); renderFound();
    $('my-total').value = '';
    say('stats-msg', 'Toplam stat kaydedildi.', false);
  }
  function ratioOf(t) {
    var bs = Number(t.bs);
    return (my.total && isFinite(bs) && bs > 0) ? bs / my.total : null;
  }
  function easyLimit() { return parseFloat($('fd-ratio').value) || 2; }
  function ratioChip(t) {
    var f = Number(t.ff);
    if (t.ff == null || !isFinite(f)) return '';
    var label = f <= 2 ? 'Kolay' : (f <= 3.5 ? 'Orta' : 'Zor');
    var cls = f <= 2 ? ' ok' : (f <= 3.5 ? '' : ' warn');
    var r = ratioOf(t);
    var pct = r == null ? '' : Math.round(r * 100);
    var title = 'FF ' + f.toFixed(2) + ' (FF Scouter: 2 ve altı kolay, 3.5 üstü zor).' + (pct === '' ? '' : ' Rakibin tahmini statı seninkinin yaklaşık %' + pct + ' kadarı.') + ' Tahmin kesin değildir.';
    return '<span class="chip' + cls + '" title="' + esc(title) + '">' + label + (pct === '' ? '' : ' · %' + pct) + '</span>';
  }
  function clampInt(v, lo, hi, d) { var n = parseInt(v, 10); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; }
  /* ---------- görülenler ve yeni aday arama ---------- */
  var SEEN_LS = 'torn-gorulen-v1';
  var seen = {}, seenN = 0, seenTimer = null, seenArm = null;
  function renderSeen() { var bt = $('seen-reset'); if (bt && !seenArm) bt.textContent = 'Görülenleri sıfırla (' + seenN + ')'; }
  function loadSeen() {
    try { var r = LS.getItem(SEEN_LS); if (r) JSON.parse(r).forEach(function (id) { if (!seen[id]) { seen[id] = 1; seenN++; } }); } catch (e) {}
    renderSeen();
  }
  function saveSeen() {
    var ids = Object.keys(seen);
    if (ids.length > 30000) ids = ids.slice(-30000);
    try { LS.setItem(SEEN_LS, JSON.stringify(ids)); } catch (e) {}
    renderSeen();
  }
  function markSeen(id) {
    if (!id || seen[id]) return;
    seen[id] = 1; seenN++;
    clearTimeout(seenTimer);
    seenTimer = setTimeout(saveSeen, 400);
  }
  var findBusy = false, findStop = false;
  async function ffQuery(key, rg, o) {
    var u = new URL('https://ffscouter.com/api/v1/get-targets');
    u.searchParams.set('key', key);
    u.searchParams.set('minlevel', rg.lo);
    u.searchParams.set('maxlevel', rg.hi);
    if (rg.f0 > 1) u.searchParams.set('minff', rg.f0.toFixed(2));
    u.searchParams.set('maxff', rg.f1.toFixed(2));
    u.searchParams.set('inactiveonly', o.inactive ? 1 : 0);
    u.searchParams.set('factionless', o.faction ? 1 : 0);
    u.searchParams.set('limit', 50);
    var r;
    try { r = await gmFetch(u.toString()); }
    catch (e) { throw new Error('FF Scouter servisine bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın ffscouter.com adresine istek atmasını engelliyor olabilir.'); }
    var j;
    try { j = await r.json(); } catch (e) { throw new Error('FF Scouter okunabilir bir yanıt vermedi (HTTP ' + r.status + ').'); }
    var list = pickList(j);
    if (!list) {
      showRaw(j);
      var m = j && (j.error || j.message);
      if (r.status === 429) throw new Error('FF Scouter çok sık istek geldiğini söylüyor. Bir dakika bekle.');
      throw new Error('FF Scouter aday listesi vermedi' + (m ? ': ' + (typeof m === 'string' ? m : JSON.stringify(m)) : '') + '. Anahtarın ffscouter.com sitesinde kayıtlı olduğundan emin ol.');
    }
    return list;
  }
  /* Sunucu istek başına en fazla 50 aday veriyor ve sayfa atlatma yok. 50 dolu dönen aralık
     önce seviyeye, seviye tek kalınca FF aralığına bölünüp yeniden sorulur. */
  async function searchNew(o) {
    var queue = [{ lo: o.lo, hi: o.hi, f0: 1, f1: o.capFF }];
    var maxCalls = o.maxCalls || 40;
    var res = { items: [], scanned: 0, skipped: 0, calls: 0, noBs: 0, capped: false, error: null };
    var have = {};
    try {
      while (queue.length && res.items.length < o.want && !o.stop()) {
        if (res.calls >= maxCalls) { res.capped = true; break; }
        var rg = queue.shift();
        o.progress(res.calls + 1, res.items.length);
        var list = await ffQuery(o.key, rg, o);
        res.calls++;
        res.scanned += list.length;
        list.map(mapCand).forEach(function (c) {
          if (!c.id || have[c.id]) return;
          have[c.id] = 1;
          var fv = Number(c.ff);
          if (c.ff == null || !isFinite(fv)) { res.noBs++; return; }
          if (fv > o.capFF + 0.005) return;
          if ((o.dropListed && targets[c.id]) || (o.skipSeen && seen[c.id])) { res.skipped++; return; }
          if (res.items.length < o.want) res.items.push(c);
        });
        if (list.length >= 50 && res.items.length < o.want) {
          if (rg.hi > rg.lo) {
            var mid = Math.floor((rg.lo + rg.hi) / 2);
            queue.push({ lo: rg.lo, hi: mid, f0: rg.f0, f1: rg.f1 }, { lo: mid + 1, hi: rg.hi, f0: rg.f0, f1: rg.f1 });
          } else if (rg.f1 - rg.f0 > 0.06) {
            var fm = (rg.f0 + rg.f1) / 2;
            queue.push({ lo: rg.lo, hi: rg.hi, f0: rg.f0, f1: fm }, { lo: rg.lo, hi: rg.hi, f0: fm, f1: rg.f1 });
          }
        }
        if (queue.length && res.items.length < o.want) await sleep(1200);
      }
    } catch (e) {
      if (!res.items.length) throw e;
      res.error = e.message || 'Arama yarıda kesildi.';
    }
    return res;
  }
  function searchOpts(extra) {
    var lo = clampInt($('fd-min').value, 1, 100, 1), hi = clampInt($('fd-max').value, 1, 100, 100);
    if (lo > hi) { var tmp = lo; lo = hi; hi = tmp; }
    var capFF = easyLimit();
    var mf = parseFloat(String($('fd-maxff').value).replace(',', '.'));
    if (isFinite(mf) && mf >= 1) capFF = Math.min(capFF, mf);
    var o = { key: ffKey(), lo: lo, hi: hi, capFF: capFF, skipSeen: $('fd-unseen').checked, inactive: $('fd-inactive').checked, faction: $('fd-faction').checked };
    return Object.assign(o, extra);
  }
  async function findTargets() {
    if (findBusy) { findStop = true; return; }
    if (!ffKey()) { say('find-msg', 'Önce bir API anahtarı kaydet.', true); return; }
    var want = clampInt($('fd-limit').value, 1, 50, 50);
    var minNwF = parseHuman($('fd-nw').value), nwFailed = 0;
    findBusy = true; findStop = false;
    $('find-go').textContent = 'Durdur';
    say('find-msg', 'Yeni adaylar aranıyor…', false);
    try {
      var res = await searchNew(searchOpts({
        want: want,
        dropListed: $('fd-unseen').checked,
        progress: function (c, n) { say('find-msg', 'Yeni adaylar aranıyor: ' + c + '. istek, ' + n + '/' + want + ' bulundu', false); },
        stop: function () { return findStop; }
      }));
      found = res.items.slice();
      found.sort(function (a, b) { return (Number(b.ff) || 0) - (Number(a.ff) || 0); });
      if (!(minNwF || $('fd-nw-show').checked)) {
        found.forEach(function (c) { markSeen(c.id); });
      } else if (found.length) {
        var kept = [];
        for (var q = 0; q < found.length; q++) {
          if (findStop) break;
          say('find-msg', 'Networth kontrol ediliyor: ' + (q + 1) + '/' + found.length, false);
          try {
            var nv = await fetchNetworth(found[q].id);
            found[q].nw = nv;
            if (!minNwF || nv >= minNwF) kept.push(found[q]);
          } catch (e2) {
            if (e2.code === 2 || e2.code === 5 || e2.code === 16 || e2.net) { found = kept; throw e2; }
            nwFailed++;
            if (!minNwF) kept.push(found[q]);
          }
          markSeen(found[q].id);
          await sleep(700);
        }
        found = kept;
        found.sort(function (a, b) {
          var na = a.nw == null ? -Infinity : a.nw, nb = b.nw == null ? -Infinity : b.nw;
          return (nb - na) || ((Number(b.ff) || 0) - (Number(a.ff) || 0));
        });
      }
      renderFound();
      var msg;
      if (!res.items.length) {
        msg = res.skipped ? 'Yeni aday çıkmadı: ' + res.scanned + ' aday tarandı, ' + res.skipped + ' tanesi daha önce görüldüğü için atlandı. "Görülenleri sıfırla" düğmesini kullan ya da seviye ve FF ayarlarını gevşet.'
                          : 'FF Scouter bu filtrelerle aday bulamadı. Seviye aralığını genişlet.';
      } else {
        msg = res.items.length + ' yeni aday bulundu' + (minNwF ? ', ' + found.length + ' tanesi networth şartına uyuyor' : '') + '. ' + res.scanned + ' aday tarandı' + (res.skipped ? ', ' + res.skipped + ' tanesi daha önce görüldüğü için atlandı' : '') + ' (' + res.calls + ' istek).';
      }
      if (res.noBs) msg += ' ' + res.noBs + ' adayın FF değeri yok.';
      if (nwFailed) msg += ' ' + nwFailed + ' adayın networth değeri alınamadı.';
      if (res.capped) msg += ' Arama istek sınırına ulaştı, durdu.';
      if (findStop) msg += ' Durduruldu.';
      if (res.error) msg += ' Arama yarıda kesildi: ' + res.error;
      say('find-msg', msg, !res.items.length || !!res.error);
    } catch (e) { renderFound(); say('find-msg', e.message || 'Adaylar alınamadı.', true); }
    findBusy = false; findStop = false;
    $('find-go').textContent = 'Hedefleri bul';
  }
  function foundHtml(c) {
    var inList = !!targets[c.id];
    var ff = Number(c.ff);
    var bs = c.bsHuman || fmtBs(Number(c.bs));
    return '<li class="row" data-fid="' + esc(c.id) + '">' +
      '<div class="who"><span class="name' + (c.name ? '' : ' empty') + '">' + esc(c.name || 'isimsiz') + '</span>' +
      '<span class="uid">#' + esc(c.id) + (c.level ? ' · Sv ' + esc(c.level) : '') + '</span>' + ratioChip(c) + nwChip(c) + '</div>' +
      (inList ? '<span class="atk add" aria-disabled="true">Listede</span>' : '<button type="button" class="atk add" data-add="' + esc(c.id) + '">Ekle</button>') +
      '<div class="meta">' + (isFinite(ff) && c.ff != null ? '<span>FF ' + ff.toFixed(2) + '</span>' : '') + (bs ? '<span>~' + esc(bs) + '</span>' : '') + '</div>' +
      '<div class="acts"><a class="link" href="' + esc(profUrl(c.id)) + '" target="_blank" rel="noopener noreferrer">Profil</a></div></li>';
  }
  function renderFound() {
    var ul = $('found');
    ul.hidden = !found.length;
    ul.innerHTML = found.map(foundHtml).join('');
    $('find-addall').hidden = !found.some(function (c) { return !targets[c.id]; });
  }
  function addCandidate(c) {
    markSeen(c.id);
    if (targets[c.id]) return false;
    var t = { id: c.id, name: c.name || '', note: '', addedAt: Date.now(), attacks: 0, lastAttack: 0 };
    if (c.level) t.level = c.level;
    if (c.nw != null) { t.nw = c.nw; t.nwAt = Date.now(); }
    if (c.ff != null) { t.ff = c.ff; t.bs = c.bs; t.bsHuman = c.bsHuman; t.ffAt = Date.now(); }
    targets[c.id] = t;
    return true;
  }

  /* ---------- networth ve mug tavanı ---------- */
  var MUG_RATE = 0.05;
  var nwBusy = false, nwStop = false;
  function fmtMoney(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '';
    return (n < 0 ? '-' : '') + '$' + fmtBs(Math.abs(n));
  }
  function nwExtract(o, d) {
    d = d || 0;
    if (!o || typeof o !== 'object' || d > 5) return null;
    if (o.name === 'networth') { var a = statNum(o.value); if (a != null) return a; }
    if (Object.prototype.hasOwnProperty.call(o, 'networth')) { var b = statNum(o.networth); if (b != null) return b; }
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length; i++) { var r = nwExtract(o[ks[i]], d + 1); if (r != null) return r; }
    return null;
  }
  async function fetchNetworth(id) {
    var j = await apiGet('/user/' + id + '/personalstats', { stat: 'networth' });
    var v = nwExtract(j);
    if (v == null) {
      showRaw(j);
      throw new Error('Torn networth değerini vermedi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.');
    }
    return v;
  }
  function nwChip(t) {
    if (t.nw == null || !isFinite(Number(t.nw))) return '';
    var nw = Number(t.nw);
    var cap = nw > 0 ? nw * MUG_RATE : 0;
    var title = 'Networth ' + fmtMoney(nw) + (t.nwAt ? ' (' + ago(t.nwAt) + ' alındı)' : '') + '. Mug nakdin yaklaşık yüzde 5 kadarını alır. Networth nakitten fazlasını içerdiği için bu bir tavandır, gerçek kazanç genelde çok daha düşüktür.';
    return '<span class="chip" title="' + esc(title) + '">NW ' + esc(fmtMoney(nw)) + (cap ? ' · tavan ~' + esc(fmtMoney(cap)) : '') + '</span>';
  }
  async function fetchAllNetworth() {
    if (nwBusy) { nwStop = true; return; }
    if (busy || ffBusy) { say('nw-msg', 'Önce diğer işlemin bitmesini bekle.', true); return; }
    if (!getKey()) { say('nw-msg', 'Önce Torn API anahtarını kaydet.', true); return; }
    var list = all();
    if (!list.length) { say('nw-msg', 'Önce listeye hedef ekle.', true); return; }
    nwBusy = true; nwStop = false;
    $('nw-fetch').textContent = 'Durdur';
    var done = 0;
    try {
      for (var i = 0; i < list.length; i++) {
        if (nwStop) break;
        say('nw-msg', 'Networth alınıyor: ' + (i + 1) + '/' + list.length, false);
        var v = await fetchNetworth(list[i].id);
        var t = targets[list[i].id];
        if (t) { t.nw = v; t.nwAt = Date.now(); }
        done++;
        if (done % 5 === 0) { save(); render(false); }
        await sleep(700);
      }
      say('nw-msg', (nwStop ? 'Durduruldu. ' : 'Bitti. ') + done + ' hedefin networth değeri alındı.', false);
    } catch (e) {
      say('nw-msg', (e.message || 'Hata oluştu.') + (done ? ' (' + done + ' hedef alındı.)' : ''), true);
    }
    nwBusy = false; nwStop = false;
    $('nw-fetch').textContent = 'Networth çek';
    save();
    render(true);
  }

  /* ---------- ayarlar, sayaç, mug koruması ---------- */
  var SET_LS = 'torn-ayar-v1', LOG_LS = 'torn-attacklog-v1';
  var cfg = { gap: 10, auto: true, mug: false, keys: false, level: 0, bonus: 0, mult: 1 };
  var alog = { log: [], resetAt: 0, todayFrom: 0 };
  function loadCfg() { try { var r = LS.getItem(SET_LS); if (r) Object.assign(cfg, JSON.parse(r)); } catch (e) {} }
  function saveCfg() { try { LS.setItem(SET_LS, JSON.stringify(cfg)); } catch (e) {} }
  function loadLog() {
    try {
      var r = LS.getItem(LOG_LS);
      if (r) { var o = JSON.parse(r); if (o && Array.isArray(o.log)) alog = { log: o.log, resetAt: o.resetAt || 0, todayFrom: o.todayFrom || 0 }; }
    } catch (e) {}
  }
  function saveLog() {
    if (alog.log.length > 5000) alog.log = alog.log.slice(-5000);
    try { LS.setItem(LOG_LS, JSON.stringify(alog)); } catch (e) {}
  }
  function logAttack(ts) { alog.log.push(ts || Date.now()); saveLog(); }
  function applyCfgToInputs() {
    $('q-gap').value = cfg.gap;
    $('q-auto').checked = !!cfg.auto;
    $('q-mug').checked = !!cfg.mug;
    $('q-keys').checked = !!cfg.keys;
    $('h-level').value = String(cfg.level);
    $('h-bonus').value = cfg.bonus;
    $('h-mult').value = cfg.mult;
  }
  function numOr(v, d) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : d; }
  function readCfgInputs() {
    cfg.gap = Math.max(0, numOr($('q-gap').value, 10));
    cfg.auto = $('q-auto').checked;
    cfg.mug = $('q-mug').checked;
    cfg.keys = $('q-keys').checked;
    cfg.level = Math.min(9, Math.max(0, parseInt($('h-level').value, 10) || 0));
    cfg.bonus = Math.min(100, Math.max(0, numOr($('h-bonus').value, 0)));
    cfg.mult = Math.max(0, numOr($('h-mult').value, 1));
    saveCfg();
  }
  var MUG_PROTECT_MS = 12 * 3600000;
  function mugLeft(t) {
    if (!t.mugAt) return 0;
    var r = 1 - (Date.now() - t.mugAt) / MUG_PROTECT_MS;
    return r > 0 ? r : 0;
  }
  function mugChip(t) {
    var r = mugLeft(t);
    if (r <= 0) return '';
    return '<span class="chip warn" title="Mug sonrası kalan nakit 12 saat boyunca doğrusal azalan bir korumada. Kalan koruma yaklaşık %' + Math.round(r * 100) + '.">Mug koruması %' + Math.round(r * 100) + '</span>';
  }
  function renderHalo() {
    var el = $('halo-stats');
    if (!el) return;
    var now = Date.now(), today = 0, hour = 0, since = 0;
    alog.log.forEach(function (ts) {
      if (isToday(ts)) today++;
      if (now - ts < 3600000) hour++;
      if (ts >= alog.resetAt) since++;
    });
    var chance = Math.min(100, 35 + 5 * cfg.level + cfg.bonus);
    var per = (chance / 100) * cfg.mult;
    var fx = function (n) { var v = n * per; return v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, ''); };
    el.innerHTML =
      '<div>Tatlı şansı<b>%' + (Math.round(chance * 10) / 10) + '</b></div>' +
      '<div>Bugün saldırı<b>' + today + '</b></div>' +
      '<div>Bugün tahmini tatlı<b>~' + fx(today) + '</b></div>' +
      '<div>Son 1 saat<b>' + hour + '</b></div>' +
      '<div>Sıfırlamadan beri<b>' + since + ' · ~' + fx(since) + '</b></div>';
  }

  /* ---------- sıra modu ---------- */
  var warmBusy = false, warmErrAt = 0, warmMsg = '', lastQAtk = 0;
  function queueList() {
    var now = Date.now(), gap = (cfg.gap || 0) * 60000;
    var minNw = parseHuman($('min-nw').value), easyOnly = $('only-easy').checked, lim = easyLimit();
    var l = all().filter(function (t) {
      if (!attackable(t)) return false;
      if (t.skipUntil && t.skipUntil > now) return false;
      if (gap && t.lastAttack && t.lastAttack >= (alog.todayFrom || 0) && now - t.lastAttack < gap) return false;
      if (cfg.mug && mugLeft(t) > 0.2) return false;
      if (easyOnly) { var ef = Number(t.ff); if (t.ff == null || !isFinite(ef) || ef > lim + 0.005) return false; }
      if (minNw && (t.nw == null || t.nw < minNw)) return false;
      return true;
    });
    return order(l, cfg.mug ? 'nw' : $('sort').value);
  }
  function skipCurrent() {
    var cur = queueList()[0];
    if (!cur) return;
    targets[cur.id].skipUntil = Date.now() + 30 * 60000;
    save();
    render(true);
  }
  function renderQueue() {
    var card = $('q-card');
    if (!card) return;
    var q = queueList(), cur = q[0], now = Date.now();
    if (!cur) {
      card.innerHTML = '<p class="hint" style="margin:0">' + (all().length
        ? 'Süzgeçlere ve ara süreye uyan saldırılabilir hedef kalmadı. Hedef bulucudan "Havuzu doldur" ile yeni hedef ekleyebilir ya da ara süreyi kısaltabilirsin.'
        : 'Önce listeye hedef ekle. Hedef bulucudaki "Havuzu doldur" düğmesi bunu toplu yapar.') + '</p>';
    } else {
      var nxt = q.slice(1, 6).map(function (t) { return esc(t.name || ('#' + t.id)); }).join(', ');
      card.innerHTML = '<div class="qcard">' +
        '<div class="who"><span class="name' + (cur.name ? '' : ' empty') + '">' + esc(cur.name || 'isimsiz') + '</span>' +
        '<span class="uid">#' + esc(cur.id) + (cur.level ? ' · Sv ' + esc(cur.level) : '') + '</span>' +
        statusChip(cur) + ffChip(cur) + ratioChip(cur) + nwChip(cur) + '</div>' +
        '<div class="qmeta">' + (cur.note ? esc(cur.note) + ' · ' : '') + (cur.checkedAt ? 'Durum ' + esc(ago(cur.checkedAt)) + ' kontrol edildi' : 'Durum henüz kontrol edilmedi') + (cfg.mug ? ' · Mug modu açık, bu saldırı mug olarak işaretlenir' : '') + '</div>' +
        '<div class="qbtns"><a id="q-atk" class="atk" data-id="' + esc(cur.id) + '" href="' + esc(atkUrl(cur.id)) + '" target="_blank" rel="noopener noreferrer">Saldır</a>' +
        '<button type="button" class="btn" id="q-skip">Atla</button></div>' +
        (nxt ? '<div class="qnext">Sırada: ' + nxt + '</div>' : '') + '</div>';
    }
    var hosp = all().filter(function (t) {
      var st = stState(t);
      return t.status && (st === 'hospital' || st === 'jail') && t.status.until * 1000 > now;
    }).sort(function (a, b) { return a.status.until - b.status.until; })[0];
    $('q-info').textContent = q.length + ' hedef sırada.' +
      (hosp ? ' En yakın hastane ya da hapis çıkışı: ' + (hosp.name || ('#' + hosp.id)) + ', ' + remain(hosp.status.until - Math.floor(now / 1000)) + '.' : '') +
      (warmMsg ? ' ' + warmMsg : '');
    renderEnergy();
    if (!en.at) fetchEnergy();
    warmQueue();
    miniRender();
  }
  async function warmQueue() {
    if (!((curView === 'halloween' && fullOpen()) || miniOn('halloween')) || warmBusy || !cfg.auto || !getKey() || busy || nwBusy || ffBusy) return;
    if (warmErrAt && Date.now() - warmErrAt < 300000) return;
    warmBusy = true;
    try {
      for (var n = 0; n < 6; n++) {
        var stale = queueList().slice(0, 4).filter(function (t) { return !t.checkedAt || Date.now() - t.checkedAt > 120000; })[0];
        if (!stale) break;
        var j = await apiGet('/user/' + stale.id + '/basic', { striptags: 'true' });
        var pr = (j && j.profile) || j || {};
        var st = normStatus(pr.status);
        var t = targets[stale.id];
        if (t) {
          if (st) t.status = st;
          t.checkedAt = Date.now();
          if (pr.name && !t.name) t.name = pr.name;
          if (pr.level) t.level = pr.level;
        }
        warmMsg = '';
        save();
        render(false);
        await sleep(800);
      }
    } catch (e) {
      warmErrAt = Date.now();
      warmMsg = 'Otomatik durum kontrolü durdu: ' + (e.message || 'hata') + ' Beş dakika sonra yeniden denenecek.';
    }
    warmBusy = false;
  }

  /* ---------- bugünü sıfırla ---------- */
  function resetToday() {
    var n = 0;
    alog.todayFrom = Date.now();
    saveLog();
    Object.keys(targets).forEach(function (id) {
      var t = targets[id];
      if (t.mugAt) { if (mugLeft(t) > 0) n++; delete t.mugAt; }
    });
    save();
    render(true);
    return n;
  }
  var rstArm = {}, rstTimer = {};
  function bindResetToday(id, idle) {
    var bt = $(id);
    bt.addEventListener('click', function () {
      clearTimeout(rstTimer[id]);
      if (!rstArm[id]) {
        rstArm[id] = true;
        bt.textContent = 'Emin misin? Sıfırla';
        rstTimer[id] = setTimeout(function () { rstArm[id] = false; bt.textContent = idle; }, 3500);
        return;
      }
      rstArm[id] = false;
      var n = resetToday();
      bt.textContent = n ? 'Sıfırlandı · ' + n + ' mug koruması kalktı' : 'Sıfırlandı';
      rstTimer[id] = setTimeout(function () { bt.textContent = idle; }, 3500);
    });
  }

  /* ---------- enerji ---------- */
  var ENERGY_COST = 25;
  var en = { cur: null, max: null, at: 0, err: '' };
  var energyBusy = false, energyErrAt = 0;
  async function fetchEnergy() {
    if (energyBusy || !getKey()) return;
    if (energyErrAt && Date.now() - energyErrAt < 300000) return;
    energyBusy = true;
    try {
      var j = await apiGet('/user/bars', {});
      var e = deepFind(j, 'energy');
      var cur = null, max = null;
      if (e && typeof e === 'object') { cur = statNum(e.current); max = statNum(e.maximum != null ? e.maximum : e.max); }
      else if (e != null) cur = statNum(e);
      if (cur == null) { showRaw(j); throw new Error('Torn enerji değerini vermedi.'); }
      en = { cur: cur, max: max, at: Date.now(), err: '' };
      energyErrAt = 0;
    } catch (err) {
      en.err = err.message || 'Enerji alınamadı.';
      energyErrAt = Date.now();
    }
    energyBusy = false;
    renderEnergy();
  }
  function renderEnergy() { renderEnergyEl($('q-energy')); renderEnergyEl($('w-energy')); renderEnergyEl($('mini-en')); }
  function renderEnergyEl(el) {
    if (!el) return;
    if (!getKey()) { el.hidden = true; return; }
    el.hidden = false;
    if (en.cur == null) {
      el.textContent = en.err ? 'Enerji alınamadı' : 'Enerji…';
      el.title = en.err || 'Enerji Torn dan alınıyor.';
      el.className = 'qenergy';
      return;
    }
    var n = Math.floor(en.cur / ENERGY_COST);
    el.textContent = 'Enerji ' + Math.round(en.cur) + (en.max ? '/' + Math.round(en.max) : '') + ' · ' + n + ' saldırı';
    el.className = 'qenergy' + (n < 1 ? ' low' : '');
    el.title = 'Bir saldırı ' + ENERGY_COST + ' enerji harcar. Son güncelleme: ' + ago(en.at) + '.' + (en.err ? ' Son hata: ' + en.err : '');
  }

  /* ---------- havuzu doldur ---------- */
  var poolBusy = false, poolStop = false;
  function mapCand(it) {
    var id = String((it && (it.player_id != null ? it.player_id : it.id)) || '').replace(/\D/g, '');
    return { id: id, name: (it && (it.name || it.player_name)) || '', level: it && it.level, ff: it && it.fair_fight, bs: it && it.bs_estimate, bsHuman: (it && it.bs_estimate_human) || '' };
  }
  async function fillPool() {
    if (poolBusy) { poolStop = true; return; }
    if (!ffKey()) { say('find-msg', 'Önce bir API anahtarı kaydet.', true); return; }
    var want = clampInt($('fd-pool').value, 10, 1000, 200);
    poolBusy = true; poolStop = false;
    $('pool-go').textContent = 'Durdur';
    var added = 0;
    try {
      var res = await searchNew(searchOpts({
        want: want,
        dropListed: true,
        maxCalls: 60,
        progress: function (c, n) { say('find-msg', 'Havuz dolduruluyor: ' + c + '. istek, ' + n + '/' + want + ' yeni hedef bulundu', false); },
        stop: function () { return poolStop; }
      }));
      res.items.forEach(function (c) { if (addCandidate(c)) added++; });
      save();
      render(false);
      var msg = (poolStop ? 'Durduruldu. ' : 'Bitti. ') + added + ' yeni hedef listene eklendi (' + res.scanned + ' aday tarandı' + (res.skipped ? ', ' + res.skipped + ' tanesi daha önce görüldüğü için atlandı' : '') + ', ' + res.calls + ' istek).';
      if (added < want && !poolStop && !res.capped && !res.error) msg += ' FF Scouter bu süzgeçlerde daha fazla yeni oyuncu vermedi.';
      if (res.capped) msg += ' Arama istek sınırına ulaştı, durdu.';
      if (res.error) msg += ' Arama yarıda kesildi: ' + res.error;
      msg += ' Adı eksik olanlar için Durumları yenile düğmesini kullan.';
      say('find-msg', msg, !!res.error);
    } catch (e) {
      say('find-msg', e.message || 'Havuz doldurulamadı.', true);
    }
    poolBusy = false; poolStop = false;
    $('pool-go').textContent = 'Havuzu doldur';
    save();
    render(true);
    renderFound();
  }

  /* ---------- veri işlemleri ---------- */
  function addTarget(id, name, note) {
    var t = targets[id];
    if (t) {
      var changed = false;
      if (name && !t.name) { t.name = name; changed = true; }
      if (note && !t.note) { t.note = note; changed = true; }
      if (changed) save();
      return changed ? 'updated' : 'dup';
    }
    targets[id] = { id: id, name: name || '', note: note || '', addedAt: Date.now(), attacks: 0, lastAttack: 0 };
    save();
    return 'new';
  }
  function recordAttack(id, asMug) {
    var t = targets[id];
    if (!t) return;
    var now = Date.now();
    t.attacks = (t.attacks || 0) + 1;
    t.lastAttack = now;
    if (asMug) t.mugAt = now;
    save();
    logAttack(now);
    setTimeout(function () { render(true); }, 80);
  }
  function parseId(raw) {
    var s = String(raw || '').trim();
    var m = s.match(/(?:XID|user2ID)=(\d{1,10})/i) || s.match(/\[(\d{1,10})\]/) || s.match(/^#?(\d{1,10})$/);
    return m ? m[1] : null;
  }
  function parseBulk(text) {
    var out = [], skipped = 0;
    text.split(/\r?\n/).forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var m;
      if (/^[\d\s,;]+$/.test(line) && /[,;\s]/.test(line)) {
        line.split(/[\s,;]+/).forEach(function (x) { if (/^\d{1,10}$/.test(x)) out.push({ id: x }); });
        return;
      }
      if ((m = line.match(/(?:XID|user2ID)=(\d{1,10})/i))) {
        out.push({ id: m[1], name: line.replace(/https?:\/\/\S+/g, '').replace(/[\[\]]/g, '').trim() });
        return;
      }
      if (line.indexOf('\t') > -1) {
        var f = line.split('\t');
        if (/^\d{1,10}$/.test(f[0].trim())) {
          out.push({ id: f[0].trim(), name: (f[1] || '').trim(), note: (f[2] || '').trim() });
          return;
        }
      }
      if ((m = line.match(/^(.*?)\s*[\[(]\s*(\d{1,10})\s*[\])]\s*(.*)$/))) {
        out.push({ id: m[2], name: m[1].trim(), note: m[3].trim() });
        return;
      }
      if ((m = line.match(/^(\d{1,10})(?:\s*[,;:\-–]\s*|\s+)(.*)$/))) {
        out.push({ id: m[1], name: m[2].trim() });
        return;
      }
      if ((m = line.match(/^(.*?)\s*[,;:\-–]\s*(\d{1,10})$/))) {
        out.push({ id: m[2], name: m[1].trim() });
        return;
      }
      if ((m = line.match(/^(\d{1,10})$/))) { out.push({ id: m[1] }); return; }
      skipped++;
    });
    return { items: out, skipped: skipped };
  }

  /* ---------- durum, sıralama, görünüm ---------- */
  function all() { return Object.keys(targets).map(function (k) { return targets[k]; }); }
  function stState(t) { return t.status ? String(t.status.state || '').toLowerCase() : ''; }
  function isOkay(t) {
    if (!t.status) return false;
    var s = stState(t);
    if (s === 'okay') return true;
    return !!t.status.until && t.status.until * 1000 <= Date.now() && (s === 'hospital' || s === 'jail');
  }
  function attackable(t) { return !t.status || isOkay(t); }
  function order(list, how) {
    var l = list.slice();
    var byName = function (a, b) { return (a.name || '~').localeCompare(b.name || '~', 'tr') || a.id - b.id; };
    if (how === 'yeni') l.sort(function (a, b) { return (b.addedAt || 0) - (a.addedAt || 0); });
    else if (how === 'isim') l.sort(byName);
    else if (how === 'kolay') l.sort(function (a, b) {
      var fa = a.ff == null ? 1e9 : Number(a.ff), fb = b.ff == null ? 1e9 : Number(b.ff);
      return fa - fb || byName(a, b);
    });
    else if (how === 'nw') l.sort(function (a, b) {
      var na = a.nw == null ? -Infinity : a.nw, nb = b.nw == null ? -Infinity : b.nw;
      return (nb - na) || byName(a, b);
    });
    else if (how === 'ff') l.sort(function (a, b) { return (b.ff == null ? -1 : b.ff) - (a.ff == null ? -1 : a.ff) || byName(a, b); });
    else if (how === 'seviye') l.sort(function (a, b) { return (a.level || 9999) - (b.level || 9999) || byName(a, b); });
    else if (how === 'id') l.sort(function (a, b) { return a.id - b.id; });
    else if (how === 'cok') l.sort(function (a, b) { return (b.attacks || 0) - (a.attacks || 0) || byName(a, b); });
    else l.sort(function (a, b) {
      var an = a.attacks ? 1 : 0, bn = b.attacks ? 1 : 0;
      if (an !== bn) return an - bn;
      if (!an) return (a.addedAt || 0) - (b.addedAt || 0);
      return (a.lastAttack || 0) - (b.lastAttack || 0);
    });
    return l;
  }
  var STATE_TR = { okay: 'Okay', hospital: 'Hastanede', jail: 'Hapiste', traveling: 'Yolda', abroad: 'Yurtdışı', federal: 'Federal', fallen: 'Fallen' };
  function statusChip(t) {
    if (!t.status) return '';
    var s = stState(t);
    var okay = isOkay(t);
    var label = okay ? 'Okay' : (STATE_TR[s] || t.status.state || t.status.description || '?');
    var extra = '';
    if (!okay && t.status.until && t.status.until * 1000 > Date.now()) extra = ' · ' + remain(t.status.until - Math.floor(Date.now() / 1000));
    var title = (t.status.description || '') + (t.checkedAt ? ' (durum ' + ago(t.checkedAt) + ' alındı)' : '');
    return '<span class="chip ' + (okay ? 'ok' : 'warn') + '" title="' + esc(title) + '">' + esc(label + extra) + '</span>';
  }
  function rowHtml(t) {
    if (editingId === t.id) {
      return '<li class="row editing" data-id="' + esc(t.id) + '">' +
        '<div class="edit-grid">' +
        '<label>İsim<input id="e-name" type="text" maxlength="60" autocomplete="off" value="' + esc(t.name) + '"></label>' +
        '<label>Not<input id="e-note" type="text" maxlength="140" autocomplete="off" value="' + esc(t.note) + '"></label>' +
        '</div>' +
        '<div class="acts"><button type="button" class="link" data-act="save">Kaydet</button>' +
        '<button type="button" class="link" data-act="cancel">Vazgeç</button></div></li>';
    }
    var today = isToday(t.lastAttack);
    var chip = statusChip(t) + ffChip(t) + ratioChip(t) + nwChip(t) + mugChip(t);
    if (!t.attacks) chip += '<span class="chip">Yeni</span>'; else if (today) chip += '<span class="chip">Bugün</span>';
    var armed = armedDelete === t.id;
    var cb = selMode ? '<input type="checkbox" class="selbox" data-sel="' + esc(t.id) + '" aria-label="Seç"' + (selIds[t.id] ? ' checked' : '') + '>' : '';
    return '<li class="row' + (today ? ' is-today' : '') + '" data-id="' + esc(t.id) + '">' +
      '<div class="who">' + cb + '<span class="name' + (t.name ? '' : ' empty') + '">' + esc(t.name || 'isimsiz') + '</span>' +
      '<span class="uid">#' + esc(t.id) + (t.level ? ' · Sv ' + esc(t.level) : '') + '</span>' + chip + '</div>' +
      '<a class="atk" data-attack="' + esc(t.id) + '" href="' + esc(atkUrl(t.id)) + '" target="_blank" rel="noopener noreferrer">Saldır</a>' +
      '<div class="meta">' + (t.note ? '<span class="note">' + esc(t.note) + '</span>' : '') +
      '<span>' + (t.attacks || 0) + ' saldırı</span><span>' + esc(ago(t.lastAttack)) + '</span></div>' +
      '<div class="acts"><a class="link" href="' + esc(profUrl(t.id)) + '" target="_blank" rel="noopener noreferrer">Profil</a>' +
      '<button type="button" class="link" data-act="mug">Mug ettim</button>' +
      '<button type="button" class="link" data-act="edit">Düzenle</button>' +
      '<button type="button" class="link danger' + (armed ? ' armed' : '') + '" data-act="del">' + (armed ? 'Emin misin? Sil' : 'Sil') + '</button></div></li>';
  }
  function exportText() {
    var head = ['ID', 'İsim', 'Not', 'Seviye', 'Durum', 'FF', 'Tahmini stat', 'Rakip/ben %', 'Networth', 'Saldırı', 'Son saldırı', 'Saldırı linki'].join('\t');
    var clean = function (s) { return String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' '); };
    var rows = order(all(), $('sort').value).map(function (t) {
      var last = t.lastAttack ? new Date(t.lastAttack).toISOString().slice(0, 16).replace('T', ' ') : '';
      var st = t.status ? (STATE_TR[stState(t)] || t.status.state || '') : '';
      return [t.id, clean(t.name), clean(t.note), t.level || '', clean(st), t.ff == null ? '' : t.ff, clean(t.bsHuman || fmtBs(t.bs)), ratioOf(t) == null ? '' : Math.round(ratioOf(t) * 100), t.nw == null ? '' : Math.round(t.nw), t.attacks || 0, last, atkUrl(t.id)].join('\t');
    });
    return [head].concat(rows).join('\n');
  }
  function render(force) {
    var list = $('list');
    if (!force && editingId && list.contains(root.activeElement)) return;
    var items = all();
    var q = $('q').value.trim().toLowerCase();
    var onlyOk = $('only-ok').checked;
    var view = items.filter(function (t) {
      if (onlyOk && !isOkay(t)) return false;
      var minNw = parseHuman($('min-nw').value);
      if (minNw && (t.nw == null || t.nw < minNw)) return false;
      if ($('only-easy').checked) { var ef = Number(t.ff); if (t.ff == null || !isFinite(ef) || ef > easyLimit() + 0.005) return false; }
      if (!q) return true;
      return (t.name || '').toLowerCase().indexOf(q) > -1 || String(t.id).indexOf(q) > -1 || (t.note || '').toLowerCase().indexOf(q) > -1;
    });
    view = order(view, $('sort').value);
    lastView = view;

    $('st-total').textContent = items.length;
    $('st-ready').textContent = items.filter(function (t) { return isOkay(t); }).length;
    $('st-today').textContent = items.filter(function (t) { return isToday(t.lastAttack); }).length;

    $('empty').hidden = items.length > 0;
    list.hidden = items.length === 0;
    if (items.length > 0) {
      list.innerHTML = view.length ? view.map(rowHtml).join('') :
        '<li class="row" style="grid-template-areas:\'who\';grid-template-columns:1fr"><div class="who"><span class="name empty">Eşleşen hedef yok</span></div></li>';
    }

    renderSel();
    var next = $('next');
    if (items.length) {
      var sorted = order(items, 'sira');
      var n = sorted.filter(attackable)[0] || sorted[0];
      next.hidden = false;
      next.href = atkUrl(n.id);
      next.setAttribute('data-attack', n.id);
      next.title = (n.name || 'isimsiz') + ' #' + n.id;
    } else {
      next.hidden = true;
      next.removeAttribute('data-attack');
    }
    $('key-del').hidden = !getKey();
    renderQueue();
    renderHalo();
    if ($('xls-box').open) $('xls').value = exportText();
    if (editingId && force === 'focus') {
      var en = $('e-name');
      if (en) { en.focus(); en.select(); }
    }
  }

  /* ---------- olaylar ---------- */
  $('key-save').addEventListener('click', function () {
    var v = $('api-key').value.trim();
    if (!v) { say('api-msg', getKey() ? 'Kayıtlı anahtar kullanılıyor. Değiştirmek için yenisini yapıştır.' : 'Önce anahtarı yapıştır.', !getKey()); if (getKey()) syncTargets(false); return; }
    if (!/^[A-Za-z0-9]{12,32}$/.test(v)) { say('api-msg', 'Anahtar 16 harf ve rakamdan oluşur. Boşluk veya fazladan karakter olmasın.', true); return; }
    setKey(v);
    $('api-key').value = '';
    $('api-key').placeholder = 'Anahtar kayıtlı. Değiştirmek için yenisini yapıştır';
    render(false);
    syncTargets(false);
  });
  $('key-del').addEventListener('click', function () {
    setKey('');
    $('api-key').placeholder = 'Limited Access anahtarını yapıştır';
    say('api-msg', 'Anahtar bu tarayıcıdan silindi.', false);
    render(false);
  });
  $('pool-go').addEventListener('click', fillPool);
  $('seen-reset').addEventListener('click', function () {
    var bt = $('seen-reset');
    if (!seenArm) {
      seenArm = setTimeout(function () { seenArm = null; renderSeen(); }, 3500);
      bt.textContent = 'Emin misin? Sıfırla';
      return;
    }
    clearTimeout(seenArm); seenArm = null;
    seen = {}; seenN = 0;
    saveSeen();
    say('find-msg', 'Görülen oyuncu kaydı sıfırlandı. Listendeki hedefler yine de tekrar gösterilmez.', false);
  });
  ['q-gap', 'q-auto', 'q-mug', 'q-keys', 'h-level', 'h-bonus', 'h-mult'].forEach(function (id) {
    $(id).addEventListener('change', function () { readCfgInputs(); render(true); });
  });
  $('q-card').addEventListener('click', function (ev) {
    var a = ev.target.closest('#q-atk');
    if (a) {
      var now = Date.now();
      if (now - lastQAtk < 400) { ev.preventDefault(); return; }
      lastQAtk = now;
      recordAttack(a.getAttribute('data-id'), cfg.mug);
      setTimeout(fetchEnergy, 15000);
      return;
    }
    if (ev.target.closest('#q-skip')) skipCurrent();
  });
  root.addEventListener('keydown', function (ev) {
    var on = curView === 'war' ? wcfg.keys : (curView === 'halloween' ? cfg.keys : false);
    if (!on || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var tag = ev.target && ev.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'SUMMARY' || tag === 'BUTTON' || tag === 'A') return;
    if (ev.key === 'Enter') { var a = $(curView === 'war' ? 'w-atk' : 'q-atk'); if (a) { ev.preventDefault(); a.click(); } }
    else if (ev.key === 's' || ev.key === 'S') { if (curView === 'war') warSkipCurrent(); else skipCurrent(); }
  });
  $('h-plus').addEventListener('click', function () { logAttack(Date.now()); renderHalo(); });
  $('h-minus').addEventListener('click', function () { alog.log.pop(); saveLog(); renderHalo(); });
  bindResetToday('h-today', 'Bugünü sıfırla');
  bindResetToday('top-today', 'Bugünü sıfırla');
  $('h-reset').addEventListener('click', function () { alog.resetAt = Date.now(); saveLog(); renderHalo(); });
  $('nw-fetch').addEventListener('click', fetchAllNetworth);
  $('min-nw').addEventListener('input', function () { render(true); });
  $('stats-fetch').addEventListener('click', fetchMyStats);
  $('stats-set').addEventListener('click', setManualTotal);
  $('my-total').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); setManualTotal(); } });
  $('find-go').addEventListener('click', findTargets);
  $('fd-ratio').addEventListener('change', function () { render(true); });
  $('only-easy').addEventListener('change', function () { render(true); });
  $('find-addall').addEventListener('click', function () {
    var n = 0;
    found.forEach(function (c) { if (addCandidate(c)) n++; });
    save(); render(true); renderFound();
    say('find-msg', n + ' hedef listene eklendi.', false);
  });
  $('found').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-add]');
    if (!b) return;
    var c = found.filter(function (x) { return x.id === b.getAttribute('data-add'); })[0];
    if (c && addCandidate(c)) { save(); render(true); renderFound(); say('find-msg', '#' + c.id + ' listene eklendi.', false); }
  });
  $('ff-key').addEventListener('change', function () {
    var v = $('ff-key').value.trim();
    if (!v) return;
    if (!/^[A-Za-z0-9]{12,32}$/.test(v)) { say('ff-msg', 'Anahtar harf ve rakamdan oluşur. Boşluk veya fazladan karakter olmasın.', true); return; }
    setFfKey(v);
    $('ff-key').value = '';
    $('ff-key').placeholder = 'FF anahtarı kayıtlı';
    say('ff-msg', 'FF Scouter anahtarı kaydedildi.', false);
  });
  $('ff-fetch').addEventListener('click', function () {
    var v = $('ff-key').value.trim();
    if (v && /^[A-Za-z0-9]{12,32}$/.test(v)) { setFfKey(v); $('ff-key').value = ''; $('ff-key').placeholder = 'FF anahtarı kayıtlı'; }
    fetchFF(false);
  });
  $('sync').addEventListener('click', function () { syncTargets(false); });
  $('refresh').addEventListener('click', refreshStatuses);

  $('add-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var id = parseId($('f-id').value);
    if (!id) { say('add-msg', 'Geçerli bir oyuncu ID\'si yaz. Profil linkini de yapıştırabilirsin.', true); return; }
    var res = addTarget(id, $('f-name').value.trim(), $('f-note').value.trim());
    if (res === 'new') say('add-msg', '#' + id + ' listeye eklendi.', false);
    else if (res === 'updated') say('add-msg', '#' + id + ' zaten listede, eksik bilgiler tamamlandı.', false);
    else say('add-msg', '#' + id + ' zaten listede.', true);
    $('f-id').value = ''; $('f-name').value = ''; $('f-note').value = '';
    $('f-id').focus();
    render(true);
  });
  $('q').addEventListener('input', function () { render(true); });
  $('sort').addEventListener('change', function () { render(true); });
  $('only-ok').addEventListener('change', function () { render(true); });

  $('bulk-go').addEventListener('click', function () {
    var res = parseBulk($('bulk').value);
    if (!res.items.length) { say('bulk-msg', 'Okunabilen ID bulunamadı.', true); return; }
    var added = 0, dup = 0;
    res.items.forEach(function (it) {
      var r = addTarget(it.id, it.name || '', it.note || '');
      if (r === 'new') added++; else dup++;
    });
    $('bulk').value = '';
    say('bulk-msg', added + ' yeni hedef eklendi' + (dup ? ', ' + dup + ' tanesi zaten vardı' : '') + (res.skipped ? ', ' + res.skipped + ' satır okunamadı' : '') + '.', false);
    render(true);
  });

  $('xls-box').addEventListener('toggle', function () { if ($('xls-box').open) $('xls').value = exportText(); });
  $('xls-copy').addEventListener('click', function () {
    var ta = $('xls');
    ta.value = exportText();
    function fallback() {
      ta.focus(); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      say('xls-msg', ok ? 'Kopyalandı.' : 'Metni seçtim. Ctrl+C ile kopyala.', !ok);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(function () { say('xls-msg', 'Kopyalandı.', false); }, fallback);
        return;
      }
    } catch (e) {}
    fallback();
  });

  function saveEdit(id) {
    var t = targets[id];
    if (t) {
      t.name = $('e-name').value.trim();
      t.note = $('e-note').value.trim();
      save();
    }
    editingId = null;
    render(true);
  }
  function selCount() { return Object.keys(selIds).filter(function (k) { return targets[k]; }).length; }
  function renderSel() {
    $('selbar').hidden = !selMode;
    $('sel-mode').textContent = selMode ? 'Toplu seçimi kapat' : 'Toplu seç';
    if (!selMode) return;
    var n = selCount();
    $('sel-cnt').textContent = n + ' seçili';
    $('sel-del').disabled = n === 0;
    $('sel-del').classList.toggle('armed', selArm && n > 0);
    $('sel-del').textContent = selArm && n > 0 ? 'Emin misin? ' + n + ' hedefi sil' : 'Seçilenleri sil';
  }
  function selDisarm() { selArm = false; clearTimeout(selTimer); }
  $('sel-mode').addEventListener('click', function () { selMode = !selMode; if (!selMode) selIds = {}; selDisarm(); render(true); });
  $('sel-off').addEventListener('click', function () { selMode = false; selIds = {}; selDisarm(); render(true); });
  $('sel-vis').addEventListener('click', function () { lastView.forEach(function (t) { selIds[t.id] = true; }); selDisarm(); render(true); });
  $('sel-none').addEventListener('click', function () { selIds = {}; selDisarm(); render(true); });
  $('sel-del').addEventListener('click', function () {
    var n = selCount();
    if (!n) return;
    if (!selArm) {
      selArm = true; clearTimeout(selTimer);
      selTimer = setTimeout(function () { selArm = false; renderSel(); }, 4000);
      renderSel();
      return;
    }
    Object.keys(selIds).forEach(function (k) { delete targets[k]; });
    selIds = {}; selDisarm(); selMode = false;
    save(); render(true);
    say('status', n + ' hedef silindi.', false);
  });
  $('list').addEventListener('change', function (ev) {
    var c = ev.target.closest('input[data-sel]');
    if (!c) return;
    var id = c.getAttribute('data-sel');
    if (c.checked) selIds[id] = true; else delete selIds[id];
    selDisarm(); renderSel();
  });
  $('list').addEventListener('click', function (ev) {
    var a = ev.target.closest('a[data-attack]');
    if (a) { recordAttack(a.getAttribute('data-attack')); return; }
    var b = ev.target.closest('button[data-act]');
    if (!b) return;
    var row = b.closest('.row');
    var id = row && row.getAttribute('data-id');
    var act = b.getAttribute('data-act');
    if (act === 'edit') { editingId = id; armedDelete = null; render('focus'); }
    else if (act === 'cancel') { editingId = null; render(true); }
    else if (act === 'save') { saveEdit(id); }
    else if (act === 'mug') { if (targets[id]) { targets[id].mugAt = Date.now(); save(); render(true); } }
    else if (act === 'del') {
      if (armedDelete === id) {
        clearTimeout(armTimer);
        armedDelete = null;
        delete targets[id];
        save();
        render(true);
      } else {
        armedDelete = id;
        clearTimeout(armTimer);
        armTimer = setTimeout(function () { armedDelete = null; render(false); }, 3500);
        render(true);
      }
    }
  });
  $('list').addEventListener('keydown', function (ev) {
    if (!editingId) return;
    if (ev.key === 'Enter' && ev.target.tagName === 'INPUT') { ev.preventDefault(); saveEdit(editingId); }
    else if (ev.key === 'Escape') { editingId = null; render(true); }
  });
  $('next').addEventListener('click', function () {
    var id = $('next').getAttribute('data-attack');
    if (id) recordAttack(id);
  });

  /* ---------- görünümler ---------- */
  var curView = null;
  var hInit = false;
  function lsGet(k) { try { return LS.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { LS.setItem(k, v); } catch (e) {} }
  function placeKey(name) {
    var hostId = name === 'halloween' ? 'key-host-h' : (name === 'war' ? 'key-host-war' : (name === 'fac' ? 'key-host-fac' : (name === 'trv' ? 'key-host-trv' : 'key-host-home')));
    ['key-host-h', 'key-host-war', 'key-host-fac', 'key-host-trv', 'key-host-home'].forEach(function (id) { $(id).hidden = (id !== hostId); });
    $(hostId).appendChild($('keysec'));
  }
  function showView(name) {
    if (['home', 'war', 'halloween', 'fac', 'trv'].indexOf(name) < 0) name = 'home';
    ['home', 'war', 'halloween', 'fac', 'trv'].forEach(function (v) { $('view-' + v).hidden = (v !== name); });
    curView = name;
    shell.setAttribute('data-mode', name);
    placeKey(name);
    if (name !== 'home') lsSet('torn-mod-son', name);
    if (fullOpen()) enterCurView(name);
    try { shell.scrollTop = 0; } catch (e) {}
  }
  function enterCurView(name) {
    if (name === 'halloween') enterHalloween();
    else if (name === 'war') enterWar();
    else if (name === 'fac') renderFac();
    else if (name === 'trv') enterTrv();
  }
  function enterHalloween() {
    if (!hInit) {
      hInit = true;
      if (getKey() && !my.manual && (!my.total || Date.now() - my.at > 3600000)) fetchMyStats();
      if (getKey()) syncTargets(true);
    }
    render(true);
  }

  /* ---------- Ranked War modu ---------- */
  var WAR_LS = 'torn-war-v1', WCFG_LS = 'torn-war-ayar-v1';
  var war = { fid: '', members: {}, fetchedAt: 0, hits: [], resetAt: 0, skip: {}, last: {}, ff: {} };
  var wcfg = { ffmin: 2, ffmax: 3, sort: 'ffdesc', okay: true, gap: 30, auto: true, keys: false };
  var warBusy = false, warErrAt = 0, wLastAtk = 0, wArm = false, wArmTimer = null;
  function loadWar() {
    try {
      var r = LS.getItem(WAR_LS);
      if (r) { var o = JSON.parse(r); war.members = o.members || {}; war.fetchedAt = o.fetchedAt || 0; war.fid = o.fid || ''; war.hits = Array.isArray(o.hits) ? o.hits : []; war.resetAt = o.resetAt || 0; war.skip = o.skip || {}; war.last = o.last || {}; war.ff = o.ff || {}; }
    } catch (e) {}
    try { var c = LS.getItem(WCFG_LS); if (c) Object.assign(wcfg, JSON.parse(c)); } catch (e) {}
  }
  function saveWar() {
    if (war.hits.length > 3000) war.hits = war.hits.slice(-3000);
    lsSet(WAR_LS, JSON.stringify({ members: war.members, fetchedAt: war.fetchedAt, fid: war.fid, hits: war.hits, resetAt: war.resetAt, skip: war.skip, last: war.last, ff: war.ff }));
  }
  function applyWarCfg() {
    $('w-fid').value = war.fid;
    $('w-ffmin').value = wcfg.ffmin;
    $('w-ffmax').value = wcfg.ffmax;
    $('w-sort').value = wcfg.sort;
    $('w-gap').value = wcfg.gap;
    $('w-okay').checked = !!wcfg.okay;
    $('w-auto').checked = !!wcfg.auto;
    $('w-keys').checked = !!wcfg.keys;
  }
  function readWarCfg() {
    wcfg.ffmin = numOr($('w-ffmin').value, 2);
    wcfg.ffmax = numOr($('w-ffmax').value, 3);
    wcfg.sort = $('w-sort').value;
    wcfg.gap = Math.max(0, numOr($('w-gap').value, 30));
    wcfg.okay = $('w-okay').checked;
    wcfg.auto = $('w-auto').checked;
    wcfg.keys = $('w-keys').checked;
    lsSet(WCFG_LS, JSON.stringify(wcfg));
  }
  function parseFid(raw) {
    var s = String(raw || '').trim();
    var m = s.match(/[?&]ID=(\d{1,8})/i) || s.match(/^#?(\d{1,8})$/) || s.match(/(\d{1,8})\s*$/);
    return m ? m[1] : null;
  }
  function pickMembers(j) {
    if (!j || typeof j !== 'object') return null;
    if (Array.isArray(j)) return j;
    var m = j.members;
    if (Array.isArray(m)) return m;
    if (m && typeof m === 'object') return Object.keys(m).map(function (k) { return Object.assign({ id: k }, m[k]); });
    var ks = Object.keys(j);
    for (var i = 0; i < ks.length; i++) {
      var v = j[ks[i]];
      if (Array.isArray(v) && v.length && v[0] && v[0].name !== undefined) return v;
    }
    return null;
  }
  function mapMember(it) {
    if (!it) return null;
    var id = String(it.id != null ? it.id : (it.user_id != null ? it.user_id : '')).replace(/\D/g, '');
    if (!id) return null;
    var la = it.last_action || {};
    return { id: id, name: it.name || '', level: it.level || 0, status: normStatus(it.status), la: { status: la.status || '', ts: statNum(la.timestamp), rel: la.relative || '' } };
  }
  function applyWarFF() {
    Object.keys(war.members).forEach(function (id) {
      var c = war.ff[id], m = war.members[id];
      if (c) { m.ff = c.ff; m.bs = c.bs; m.bsHuman = c.bsHuman; m.ffAt = c.at; }
    });
  }
  async function warFF() {
    var key = ffKey();
    if (!key) return 'FF Scouter anahtarı yok, FF gösterilmiyor.';
    var now = Date.now();
    var ids = Object.keys(war.members).filter(function (id) { var c = war.ff[id]; return !c || now - c.at > 1800000; });
    if (!ids.length) return '';
    try {
      for (var i = 0; i < ids.length; i += 200) {
        var u = new URL('https://ffscouter.com/api/v1/get-stats');
        u.searchParams.set('key', key);
        u.searchParams.set('targets', ids.slice(i, i + 200).join(','));
        var r = await gmFetch(u.toString());
        var j = await r.json();
        if (!Array.isArray(j)) {
          showRaw(j);
          throw new Error(r.status === 429 ? 'FF Scouter çok sık istek geldiğini söylüyor.' : 'FF Scouter beklenmedik bir yanıt verdi. Anahtarın ffscouter.com sitesinde kayıtlı olmalı.');
        }
        j.forEach(function (it) {
          if (it && it.player_id != null && it.fair_fight != null) war.ff[String(it.player_id)] = { ff: it.fair_fight, bs: it.bs_estimate, bsHuman: it.bs_estimate_human || '', at: now };
        });
        if (i + 200 < ids.length) await sleep(600);
      }
      return '';
    } catch (e) {
      return 'FF alınamadı: ' + (e.message || 'bağlantı hatası');
    }
  }
  async function warLoad(manual) {
    if (warBusy) return;
    var fid = parseFid($('w-fid').value || war.fid);
    if (!fid) { say('w-msg', 'Geçerli bir faction ID si yaz. Profil linkini de yapıştırabilirsin.', true); return; }
    if (!getKey()) { say('w-msg', 'Önce Torn API anahtarını kaydet.', true); return; }
    warBusy = true;
    if (manual) say('w-msg', 'Üyeler çekiliyor…', false);
    try {
      var list = null, lastErr = null;
      try { list = pickMembers(await apiGet('/faction/' + fid + '/members', { striptags: 'true' })); }
      catch (e) { lastErr = e; if (e.code === 2 || e.code === 5 || e.code === 16 || e.net) throw e; }
      if (!list) {
        try { var j1 = await apiGet('/faction/' + fid, { selections: 'basic' }, ''); list = pickMembers(j1); if (!list) showRaw(j1); }
        catch (e2) { throw lastErr || e2; }
      }
      if (!list) throw new Error('Torn üye listesini vermedi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.');
      var next = {};
      list.map(mapMember).forEach(function (m) { if (m) next[m.id] = m; });
      war.members = next;
      if (war.fid !== fid) { war.fid = fid; war.skip = {}; }
      war.fetchedAt = Date.now();
      applyWarFF();
      saveWar();
      warErrAt = 0;
      renderWar();
      var ffNote = await warFF();
      applyWarFF();
      saveWar();
      renderWar();
      say('w-msg', Object.keys(next).length + ' üye alındı, son güncelleme ' + new Date().toLocaleTimeString(loc()) + '.' + (ffNote ? ' ' + ffNote : ''), !!ffNote);
    } catch (e) {
      warErrAt = Date.now();
      say('w-msg', (e.message || 'Üyeler alınamadı.') + (manual ? '' : ' Otomatik yenileme iki dakika durdu.'), true);
    }
    warBusy = false;
  }
  function wMembers() { return Object.keys(war.members).map(function (k) { return war.members[k]; }); }
  function wLeft(m) {
    var s = stState(m);
    if (!m.status || !(s === 'hospital' || s === 'jail') || !m.status.until) return 0;
    var l = m.status.until - Math.floor(Date.now() / 1000);
    return l > 0 ? l : 0;
  }
  function fmtCd(sec) {
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    return h ? h + ':' + two(m) + ':' + two(s) : two(m) + ':' + two(s);
  }
  function wStatusChip(m) {
    if (!m.status) return '';
    var s = stState(m);
    if (isOkay(m)) return '<span class="chip ok">Okay</span>';
    var label = STATE_TR[s] || m.status.state || m.status.description || '?';
    var left = m.status.until ? m.status.until - Math.floor(Date.now() / 1000) : 0;
    if (left > 0) return '<span class="chip warn cd" data-until="' + m.status.until + '" data-label="' + esc(label) + '" title="' + esc(m.status.description || '') + '">' + esc(label) + ' · ' + fmtCd(left) + '</span>';
    return '<span class="chip warn" title="' + esc(m.status.description || '') + '">' + esc(label) + '</span>';
  }
  function wSort(l) {
    var how = wcfg.sort;
    var nm = function (a, b) { return (a.name || '~').localeCompare(b.name || '~', 'tr') || a.id - b.id; };
    var f = function (m) { return m.ff == null ? null : Number(m.ff); };
    var byFf = function (dir) {
      return function (a, b) {
        var x = f(a), y = f(b);
        if (x == null && y == null) return nm(a, b);
        if (x == null) return 1;
        if (y == null) return -1;
        return dir * (x - y) || nm(a, b);
      };
    };
    if (how === 'ffasc') l.sort(byFf(1));
    else if (how === 'hosp') l.sort(function (a, b) {
      var ua = wLeft(a), ub = wLeft(b);
      if (ua > 0 && ub > 0) return ua - ub;
      if (ua > 0) return -1;
      if (ub > 0) return 1;
      return byFf(-1)(a, b);
    });
    else if (how === 'level') l.sort(function (a, b) { return (b.level || 0) - (a.level || 0) || nm(a, b); });
    else if (how === 'name') l.sort(nm);
    else l.sort(byFf(-1));
    return l;
  }
  function wFiltered() {
    var lo = wcfg.ffmin, hi = wcfg.ffmax;
    return wSort(wMembers().filter(function (m) {
      if (wcfg.okay && !attackable(m)) return false;
      if (m.ff != null) { var fv = Number(m.ff); if (isFinite(fv) && (fv < lo - 0.005 || fv > hi + 0.005)) return false; }
      return true;
    }));
  }
  function wQueue() {
    var now = Date.now(), gap = (wcfg.gap || 0) * 1000;
    return wFiltered().filter(function (m) {
      if (!attackable(m)) return false;
      if ((war.skip[m.id] || 0) > now) return false;
      if (gap && war.last[m.id] && now - war.last[m.id] < gap) return false;
      return true;
    });
  }
  function wLastTxt(m) {
    var la = m.la || {};
    if (la.ts) return (la.status ? la.status + ' · ' : '') + ago(la.ts * 1000);
    return la.rel || '';
  }
  function wRowHtml(m) {
    var last = wLastTxt(m);
    return '<li class="row' + (attackable(m) ? '' : ' off') + '" data-id="' + esc(m.id) + '">' +
      '<div class="who"><span class="name">' + esc(m.name || ('#' + m.id)) + '</span>' +
      '<span class="uid">#' + esc(m.id) + (m.level ? ' · Sv ' + esc(m.level) : '') + '</span>' + wStatusChip(m) + ffChip(m) + ratioChip(m) + '</div>' +
      '<a class="atk" data-wattack="' + esc(m.id) + '" href="' + esc(atkUrl(m.id)) + '" target="_blank" rel="noopener noreferrer">Saldır</a>' +
      '<div class="meta">' + (last ? '<span>Son aktif: ' + esc(last) + '</span>' : '') + '</div>' +
      '<div class="acts"><a class="link" href="' + esc(profUrl(m.id)) + '" target="_blank" rel="noopener noreferrer">Profil</a>' +
      '<button type="button" class="link" data-wact="skip">Atla</button></div></li>';
  }
  function renderWar() {
    if (!$('w-list')) return;
    var all = wMembers(), now = Date.now();
    var view = wFiltered(), q = wQueue(), cur = q[0];
    $('w-total').textContent = all.length;
    $('w-ready').textContent = all.filter(attackable).length;
    $('w-hosp').textContent = all.filter(function (m) { return stState(m) === 'hospital' && !isOkay(m); }).length;
    $('w-empty').hidden = all.length > 0;
    $('w-list').hidden = all.length === 0;
    $('w-list').innerHTML = view.length ? view.map(wRowHtml).join('') :
      (all.length ? '<li class="row" style="grid-template-columns:1fr;grid-template-areas:\'who\'"><div class="who"><span class="name empty">Süzgeçlere uyan üye yok</span></div></li>' : '');
    $('w-count').textContent = all.length ? view.length + ' / ' + all.length + ' üye gösteriliyor' + (war.fetchedAt ? ', liste ' + ago(war.fetchedAt) + ' güncellendi' : '') + '.' : '';
    var card = $('w-card');
    if (!cur) {
      card.innerHTML = '<p class="hint" style="margin:0">' + (all.length ? 'Süzgeçlere ve ara süreye uyan saldırılabilir üye yok. FF aralığını genişletebilir ya da hastane çıkışlarını bekleyebilirsin.' : 'Önce rakip faction üyelerini çek.') + '</p>';
    } else {
      var nxt = q.slice(1, 6).map(function (m) { return esc(m.name || ('#' + m.id)); }).join(', ');
      var last = wLastTxt(cur);
      card.innerHTML = '<div class="qcard"><div class="who"><span class="name">' + esc(cur.name || ('#' + cur.id)) + '</span>' +
        '<span class="uid">#' + esc(cur.id) + (cur.level ? ' · Sv ' + esc(cur.level) : '') + '</span>' + wStatusChip(cur) + ffChip(cur) + ratioChip(cur) + '</div>' +
        '<div class="qmeta">' + (last ? 'Son aktif: ' + esc(last) : '') + '</div>' +
        '<div class="qbtns"><a id="w-atk" class="atk" data-id="' + esc(cur.id) + '" href="' + esc(atkUrl(cur.id)) + '" target="_blank" rel="noopener noreferrer">Saldır</a>' +
        '<button type="button" class="btn" id="w-skip">Atla</button></div>' +
        (nxt ? '<div class="qnext">Sırada: ' + nxt + '</div>' : '') + '</div>';
    }
    var soon = all.map(function (m) { return { m: m, l: wLeft(m) }; }).filter(function (x) { return x.l > 0; }).sort(function (a, b) { return a.l - b.l; })[0];
    $('w-info').textContent = q.length + ' hedef sırada.' + (soon ? ' En yakın çıkış: ' + (soon.m.name || ('#' + soon.m.id)) + ', ' + fmtCd(soon.l) + '.' : '');
    renderWarStats();
    renderEnergy();
    if (!en.at) fetchEnergy();
    miniRender();
  }
  function renderWarStats() {
    var el = $('w-stats');
    if (!el) return;
    var td = new Date().toDateString(), today = 0, since = 0;
    war.hits.forEach(function (h) { if (new Date(h.t).toDateString() === td) today++; if (h.t >= war.resetAt) since++; });
    el.innerHTML = '<div>Bugün saldırı<b>' + today + '</b></div><div>Sıfırlamadan beri<b>' + since + '</b></div>';
  }
  function warHit(id) {
    var now = Date.now();
    war.hits.push({ t: now, id: id });
    war.last[id] = now;
    saveWar();
    setTimeout(renderWar, 80);
    setTimeout(fetchEnergy, 15000);
  }
  function warSkipCurrent() {
    var cur = wQueue()[0];
    if (!cur) return;
    war.skip[cur.id] = Date.now() + 120000;
    saveWar();
    renderWar();
  }
  function warTick() {
    if (curView !== 'war') return;
    var now = Math.floor(Date.now() / 1000), flip = false;
    var els = root.querySelectorAll('#view-war .cd');
    for (var i = 0; i < els.length; i++) {
      var left = Number(els[i].getAttribute('data-until')) - now;
      if (left <= 0) flip = true;
      else els[i].textContent = els[i].getAttribute('data-label') + ' · ' + fmtCd(left);
    }
    if (flip) renderWar();
  }
  function warPoll() {
    if (!((curView === 'war' && fullOpen()) || miniOn('war')) || !wcfg.auto || document.hidden || !isOpen() || !war.fid || !getKey() || warBusy || !pollOk('war', 20000)) return;
    if (warErrAt && Date.now() - warErrAt < 120000) return;
    warLoad(false);
  }
  function enterWar() {
    renderWar();
    if (getKey() && war.fid && !war.fetchedAt) warLoad(true);
  }
  function bindWar() {
    $('w-load').addEventListener('click', function () { warErrAt = 0; warLoad(true); });
    $('w-fid').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); warErrAt = 0; warLoad(true); } });
    ['w-ffmin', 'w-ffmax', 'w-sort', 'w-gap', 'w-okay', 'w-auto', 'w-keys'].forEach(function (id) {
      $(id).addEventListener('change', function () { readWarCfg(); renderWar(); });
    });
    $('view-war').addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-wattack], #w-atk');
      if (a) {
        var now = Date.now();
        if (now - wLastAtk < 400) { ev.preventDefault(); return; }
        wLastAtk = now;
        warHit(a.getAttribute('data-wattack') || a.getAttribute('data-id'));
        return;
      }
      if (ev.target.closest('#w-skip')) { warSkipCurrent(); return; }
      var b = ev.target.closest('button[data-wact]');
      if (b && b.getAttribute('data-wact') === 'skip') {
        var row = b.closest('.row'), id = row && row.getAttribute('data-id');
        if (id) { war.skip[id] = Date.now() + 120000; saveWar(); renderWar(); }
      }
    });
    $('w-reset').addEventListener('click', function () {
      var bt = $('w-reset');
      clearTimeout(wArmTimer);
      if (!wArm) {
        wArm = true; bt.textContent = 'Emin misin? Sıfırla';
        wArmTimer = setTimeout(function () { wArm = false; bt.textContent = 'Sayacı sıfırla'; }, 3500);
        return;
      }
      wArm = false; bt.textContent = 'Sayacı sıfırla';
      war.resetAt = Date.now(); saveWar(); renderWarStats();
    });
    setInterval(warTick, 1000);
    setInterval(warPoll, 20000);
  }
  function initViews() {
    loadWar();
    applyWarCfg();
    loadFac();
    bindFac();
    bindFac2();
    bindTrv();
    bindWar();
    var rem = lsGet('torn-mod-hatirla') === '1';
    $('mode-remember').checked = rem;
    $('mode-remember').addEventListener('change', function () { lsSet('torn-mod-hatirla', $('mode-remember').checked ? '1' : '0'); });
    root.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-go]');
      if (b) showView(b.getAttribute('data-go'));
    });
    var h = '';
    var start = (h === 'halloween' || h === 'war' || h === 'fac' || h === 'trv') ? h : (rem ? (lsGet('torn-mod-son') || 'home') : 'home');
    showView(start);
  }

  /* ---------- Faction yönetimi ---------- */
  var FAC_LS = 'torn-fac-v1';
  var fac = { fid: '', war: '', rate: 0, min: 0, rows: {}, paid: {} };
  var facArm = null;
  function loadFac() {
    try { var r = LS.getItem(FAC_LS); if (r) { var o = JSON.parse(r); fac.fid = o.fid || ''; fac.war = o.war || ''; fac.rate = o.rate || 0; fac.min = o.min || 0; fac.rows = o.rows || {}; fac.paid = o.paid || {}; } } catch (e) {}
    $('f-fid').value = fac.fid; $('f-war').value = fac.war; $('f-rate').value = fac.rate || ''; $('f-min').value = fac.min || 0;
  }
  function saveFac() { lsSet(FAC_LS, JSON.stringify(fac)); }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function facAmt(r) { var h = Number(r.hits) || 0; return (r.skip || h < fac.min) ? 0 : Math.round(h * (fac.rate || 0)); }
  function facExtract(j, fid) {
    var groups = [];
    var isMem = function (x) { return x && typeof x === 'object' && !Array.isArray(x) && (x.name !== undefined || x.id !== undefined || x.user_id !== undefined) && (x.attacks !== undefined || x.hits !== undefined); };
    (function walk(o, anc, depth) {
      if (!o || typeof o !== 'object' || depth > 8) return;
      var keys = Object.keys(o);
      var vals = keys.map(function (k) { return o[k]; });
      if (vals.length && vals.every(isMem)) {
        groups.push({ anc: anc, list: keys.map(function (k) { var v = o[k]; return { id: String(v.id != null ? v.id : (v.user_id != null ? v.user_id : (Array.isArray(o) ? '' : k))).replace(/\D/g, ''), name: v.name || '', hits: Number(v.attacks != null ? v.attacks : v.hits) || 0 }; }) });
        return;
      }
      keys.forEach(function (k) {
        var v = o[k], a = anc.concat([String(k)]);
        if (v && typeof v === 'object' && v.id != null) a.push(String(v.id));
        walk(v, a, depth + 1);
      });
    })(j, [], 0);
    if (!groups.length) return null;
    var mine = fid ? groups.filter(function (g) { return g.anc.indexOf(String(fid)) > -1; }) : [];
    return (mine[0] || groups[0]).list;
  }
  async function facLoad() {
    var war = ($('f-war').value || '').replace(/\D/g, '');
    if (!getKey()) { say('f-msg', 'Önce Torn API anahtarını kaydet. Faction bilgisi için anahtarın faction erişimi olmalı.', true); return; }
    if (!war) { say('f-msg', 'War ID si yaz.', true); return; }
    say('f-msg', 'Vuruşlar çekiliyor…', false);
    try {
      var fid = ($('f-fid').value || '').replace(/\D/g, '');
      if (!fid) {
        try { var jf = await apiGet('/user/faction', {}); var f = deepFind(jf, 'faction_id') || deepFind(jf, 'id'); if (f) fid = String(f); } catch (e0) {}
      }
      var j = await apiGet('/faction/' + war + '/rankedwarreport', {});
      var list = facExtract(j, fid);
      if (!list || !list.length) { showRaw(j); throw new Error('Rapor geldi ama vuruş sayılarını bulamadım. Hata ayıklama kutusundaki yanıtı bana gönder, düzelteyim. Şimdilik elle yapıştırabilirsin.'); }
      fac.fid = fid; fac.war = war;
      list.forEach(function (m) {
        var key = m.id || ('n:' + m.name);
        var old = fac.rows[key] || {};
        fac.rows[key] = { id: m.id, name: m.name || old.name || '', hits: m.hits, skip: !!old.skip };
      });
      saveFac(); renderFac();
      say('f-msg', list.length + ' üye alındı.', false);
    } catch (e) {
      say('f-msg', e.message || 'Alınamadı.', true);
    }
  }
  function facPaste() {
    var n = 0;
    ($('f-paste').value || '').split(/\r?\n/).forEach(function (ln) {
      ln = ln.trim(); if (!ln) return;
      var m = ln.match(/^(\d{3,8})\s+(.*?)\s+(\d+)$/) || ln.match(/^()(.*?)[\s:,;\t]+(\d+)$/);
      if (!m) return;
      var id = m[1] || '', name = m[2].replace(/\[\d+\]/g, '').trim();
      var key = id || ('n:' + name);
      fac.rows[key] = { id: id, name: name, hits: Number(m[3]), skip: !!(fac.rows[key] && fac.rows[key].skip) };
      n++;
    });
    saveFac(); renderFac();
    say('f-msg', n + ' satır eklendi.', n === 0);
    if (n) $('f-paste').value = '';
  }
  function renderFac() {
    var keys = Object.keys(fac.rows);
    keys.sort(function (a, b) { return (fac.rows[b].hits || 0) - (fac.rows[a].hits || 0); });
    var hits = 0, left = 0;
    keys.forEach(function (k) { var r = fac.rows[k]; if (!r.skip) hits += Number(r.hits) || 0; if (!fac.paid[k]) left += facAmt(r); });
    $('f-n').textContent = keys.length; $('f-hits').textContent = hits; $('f-left').textContent = money(left);
    $('f-empty').hidden = keys.length > 0;
    $('f-list').innerHTML = keys.map(function (k) {
      var r = fac.rows[k], paid = !!fac.paid[k];
      var link = r.id ? '<a class="link" href="' + esc(profUrl(r.id)) + '" target="_blank" rel="noopener noreferrer">Ödeme sayfası</a>' : '';
      return '<div class="payrow' + (paid ? ' done' : '') + '" data-k="' + esc(k) + '">' +
        '<div class="who"><span class="name">' + esc(r.name || ('#' + r.id)) + '</span>' + (r.id ? '<span class="uid">#' + esc(r.id) + '</span>' : '') + (r.skip ? '<span class="chip">Hariç</span>' : '') + '</div>' +
        '<input type="text" class="mono" inputmode="numeric" data-f="hits" value="' + esc(r.hits) + '" aria-label="Vuruş">' +
        '<div class="amt mono">' + money(facAmt(r)) + '</div>' +
        '<div class="acts">' + link +
        '<button type="button" class="link" data-fa="copy">Tutarı kopyala</button>' +
        '<label class="check"><input type="checkbox" data-fa="paid"' + (paid ? ' checked' : '') + '> Ödendi</label>' +
        '<button type="button" class="link" data-fa="skip">' + (r.skip ? 'Dahil et' : 'Hariç') + '</button>' +
        '<button type="button" class="link danger' + (facArm === k ? ' armed' : '') + '" data-fa="del">' + (facArm === k ? 'Emin misin? Sil' : 'Sil') + '</button></div></div>';
    }).join('');
  }
  function copyText(t) {
    try { if (typeof GM_setClipboard === 'function') { GM_setClipboard(t); return Promise.resolve(true); } } catch (e) {}
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return false; }); } catch (e) {}
    var ta = document.createElement('textarea'); ta.value = t; root.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    root.removeChild(ta); return Promise.resolve(ok);
  }
  function bindFac() {
    var readCfg = function () {
      fac.rate = parseHuman($('f-rate').value) || 0;
      fac.min = clampInt($('f-min').value, 0, 9999);
      fac.fid = ($('f-fid').value || '').replace(/\D/g, ''); fac.war = ($('f-war').value || '').replace(/\D/g, '');
      saveFac(); renderFac();
    };
    ['f-rate', 'f-min', 'f-fid', 'f-war'].forEach(function (id) { $(id).addEventListener('change', readCfg); });
    $('f-load').addEventListener('click', function () { readCfg(); facLoad(); });
    $('f-paste-go').addEventListener('click', facPaste);
    $('f-pool-go').addEventListener('click', function () {
      var pool = parseHuman($('f-pool').value), h = 0;
      Object.keys(fac.rows).forEach(function (k) { var r = fac.rows[k]; if (!r.skip && (Number(r.hits) || 0) >= fac.min) h += Number(r.hits) || 0; });
      if (!pool || !h) { say('f-msg', 'Havuz tutarı ve vuruş sayısı gerekli.', true); return; }
      fac.rate = Math.floor(pool / h); $('f-rate').value = fac.rate; saveFac(); renderFac();
      say('f-msg', 'Vuruş başı ücret ' + money(fac.rate) + ' oldu.', false);
    });
    $('f-list').addEventListener('change', function (ev) {
      var row = ev.target.closest('.payrow'); if (!row) return;
      var k = row.getAttribute('data-k'), r = fac.rows[k]; if (!r) return;
      if (ev.target.getAttribute('data-f') === 'hits') r.hits = clampInt(ev.target.value, 0, 99999);
      else if (ev.target.getAttribute('data-fa') === 'paid') { if (ev.target.checked) fac.paid[k] = true; else delete fac.paid[k]; }
      saveFac(); renderFac();
    });
    $('f-list').addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-fa]'); if (!b) return;
      var row = b.closest('.payrow'), k = row.getAttribute('data-k'), r = fac.rows[k]; if (!r) return;
      var a = b.getAttribute('data-fa');
      if (a === 'copy') copyText(String(facAmt(r))).then(function (ok) { say('f-msg', ok ? (r.name || k) + ' için ' + money(facAmt(r)) + ' kopyalandı.' : 'Kopyalanamadı, tutar: ' + facAmt(r), !ok); });
      else if (a === 'skip') { r.skip = !r.skip; saveFac(); renderFac(); }
      else if (a === 'del') {
        if (facArm === k) { delete fac.rows[k]; delete fac.paid[k]; facArm = null; saveFac(); renderFac(); }
        else { facArm = k; renderFac(); setTimeout(function () { if (facArm === k) { facArm = null; renderFac(); } }, 3500); }
      }
    });
    $('f-copy').addEventListener('click', function () {
      var lines = Object.keys(fac.rows).map(function (k) { var r = fac.rows[k]; return [r.id, r.name, r.hits, facAmt(r), fac.paid[k] ? 'ödendi' : 'bekliyor'].join('\t'); });
      copyText(['ID\tİsim\tVuruş\tTutar\tDurum'].concat(lines).join('\n')).then(function (ok) { say('f-msg', ok ? 'Liste kopyalandı.' : 'Kopyalanamadı.', !ok); });
    });
    $('f-unpaid').addEventListener('click', function () { fac.paid = {}; saveFac(); renderFac(); });
    $('f-clear').addEventListener('click', function () {
      if (facArm !== '*') { facArm = '*'; $('f-clear').textContent = 'Emin misin? Temizle'; setTimeout(function () { if (facArm === '*') { facArm = null; $('f-clear').textContent = 'Listeyi temizle'; } }, 3500); return; }
      facArm = null; fac.rows = {}; fac.paid = {}; $('f-clear').textContent = 'Listeyi temizle'; saveFac(); renderFac();
    });
  }

  /* ---------- Faction yönetimi: sekmeler ---------- */
  var fTab = 'war', fm = { list: [], at: 0 }, oc = { crimes: [], at: 0 }, me = { at: 0, bars: {}, cds: {}, travel: null, money: null };
  function fShow(t) {
    fTab = t;
    root.querySelectorAll('#f-tabs [data-ftab]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-ftab') === t); });
    root.querySelectorAll('#view-fac .fpane').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== t; });
    if (t === 'mem') renderMem();
    if (t === 'oc') renderOc();
    if (t === 'me') { renderMe(); if (getKey() && !me.at) meLoad(); }
  }
  function errMsg(e) { return (e && e.message) || 'Alınamadı.'; }
  function dayTxt(sec) { return sec < 3600 ? Math.max(1, Math.round(sec / 60)) + ' dk' : sec < 172800 ? Math.round(sec / 3600) + ' sa' : Math.floor(sec / 86400) + ' gün'; }

  /* üyeler */
  async function fmLoad(quiet) {
    if (!getKey()) { say('fm-msg', 'Önce Torn API anahtarını kaydet.', true); return false; }
    if (!quiet) say('fm-msg', 'Üyeler çekiliyor…', false);
    try {
      var j = await apiGet('/faction/members', { striptags: 'true' });
      var l = pickMembers(j);
      if (!l) { showRaw(j); throw new Error('Üye listesi bulunamadı. Hata ayıklama kutusundaki yanıtı bana gönder.'); }
      fm.list = [];
      l.forEach(function (it) {
        var m = mapMember(it);
        if (!m) return;
        m.pos = (it.position && (it.position.name || it.position)) || '';
        m.days = it.days_in_faction;
        fm.list.push(m);
      });
      fm.at = Date.now();
      if (!quiet) say('fm-msg', fm.list.length + ' üye alındı.', false);
      renderMem();
      return true;
    } catch (e) { say('fm-msg', errMsg(e), true); return false; }
  }
  function memIdle(m, days) { var ts = m.la && m.la.ts; return !ts || (Date.now() / 1000 - ts) >= days * 86400; }
  function renderMem() {
    var days = clampInt($('fm-days').value, 0, 999, 3);
    var box = $('fm-list');
    box.hidden = !fm.list.length;
    if (!fm.list.length) { $('fm-sum').textContent = ''; return; }
    var rows = fm.list.slice().sort(function (a, b) { return ((a.la && a.la.ts) || 0) - ((b.la && b.la.ts) || 0); });
    var idle = rows.filter(function (m) { return memIdle(m, days); });
    $('fm-sum').textContent = fm.list.length + ' üye, ' + idle.length + ' pasif (' + days + ' gün ve üstü).';
    box.innerHTML = rows.map(function (m) {
      var ts = m.la && m.la.ts, sec = ts ? Math.floor(Date.now() / 1000 - ts) : null, bad = memIdle(m, days);
      return '<div class="frow"><span class="nm">' + esc(m.name || ('#' + m.id)) + '</span><span class="dim">#' + esc(m.id) + (m.level ? ' · Sv ' + esc(m.level) : '') + (m.pos ? ' · ' + esc(m.pos) : '') + '</span>' +
        '<span class="chip' + (bad ? ' warn' : ' ok') + '">' + (sec == null ? 'bilinmiyor' : dayTxt(sec) + ' önce') + '</span>' + wStatusChip(m) +
        '<a class="link" href="' + esc(profUrl(m.id)) + '" target="_blank" rel="noopener noreferrer">Profil</a></div>';
    }).join('');
  }

  /* OC */
  async function ocLoad() {
    if (!getKey()) { say('oc-msg', 'Önce Torn API anahtarını kaydet.', true); return; }
    say('oc-msg', 'OC\'ler çekiliyor…', false);
    try {
      if (!fm.list.length) await fmLoad(true);
      var all = [];
      var cats = [['recruiting', 'Toplanıyor'], ['planning', 'Planlanıyor']];
      for (var i = 0; i < cats.length; i++) {
        var j = await apiGet('/faction/crimes', { cat: cats[i][0], offset: '0' });
        var arr = Array.isArray(j && j.crimes) ? j.crimes : (Array.isArray(deepFind(j, 'crimes')) ? deepFind(j, 'crimes') : null);
        if (!arr) { showRaw(j); throw new Error('Crime listesi bulunamadı. Hata ayıklama kutusundaki yanıtı bana gönder.'); }
        arr.forEach(function (c) { c._cat = cats[i][1]; all.push(c); });
      }
      oc.crimes = all; oc.at = Date.now();
      say('oc-msg', all.length + ' crime alındı, ' + new Date().toLocaleTimeString(loc()) + '.', false);
      renderOc();
    } catch (e) { say('oc-msg', errMsg(e), true); }
  }
  function slotUid(sl) { var u = sl && sl.user; if (u == null) return ''; return String(typeof u === 'object' ? (u.id != null ? u.id : '') : u); }
  function memName(id) { var m = fm.list.filter(function (x) { return x.id === String(id); })[0]; return m ? (m.name || '#' + id) : '#' + id; }
  function renderOc() {
    var cr = oc.crimes, inOc = {};
    cr.forEach(function (c) { (c.slots || []).forEach(function (sl) { var u = slotUid(sl); if (u) inOc[u] = true; }); });
    var idleBox = $('oc-idle');
    if (oc.at && fm.list.length) {
      var idle = fm.list.filter(function (m) { return !inOc[m.id]; });
      idleBox.hidden = false;
      idleBox.innerHTML = '<h3>Hiçbir crime\'da olmayan üyeler (' + idle.length + ')</h3>' + (idle.length ? idle.map(function (m) {
        return '<div class="frow"><span class="nm">' + esc(m.name || ('#' + m.id)) + '</span><span class="dim">#' + esc(m.id) + (m.la && m.la.ts ? ' · ' + dayTxt(Math.floor(Date.now() / 1000 - m.la.ts)) + ' önce aktifti' : '') + '</span></div>';
      }).join('') : '<div class="frow dim">Herkes bir crime\'da.</div>');
    } else idleBox.hidden = true;
    $('oc-list').innerHTML = cr.map(function (c) {
      var sl = c.slots || [], filled = sl.filter(function (x) { return slotUid(x); }).length;
      var when = c.ready_at ? ' · hazır: ' + new Date(c.ready_at * 1000).toLocaleString(loc()) : '';
      return '<div class="fcard"><h3>' + esc(c.name || 'Crime') + ' <span class="chip">' + esc(c._cat) + '</span></h3>' +
        '<div class="frow dim">' + filled + ' / ' + sl.length + ' slot dolu' + esc(when) + '</div>' +
        sl.map(function (x) {
          var u = slotUid(x), pos = x.position_info && x.position_info.label || (typeof x.position === 'string' ? x.position : '') || '';
          return '<div class="frow"><span class="nm">' + esc(pos || 'Slot') + '</span>' + (u ? '<span>' + esc(memName(u)) + '</span>' : '<span class="chip warn">BOŞ</span>') + '</div>';
        }).join('') + '</div>';
    }).join('');
  }

  /* cooldown ve barlar */
  async function meLoad() {
    if (!getKey()) { say('me-msg', 'Önce Torn API anahtarını kaydet.', true); return; }
    var errs = [], got = 0, now = Date.now();
    var tryGet = async function (path, fn) { try { var j = await apiGet(path, {}); fn(j); got++; } catch (e) { errs.push(e); } };
    await tryGet('/user/bars', function (j) { var b = deepFind(j, 'bars') || j; me.bars = b || {}; });
    await tryGet('/user/cooldowns', function (j) { var c = deepFind(j, 'cooldowns') || j; me.cds = {}; Object.keys(c || {}).forEach(function (k) { var v = Number(c[k]); if (isFinite(v)) me.cds[k] = now + v * 1000; }); });
    await tryGet('/user/travel', function (j) { me.travel = deepFind(j, 'travel') || j; me.travelAt = now; });
    await tryGet('/user/money', function (j) { me.money = deepFind(j, 'money') || j; });
    if (got) { me.at = now; say('me-msg', 'Güncellendi ' + new Date().toLocaleTimeString(loc()) + (errs.length ? ' (' + errs.length + ' bölüm alınamadı: ' + errs[0].message + ')' : ''), errs.length > 0); }
    else say('me-msg', errMsg(errs[0]), true);
    renderMe();
  }
  var BAR_TR = { energy: 'Enerji', nerve: 'Nerve', happy: 'Mutluluk', life: 'Can' };
  var CD_TR = { drug: 'İlaç (drug)', medical: 'Tıbbi', booster: 'Booster' };
  var MONEY_TR = { wallet: 'Cüzdan', vault: 'Mülk kasası', points: 'Puan', cayman_bank: 'Cayman', company: 'Şirket', daily_networth: 'Günlük networth' };
  function cdText(end) { var l = Math.ceil((end - Date.now()) / 1000); return l > 0 ? fmtCd(l) : 'Hazır'; }
  function renderMe() {
    if (!me.at) { $('me-cards').innerHTML = '<p class="hint">Henüz veri yok. "Yenile"ye bas.</p>'; return; }
    var h = '';
    var bk = Object.keys(BAR_TR).filter(function (k) { return me.bars && me.bars[k] && typeof me.bars[k] === 'object'; });
    if (bk.length) {
      h += '<div class="fcard"><h3>Barlar</h3>' + bk.map(function (k) {
        var o = me.bars[k], ft = Number(o.full_time), end = '';
        if (isFinite(ft) && ft > 0) end = ft > 1e9 ? ft * 1000 : me.at + ft * 1000;
        return '<div class="frow"><span class="nm">' + BAR_TR[k] + '</span><span class="big">' + esc(o.current) + ' / ' + esc(o.maximum) + '</span>' + (end ? '<span class="dim">dolmasına <b class="cdt" data-end="' + end + '">' + cdText(end) + '</b></span>' : '') + '</div>';
      }).join('') + '</div>';
    }
    var ck = Object.keys(me.cds);
    if (ck.length) {
      h += '<div class="fcard"><h3>Cooldown\'lar</h3>' + ck.map(function (k) {
        return '<div class="frow"><span class="nm">' + esc(CD_TR[k] || k) + '</span><b class="big cdt" data-end="' + me.cds[k] + '">' + cdText(me.cds[k]) + '</b></div>';
      }).join('') + '</div>';
    }
    if (me.travel && typeof me.travel === 'object') {
      var t = me.travel, left = Number(t.time_left), end2 = isFinite(left) && left > 0 ? me.travelAt + left * 1000 : (t.arrival_at ? t.arrival_at * 1000 : 0);
      var dest = t.destination || '';
      h += '<div class="fcard"><h3>Seyahat</h3><div class="frow"><span class="nm">' + esc(dest || 'Torn') + '</span>' + (end2 > Date.now() ? '<span class="dim">varışa <b class="cdt" data-end="' + end2 + '">' + cdText(end2) + '</b></span>' : '<span class="dim">yolculuk yok</span>') + '</div></div>';
    }
    if (me.money && typeof me.money === 'object') {
      var mk = Object.keys(me.money).filter(function (k) { return typeof me.money[k] === 'number'; });
      if (mk.length) h += '<div class="fcard"><h3>Para</h3>' + mk.map(function (k) { return '<div class="frow"><span class="nm">' + esc(MONEY_TR[k] || k) + '</span><span class="mono">' + (k === 'points' ? Number(me.money[k]).toLocaleString('en-US') : money(me.money[k])) + '</span></div>'; }).join('') + '</div>';
    }
    $('me-cards').innerHTML = h || '<p class="hint">Veri geldi ama tanınan bir alan yok. Hata ayıklama kutusuna bakıp bana gönder.</p>';
  }
  function meTick() {
    if (curView !== 'fac' || fTab !== 'me') return;
    root.querySelectorAll('#me-cards .cdt').forEach(function (el) { el.textContent = cdText(Number(el.getAttribute('data-end'))); });
  }

  /* yedek */
  function bkCollect() {
    var o = {}, withKeys = $('bk-keys').checked;
    try {
      LS.keys().forEach(function (k) {
        if (k.indexOf('torn-') !== 0) return;
        if (!withKeys && (k === 'torn-api-key-v1' || k === 'torn-ff-key-v1')) return;
        o[k] = LS.getItem(k);
      });
    } catch (e) {}
    return JSON.stringify({ app: 'torn-hedef-araci', at: new Date().toISOString(), data: o });
  }
  function bkRestore(txt) {
    var o;
    try { o = JSON.parse(txt); } catch (e) { say('bk-msg', 'Bu geçerli bir yedek değil.', true); return; }
    if (!o || o.app !== 'torn-hedef-araci' || !o.data) { say('bk-msg', 'Bu araca ait bir yedek değil.', true); return; }
    var n = 0;
    Object.keys(o.data).forEach(function (k) { if (k.indexOf('torn-') === 0 && typeof o.data[k] === 'string') { lsSet(k, o.data[k]); n++; } });
    say('bk-msg', n + ' kayıt geri yüklendi, sayfa yenileniyor…', false);
    setTimeout(function () { location.reload(); }, 600);
  }
  function bindFac2() {
    $('f-tabs').addEventListener('click', function (ev) { var b = ev.target.closest('[data-ftab]'); if (b) fShow(b.getAttribute('data-ftab')); });
    $('fm-load').addEventListener('click', function () { fmLoad(false); });
    $('fm-days').addEventListener('change', renderMem);
    $('fm-copy').addEventListener('click', function () {
      var days = clampInt($('fm-days').value, 0, 999, 3);
      var txt = fm.list.filter(function (m) { return memIdle(m, days); }).map(function (m) { return m.id + '\t' + m.name; }).join('\n');
      copyText(txt).then(function (ok) { say('fm-msg', ok ? 'Pasif listesi kopyalandı.' : 'Kopyalanamadı.', !ok); });
    });
    $('oc-load').addEventListener('click', ocLoad);
    $('me-load').addEventListener('click', meLoad);
    $('bk-export').addEventListener('click', function () { $('bk-text').value = bkCollect(); say('bk-msg', 'Yedek hazır. Metni kopyalayıp bir yere kaydet.', false); });
    $('bk-download').addEventListener('click', function () {
      try {
        var blob = new Blob([bkCollect()], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'torn-yedek-' + new Date().toISOString().slice(0, 10) + '.json';
        root.appendChild(a); a.click(); root.removeChild(a);
        say('bk-msg', 'Dosya indirildi.', false);
      } catch (e) { say('bk-msg', 'İndirilemedi, "Yedek oluştur" ile metni kopyala.', true); }
    });
    $('bk-import').addEventListener('click', function () {
      var t = $('bk-text').value.trim();
      if (t) bkRestore(t); else $('bk-file').click();
    });
    $('bk-file').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { bkRestore(String(r.result)); }; r.readAsText(f);
    });
    setInterval(meTick, 1000);
    setInterval(function () { if (curView === 'fac' && fTab === 'me' && $('me-auto').checked && !document.hidden && isOpen() && getKey() && Date.now() - me.at > 29000 && pollOk('me', 29000)) meLoad(); }, 10000);
  }

  /* ---------- Yurtdışı fiyatları ---------- */
  var TRV_LS = 'torn-trv-v1', ITEMS_LS = 'torn-itemprices-v1';
  var CTRY = {
    mex: ['Meksika', 26], cay: ['Cayman Adaları', 35], can: ['Kanada', 41], haw: ['Hawaii', 134], uni: ['Birleşik Krallık', 159],
    arg: ['Arjantin', 167], swi: ['İsviçre', 175], jap: ['Japonya', 225], chi: ['Çin', 242], uae: ['BAE', 271], sou: ['Güney Afrika', 297]
  };
  var trv = { rows: [], stockAt: 0, prices: {}, names: {}, pricesAt: 0, cfg: { cap: 15, fly: '1', fee: 0, country: '', sort: 'hour', onlypos: true, instock: true, auto: false } };
  var trvBusy = false, trvTimer = null;
  function loadTrv() {
    try { var c = JSON.parse(lsGet(TRV_LS) || 'null'); if (c) Object.assign(trv.cfg, c); } catch (e) {}
    try { var p = JSON.parse(lsGet(ITEMS_LS) || 'null'); if (p && p.map) { trv.prices = p.map; trv.names = p.names || {}; trv.pricesAt = p.at || 0; } } catch (e) {}
    var sel = $('t-country');
    Object.keys(CTRY).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = CTRY[k][0]; sel.appendChild(o); });
    $('t-cap').value = trv.cfg.cap; $('t-fly').value = trv.cfg.fly; $('t-fee').value = trv.cfg.fee;
    sel.value = trv.cfg.country; $('t-sort').value = trv.cfg.sort;
    $('t-onlypos').checked = !!trv.cfg.onlypos; $('t-instock').checked = !!trv.cfg.instock; $('t-auto').checked = !!trv.cfg.auto;
  }
  function readTrv() {
    trv.cfg.cap = clampInt($('t-cap').value, 1, 500, 15);
    trv.cfg.fly = $('t-fly').value;
    trv.cfg.fee = Math.min(100, Math.max(0, numOr($('t-fee').value, 0)));
    trv.cfg.country = $('t-country').value; trv.cfg.sort = $('t-sort').value;
    trv.cfg.onlypos = $('t-onlypos').checked; trv.cfg.instock = $('t-instock').checked; trv.cfg.auto = $('t-auto').checked;
    lsSet(TRV_LS, JSON.stringify(trv.cfg));
  }
  async function trvGetStocks() {
    var urls = ['https://api.prombot.co.uk/api/travel', 'https://yata.yt/api/v1/travel/export/'], last = null;
    for (var i = 0; i < urls.length; i++) {
      try {
        var r = await gmFetch(urls[i]);
        var j = await r.json();
        if (j && j.stocks && typeof j.stocks === 'object') return { j: j, src: i === 0 ? 'Prombot' : 'YATA' };
        last = new Error('Beklenmeyen yanıt');
      } catch (e) { last = e; }
    }
    throw new Error('Yurtdışı stok verisi alınamadı' + (last ? ' (' + (last.message || 'bağlantı') + ')' : '') + '. Tarayıcı bu sitelere istek atmayı engelliyor olabilir, Tampermonkey sürümünde bu sorun olmaz.');
  }
  async function trvGetPrices() {
    if (!getKey()) return 'Torn anahtarı yok, Torn değerleri gösterilemiyor.';
    if (trv.pricesAt && Date.now() - trv.pricesAt < 6 * 3600000 && Object.keys(trv.prices).length) return '';
    try {
      var j = await apiGet('/torn', { selections: 'items' });
      var items = j && j.items;
      if (!items) { showRaw(j); return 'Torn eşya listesi beklenmeyen biçimde geldi.'; }
      var list = Array.isArray(items) ? items : Object.keys(items).map(function (k) { return Object.assign({ id: k }, items[k]); });
      var map = {}, names = {};
      list.forEach(function (it) {
        if (!it) return;
        var v = it.value && (it.value.market_price != null ? it.value.market_price : null);
        if (v == null) v = it.market_value != null ? it.market_value : (it.marketValue != null ? it.marketValue : null);
        v = Number(v);
        if (!isFinite(v) || v <= 0) return;
        map[String(it.id)] = v;
        if (it.name) names[String(it.name).trim().toLowerCase()] = v;
      });
      if (!Object.keys(map).length) { showRaw(j); return 'Eşya fiyatları bulunamadı.'; }
      trv.prices = map; trv.names = names; trv.pricesAt = Date.now();
      lsSet(ITEMS_LS, JSON.stringify({ at: trv.pricesAt, map: map, names: names }));
      return '';
    } catch (e) { return 'Torn fiyatları alınamadı: ' + errMsg(e); }
  }
  async function trvLoad(manual) {
    if (trvBusy) return;
    trvBusy = true;
    if (manual) say('t-msg', 'Veriler çekiliyor…', false);
    try {
      var st = await trvGetStocks();
      var note = await trvGetPrices();
      var rows = [];
      Object.keys(st.j.stocks).forEach(function (cc) {
        if (!CTRY[cc]) return;
        var c = st.j.stocks[cc] || {};
        (c.stocks || []).forEach(function (it) {
          if (!it) return;
          rows.push({ c: cc, id: String(it.id != null ? it.id : ''), name: it.name || '', qty: Number(it.quantity != null ? it.quantity : it.qty) || 0, cost: Number(it.cost) || 0, upd: c.update || 0, next: it.nextRestock });
        });
      });
      trv.rows = rows; trv.stockAt = Date.now();
      renderTrv();
      say('t-msg', rows.length + ' ürün alındı (' + st.src + '), ' + new Date().toLocaleTimeString(loc()) + '.' + (note ? ' ' + note : ''), !!note);
    } catch (e) { say('t-msg', errMsg(e), true); }
    trvBusy = false;
  }
  function trvCalc(r) {
    var price = trv.prices[r.id];
    if (price == null && r.name) price = trv.names[String(r.name).trim().toLowerCase()];
    var fee = trv.cfg.fee / 100, mult = Number(trv.cfg.fly) || 1;
    var o = { r: r, price: price, unit: null, trip: null, hour: null, mins: CTRY[r.c][1] * mult * 2 };
    if (price != null) {
      o.unit = price * (1 - fee) - r.cost;
      o.trip = o.unit * Math.min(r.qty, trv.cfg.cap);
      o.hour = o.mins > 0 ? o.trip / (o.mins / 60) : 0;
    }
    return o;
  }
  function trvRows() {
    var list = trv.rows.map(trvCalc);
    var all = list.length;
    list = list.filter(function (o) {
      if (trv.cfg.country && o.r.c !== trv.cfg.country) return false;
      if (trv.cfg.instock && o.r.qty <= 0) return false;
      if (trv.cfg.onlypos && !(o.unit != null && o.unit > 0)) return false;
      return true;
    });
    var key = trv.cfg.sort;
    list.sort(function (a, b) {
      var x, y;
      if (key === 'qty') { x = a.r.qty; y = b.r.qty; } else { x = a[key]; y = b[key]; }
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return y - x;
    });
    return { list: list, all: all };
  }
  function trvAgeTxt(upd) { return upd ? ago(upd * 1000) : ''; }
  function renderTrv() {
    var box = $('t-list');
    var res = trvRows(), all = trv.rows.map(trvCalc);
    var pos = all.filter(function (o) { return o.unit != null && o.unit > 0 && o.r.qty > 0; });
    var best = pos.reduce(function (m, o) { return o.hour > (m ? m.hour : -1) ? o : m; }, null);
    $('t-n').textContent = trv.rows.length;
    $('t-pos').textContent = pos.length;
    $('t-best').textContent = best ? money(best.hour) : '-';
    box.hidden = !trv.rows.length;
    if (!trv.rows.length) { $('t-count').textContent = ''; return; }
    $('t-count').textContent = res.list.length + ' / ' + res.all + ' ürün gösteriliyor' + (trv.stockAt ? ', stok verisi ' + ago(trv.stockAt) + ' alındı' : '') + '.';
    box.innerHTML = res.list.slice(0, 150).map(function (o) {
      var r = o.r;
      var next = r.next ? (typeof r.next === 'number' ? 'restock ' + new Date(r.next * 1000).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }) : 'restock ' + r.next) : '';
      return '<div class="frow"><span class="nm">' + esc(r.name || ('#' + r.id)) + '</span><span class="dim">' + esc(CTRY[r.c][0]) + '</span>' +
        '<span class="mono">alış ' + money(r.cost) + '</span>' +
        '<span class="mono">' + (o.price != null ? 'Torn ' + money(o.price) : 'Torn değeri yok') + '</span>' +
        (o.unit != null ? '<span class="chip ' + (o.unit > 0 ? 'ok' : 'warn') + '">' + (o.unit > 0 ? '+' : '') + money(o.unit) + ' / adet</span>' +
          '<span class="mono">uçuş ' + money(o.trip) + '</span><span class="mono"><b>' + money(o.hour) + '</b> / saat</span>' : '') +
        '<span class="dim">stok ' + r.qty + (trvAgeTxt(r.upd) ? ' · ' + trvAgeTxt(r.upd) + ' güncellendi' : '') + (next ? ' · ' + esc(next) : '') + '</span></div>';
    }).join('') || '<div class="frow dim">Süzgeçlere uyan ürün yok.</div>';
  }
  function enterTrv() {
    renderTrv();
    if (!trv.rows.length) trvLoad(false);
  }
  function bindTrv() {
    loadTrv();
    ['t-cap', 't-fly', 't-fee', 't-country', 't-sort', 't-onlypos', 't-instock', 't-auto'].forEach(function (id) {
      $(id).addEventListener('change', function () { readTrv(); renderTrv(); });
    });
    $('t-load').addEventListener('click', function () { trvLoad(true); });
    setInterval(function () { if (curView === 'trv' && trv.cfg.auto && !document.hidden && isOpen() && Date.now() - trv.stockAt > 55000 && pollOk('trv', 55000)) trvLoad(false); }, 15000);
  }

  /* ---------- dil / language ---------- */
  var LANG_LS = 'torn-lang-v1';
  var EN_DICT = {"Uçuş önerileri": "Flight tips", "Tüm fiyatlar": "All prices", "Uçuş sayfasında önerileri otomatik aç": "Open flight tips automatically on the travel page", "Veriler çekiliyor, birkaç saniye…": "Fetching data, a few seconds…", "Kârlı ürün bulunamadı. Torn API anahtarını kaydet ya da süzgeçleri gevşet.": "No profitable item found. Save your Torn API key or loosen the filters.", "Kapasite ": "Capacity ", "Kâr/saat": "Profit/hour", "Kâr/uçuş": "Profit/flight", "Hata bildir": "Report a bug", "Raporu kopyala": "Copy report", "Rapor kopyalandı. Geliştiriciye gönder.": "Report copied. Send it to the developer.", "Rapor kopyalanamadı.": "Could not copy the report.", "Sürüm ": "Version ", ". Satırlar mevcut listeye eklenir.": ". Lines are added to the existing list.", "seçili": "selected", "1234567 Ad": "1234567 Name", "1234567 veya profil linki": "1234567 or a profile link", "14+ gündür aktif olmayanlar": "Inactive for 14+ days", "API anahtarlarını da dahil et (yedeği kimseyle paylaşma)": "Include API keys too (never share the backup)", "API anahtarı": "API key", "API çalışmazsa elle yapıştır": "Paste manually if the API doesn't work", "Ad [1234567]": "Name [1234567]", "7654321 Başka Ad": "7654321 Other Name", "Adet": "Qty", "Adet başına kâr": "Profit per unit", "Airstrip (yaklaşık -30%)": "Airstrip (about -30%)", "Anahtar yalnızca bu tarayıcıda saklanır ve sadece api.torn.com'a gönderilir. FF değerleri ffscouter.com'dan gelir. Bunun için orada kayıtlı olman gerekir ve anahtarın o siteye de gönderilir. Torn'da": "The key is stored only in this browser and sent only to api.torn.com. FF values come from ffscouter.com; you must be registered there and your key is sent to that site too. In Torn, go to", "Ara": "Search", "Ayarlar": "Settings", "Ayarlar → API Key": "Settings → API Key", "Aynı hedefe ara (dk)": "Gap per target (min)", "Aynı hedefe ara (sn)": "Gap per target (sec)", "Bitti": "Done", "Boşsa yukarıdaki anahtar kullanılır": "If empty, the key above is used", "Bugünkü saldırı sayılarını sıfırlar ve mug korumasındaki hedeflerin korumasını kaldırır. Toplam saldırı kayıtların silinmez.": "Resets today's attack counts and removes protection from mug-protected targets. Your total attack records are kept.", "Bugünü sıfırla": "Reset today", "Business (yaklaşık -70%)": "Business (about -70%)", "Cooldown ve barlar": "Cooldowns and bars", "%40 (5+ tatlı)": "40% (5+ treats)", "%45 (15+ tatlı)": "45% (15+ treats)", "%50 (40+ tatlı)": "50% (40+ treats)", "%55 (90+ tatlı)": "55% (90+ treats)", "%60 (190+ tatlı)": "60% (190+ treats)", "%65 (440+ tatlı)": "65% (440+ treats)", "%70 (940+ tatlı)": "70% (940+ treats)", "%75 (1.940+ tatlı)": "75% (1,940+ treats)", "%80 (4.440+ tatlı)": "80% (4,440+ treats)", "%35 (0+ tatlı)": "35% (0+ treats)", "Daha önce bulunan oyuncuların kaydını siler": "Clears the record of players found before", "Daha önce bulunanları gösterme": "Hide players found before", "Dosya olarak indir": "Download as file", "Durumları yenile": "Refresh statuses", "Durumu otomatik kontrol et": "Check status automatically", "Ek bonus %": "Extra bonus %", "Ekle": "Add", "Elle ekle": "Add manually", "En çok saldırılan": "Most attacked", "Excel'e kopyala ve yedekle": "Copy to Excel and back up", "FF Scouter anahtarı (isteğe bağlı)": "FF Scouter key (optional)", "FF Scouter hesabındaki statlarına göre her oyuncu için bir Fair Fight (FF) değeri hesaplar. FF ne kadar düşükse hedef senin için o kadar kolaydır (2 ve altı kolay, 3.5 ve altı orta). Beğendiklerini tek dokunuşla listene ekle. \"Networth'leri de getir\" açıksa her aday için ayrıca Torn'a sorulur ve 50 aday için yaklaşık yarım dakika sürer. Sonuçlar networth'e göre sıralanır. \"Min networth\" doluysa altındakiler elenir. Daha önce bulunan oyuncular bir daha gösterilmez. İlk 50 sonuç tükenirse sayfa aramayı seviye ve FF aralıklarına bölerek yeni oyuncu arar. Eklediğin oyuncuların adı \"Durumları yenile\" ile gelir.": "Calculates a Fair Fight (FF) value for each player based on the stats on your FF Scouter account. The lower the FF, the easier the target is for you (2 or below is easy, 3.5 or below is medium). Add the ones you like with one tap. If \"Fetch networths too\" is on, Torn is queried for each candidate, which takes about half a minute for 50 candidates. Results are sorted by networth. If \"Min networth\" is set, lower ones are dropped. Players found before are not shown again. When the first 50 results run out, the search is split into level and FF ranges to find new players. Names of added players are filled in with \"Refresh statuses\".", "FF değerleri için FF Scouter anahtarı da gerekir. Yoksa liste FF olmadan gelir.": "You also need an FF Scouter key for FF values. Without it, the list comes without FF.", "FF değerlerini çek": "Fetch FF values", "FF düşük önce (daha kolay)": "Lowest FF first (easier)", "FF yüksek önce (daha çok respect)": "Highest FF first (more respect)", "Faction ID (boşsa kendin)": "Faction ID (yours if empty)", "Faction ID veya profil linki": "Faction ID or profile link", "Faction ID'si, faction profil sayfasının adresinde ID= ile başlayan sayıdır. Üye listesi tek istekle gelir, bu yüzden durumlar sık yenilenebilir. Saldırı sayacı yalnızca bu sayfadan basılan Saldır düğmelerini sayar.": "The faction ID is the number after ID= in the faction profile page address. The member list comes in a single request, so statuses can refresh often. The attack counter only counts Attack buttons pressed from this page.", "Faction kontrol sayfası": "Faction controls page", "Faction yönetimi": "Faction management", "Faction üyeleri": "Faction members", "Fair Fight (yüksek önce)": "Fair Fight (highest first)", "Görülenleri sıfırla (0)": "Reset seen (0)", "Görünenlerin hepsini seç": "Select all visible", "Halloween / Mug modu": "Halloween / Mug mode", "Halloween sayacı": "Halloween counter", "Hastaneden çıkışı yakın önce": "Leaving hospital soonest first", "Havuz (ücreti hesaplat)": "Pool (to calculate fee)", "Havuz hedefi": "Pool target", "Havuzdan ücreti hesapla": "Calculate fee from pool", "Havuzu doldur": "Fill the pool", "Hedef Listesi": "Target List", "Hedef ekle": "Add target", "Hedef listesi, ayarlar, savaş ve payout kayıtları tek bir metin olarak kaydedilir. Başka bir tarayıcıya ya da cihaza taşıyabilirsin.": "Your target list, settings, war and payout records are saved as one block of text. You can move it to another browser or device.", "Hedef listesi, sıra modu, tatlı sayacı, mug takibi, kolay hedef bulucu ve networth etiketleri.": "Target list, queue mode, treat counter, mug tracking, easy target finder and networth labels.", "Hedefleri bul": "Find targets", "Hedeflerimi çek": "Fetch my targets", "Henüz üye yok. Vuruşları çek ya da elle yapıştır.": "No members yet. Fetch the hits or paste them manually.", "Hepsi": "All", "Hepsini ekle": "Add all", "Her saldırı aynı tatlı şansını taşır, hedefin kim olduğu fark etmez. Şans sepet seviyene göre otomatik hesaplanır: Spooky'de %35, her seviyede %5 artar, Nightmarish'te %80 olur. Korkunç giysi ve silahın şansı ne kadar artırdığını wiki vermiyor. Bunu biliyorsan \"Ek bonus\" kutusuna yaz. Çarpan yükseltmeleri de gerçek sayıyı değiştirdiği için beklenen tatlı kaba bir tahmindir. Sayaç yalnızca bu sayfadan basılan Saldır düğmelerini sayar.": "Every attack carries the same treat chance, no matter who the target is. The chance is calculated automatically from your basket level: 35% at Spooky, +5% per level, 80% at Nightmarish. The wiki doesn't say how much the scary outfit and weapon add. If you know, enter it in the \"Extra bonus\" box. Multiplier upgrades also change the real number, so the expected treats are a rough estimate. The counter only counts Attack buttons pressed from this page.", "Her satıra bir hedef yaz. Listede olan ID'ler tekrar eklenmez.": "Write one target per line. IDs already in the list are not added again.", "Her satıra bir üye:": "One member per line:", "Hesap ayarları": "Calculation settings", "ID İsim vuruş": "ID Name hits", "ID'ye göre": "By ID", "Kaydet ve bağlan": "Save and connect", "Kayıtlı anahtarı sil": "Delete saved key", "Kendi faction'ın listesi gelir. Anahtarında Faction erişimi açık olmalı. Son aktiflik zamanı Torn'un verdiği \"last action\" değeridir.": "Your own faction's list is shown. Your key needs Faction access. Last activity is Torn's \"last action\" value.", "Kişisel durum": "Personal status", "Klavye: Enter saldırır, S atlar": "Keyboard: Enter attacks, S skips", "Kolay hedef bul": "Find easy targets", "Kolay-orta: FF 2.5'a kadar": "Easy-medium: up to FF 2.5", "Kolay: FF 2.0'a kadar": "Easy: up to FF 2.0", "Kolaylık (kolay önce)": "Ease (easiest first)", "Kopyala": "Copy", "Kâr / saat": "Profit / hour", "Kâr / uçuş": "Profit / flight", "Limited Access anahtarını yapıştır": "Paste your Limited Access key", "Liste araçları": "List tools", "Listen boş": "Your list is empty", "Listeye ekle": "Add to list", "Listeyi temizle": "Clear list", "Maks FF": "Max FF", "Maks seviye": "Max level", "Metin sekmeyle ayrılmış sütunlar içerir. Kopyalayıp Excel veya Google Sheets'te A1 hücresine yapıştırabilirsin. Aynı metni \"Toplu ekle\" bölümüne yapıştırarak listeyi geri yükleyebilirsin.": "The text contains tab-separated columns. Copy it and paste into cell A1 in Excel or Google Sheets. You can restore the list by pasting the same text into the \"Bulk add\" section.", "Min FF": "Min FF", "Min networth": "Min networth", "Min seviye": "Min level", "Min. vuruş": "Min. hits", "Mug modu": "Mug mode", "Mug tavanı = networth × %5. Mug, hedefin cebindeki nakdin yaklaşık %5'ini (en fazla %10) alır. Networth ise banka, hisse, eşya ve mülkü de içerir, o yüzden gerçek kazanç çoğu zaman tavandan çok daha düşük olur.": "Mug ceiling = networth × 5%. A mug takes about 5% (at most 10%) of the cash in the target's pocket. Networth also includes bank, stocks, items and property, so the real gain is usually far below the ceiling.", "Networth (yüksek önce)": "Networth (highest first)", "Networth çek": "Fetch networth", "Networth'leri de getir (yavaş)": "Fetch networths too (slow)", "Not": "Note", "OC takibi": "OC tracking", "OC'leri çek": "Fetch OCs", "Organized crime takibi": "Organized crime tracking", "Orta: FF 3.5'a kadar": "Medium: up to FF 3.5", "Otomatik yenile (20 sn)": "Auto refresh (20 s)", "Otomatik yenile (30 sn)": "Auto refresh (30 s)", "Otomatik yenile (60 sn)": "Auto refresh (60 s)", "Oyuncu ID": "Player ID", "Oyunda sayfa dışı yaptığın bir saldırıyı ekle": "Add an attack you made outside this page", "Pasif sayılsın (gün)": "Count as inactive (days)", "Pasifleri kopyala": "Copy inactive", "Rakip faction": "Enemy faction", "Rakip faction yüklenmedi": "Enemy faction not loaded", "Rakip faction üyelerini çeker, hastane süresini canlı izler, FF'ye göre sıralar ve sıradaki hedefi verir.": "Fetches enemy faction members, tracks hospital time live, sorts by FF and gives you the next target.", "Ranked War modu": "Ranked War mode", "Sadece Okay olanlar": "Only Okay", "Sadece factionsızlar": "Only factionless", "Sadece kolaylar": "Only easy", "Sadece kârlılar": "Only profitable", "Sadece saldırılabilir": "Only attackable", "Sadece stokta olanlar": "Only in stock", "Saldırı sırası": "Attack queue", "Satırlardaki yüzde, rakibin tahmini toplam statının seninkine oranıdır ve bilgi içindir. Zorluk etiketi FF Scouter'ın Fair Fight değerine göre verilir. Rakip statları tahmindir, kendi statların Torn'dan gelen gerçek değerlerdir.": "The percentage on each row is the opponent's estimated total stats relative to yours and is for information only. The difficulty label comes from FF Scouter's Fair Fight value. Opponent stats are estimates; your own stats are real values from Torn.", "Satış kesintisi %": "Sales fee %", "Savaş sayacı": "War counter", "Sayacı sıfırla": "Reset counter", "Senin statların": "Your stats", "Sepet seviyesi": "Basket level", "Seviye (yüksek önce)": "Level (highest first)", "Seviyeye göre": "By level", "Seçilenleri sil": "Delete selected", "Seçimi temizle": "Clear selection", "Son eklenen önce": "Newest first", "Son kaydı geri al": "Undo last entry", "Sonraki açılışta son kullandığım modla başla": "Start with the last mode I used next time", "Standart": "Standard", "Statlarımı çek": "Fetch my stats", "Stok": "Stock", "Stok ve alış fiyatları herkese açık topluluk servislerinden (Prombot, yedek olarak YATA) gelir. Torn tarafındaki değer, Torn'un verdiği ortalama piyasa değeridir. Pazardaki gerçek en ucuz ilan farklı olabilir. Uçuş süreleri standart değerlerdir, kapasiteni ve uçuş türünü kendin gir.": "Stock and purchase prices come from public community services (Prombot, with YATA as backup). The Torn-side value is Torn's average market value. The cheapest real listing on the market may differ. Flight times are standard values; enter your own capacity and flight type.", "Süzgeçler": "Filters", "Süzgeçlere uyan yeni oyuncuları tarar ve doğrudan listene ekler": "Scans for new players matching the filters and adds them straight to your list", "Sıra modu": "Queue mode", "Sıra, aşağıdaki \"Sıralama\" seçimine göre dizilir. \"Sadece kolaylar\" ve \"Min networth\" süzgeçleri sıraya da uygulanır. Mug modunda networth'ü yüksek olanlar öne alınır ve 12 saat içinde mug ettiklerin atlanır.": "The queue follows the \"Sort\" choice below. The \"Only easy\" and \"Min networth\" filters also apply to the queue. In mug mode, high-networth targets come first and anyone you mugged in the last 12 hours is skipped.", "Sıradaki hedef": "Next target", "Sıradaki hedefe saldır": "Attack next target", "Sıralama": "Sort", "Taşıma kapasitesi": "Carry capacity", "Toplam stat (elle)": "Total stats (manual)", "Toplanan ve planlanan crime'lar, slotlardaki üyeler ve hiçbir crime'da olmayan üyeler. Ödül oranlarını Torn kendisi dağıtır, burada gösterilmez.": "Recruiting and planned crimes, the members in each slot, and members who are in no crime. Torn distributes the reward shares itself, so they are not shown here.", "Toplu ekle": "Bulk add", "Toplu seç": "Bulk select", "Torn bağlantısı": "Torn connection", "Torn'un verdiği yanıt (hata ayıklama)": "Torn's response (debug)", "Tüm veriyi yedekle": "Back up all data", "Uygula": "Apply", "Uçuş türü": "Flight type", "Verileri çek": "Fetch data", "Vuruş başı ücret": "Fee per hit", "Vuruşları çek": "Fetch hits", "WLT (yaklaşık -50%)": "WLT (about -50%)", "War ID / rapor ID": "War ID / report ID", "War vuruşları": "War hits", "War vuruşlarına göre payout hesapla, ödenenleri işaretle, her üye için ödeme sayfasını aç.": "Calculate payouts from war hits, mark who has been paid, and open the payment page for each member.", "Yalnızca kendi hesabın. Herkes kendi anahtarıyla kendi durumunu görür.": "Your own account only. Everyone sees their own status with their own key.", "Yedek": "Backup", "Yedek metni burada görünür. Geri yüklemek için buraya yapıştır ya da dosya seç.": "The backup text appears here. To restore, paste it here or choose a file.", "Yedek oluştur": "Create backup", "Yedeği geri yükle": "Restore backup", "Yeni, ilk sürüm": "New, first version", "Yenile": "Refresh", "Yukarıdaki \"Hedeflerimi çek\" düğmesi Torn'daki hedef listeni buraya getirir. API anahtarını kaydetmen yeterli.": "The \"Fetch my targets\" button above brings your Torn target list here. Just save your API key.", "Yukarıya rakip faction'ın ID'sini yazıp \"Üyeleri çek\"e bas. Torn API anahtarını aşağıdaki bölümden kaydetmen gerekir.": "Enter the enemy faction's ID above and press \"Fetch members\". You need to save your Torn API key in the section below.", "Yurtdışı fiyatları": "Abroad prices", "Yurtdışı mağaza stoklarını Torn piyasa değeriyle karşılaştırır, uçuş başına ve saat başına kârı hesaplar.": "Compares abroad shop stock with the Torn market value and calculates profit per flight and per hour.", "Zor: FF 4.5'a kadar": "Hard: up to FF 4.5", "Zorluk sınırı": "Difficulty limit", "boş": "empty", "bugün saldırılan": "attacked today", "en iyi kâr/saat": "best profit/hour", "hastanede": "in hospital", "hedef": "targets", "isim, ID veya not": "name, ID or note", "isteğe bağlı": "optional", "kalan ödeme": "remaining payout", "kârlı": "profitable", "otomatik": "automatic", "saldırıya hazır": "ready to attack", "sayfasından Limited Access seviyesinde bir anahtar oluştur.": "and create a key with Limited Access level.", "toplam vuruş": "total hits", "ve profil linkleri çalışır.": "and profile links work.", "ya da": "or", "Çarpan": "Multiplier", "Ödeme ayarları": "Payment settings", "Ödeme listesini kopyala": "Copy payment list", "Ödemeyi Torn kendi içinde yapar: \"Ödeme sayfası\" üyenin profilini açar, tutar yanında hazır durur ve \"Tutarı kopyala\" ile panoya alırsın. Bu araç para göndermez, yalnızca hesabı ve ödendi işaretini tutar.": "Payments are made inside Torn: \"Payment page\" opens the member's profile, the amount stays ready next to it and you copy it with \"Copy amount\". This tool does not send money; it only keeps the calculation and the paid mark.", "Ödendileri sıfırla": "Reset paid marks", "Özet": "Summary", "Ülke": "Country", "Üyeler": "Members", "Üyeleri çek": "Fetch members", "ör. 12345": "e.g. 12345", "ör. 250k": "e.g. 250k", "ör. 500m": "e.g. 500m", "ör. 850m veya 1.2b": "e.g. 850m or 1.2b", "ör. savunması zayıf, gece aktif": "e.g. weak defense, active at night", "ürün": "items", "üye": "members", "İsim": "Name", "İsim vuruş": "Name hits", "İsme göre": "By name", "İstersen ID'leri elle ya da aşağıdaki \"Toplu ekle\" bölümünden yapıştırabilirsin.": "You can also add IDs by hand or paste them in the \"Bulk add\" section below.", "İçe aktar": "Import", "← Modlar": "← Modes", " (FF Scouter: 2 ve altı kolay, 3.5 üstü zor).": " (FF Scouter: 2 or below is easy, above 3.5 is hard).", " / adet": " / unit", " Adı eksik olanlar için Durumları yenile düğmesini kullan.": " For missing names, use the Refresh statuses button.", " Arama istek sınırına ulaştı, durdu.": " Search hit the request limit and stopped.", " Arama yarıda kesildi: ": " Search was cut short: ", " Beş dakika sonra yeniden denenecek.": " Will retry in five minutes.", " En yakın hastane ya da hapis çıkışı: ": " Nearest hospital or jail release: ", " En yakın çıkış: ": " Nearest release: ", " FF Scouter bu süzgeçlerde daha fazla yeni oyuncu vermedi.": " FF Scouter gave no more new players with these filters.", " Rakibin tahmini statı seninkinin yaklaşık %": " The opponent's estimated stats are about ", " Tahmin kesin değildir.": " The estimate is not exact.", " aday tarandı, ": " candidates scanned, ", " aday tarandı": " candidates scanned", " adayın FF değeri yok.": " candidates have no FF value.", " adayın networth değeri alınamadı.": " candidates' networth could not be fetched.", " alındı)": ")", " alındı": " fetched", " bölüm alınamadı: ": " sections could not be fetched: ", " crime alındı, ": " crimes fetched, ", " enerji harcar. Son güncelleme: ": " energy. Last update: ", " gün ve üstü).": " days or more).", " güncellendi": " updated", " hedef alındı.)": " targets fetched.)", " hedef alındı: ": " targets fetched: ", " hedef için FF değeri alındı.": " targets' FF values fetched.", " hedef sırada.": " targets in the queue.", " hedefin networth değeri alındı.": " targets' networth fetched.", " kayıt geri yüklendi, sayfa yenileniyor…": " records restored, reloading the page…", " kopyalandı.": " copied.", " mug koruması kalktı": " mug protections removed", " önce aktifti": " ago was active", " saldırı": " attacks", " satır eklendi.": " lines added.", " satır okunamadı": " lines could not be read", " tanesi daha önce görüldüğü için atlandı. \"Görülenleri sıfırla\" düğmesini kullan ya da seviye ve FF ayarlarını gevşet.": " were skipped because they were seen before. Use the \"Reset seen\" button or loosen the level and FF settings.", " tanesi daha önce görüldüğü için atlandı": " were skipped because they were seen before", " tanesi güncellendi": " were updated", " tanesi networth şartına uyuyor": " match the networth requirement", " tanesi zaten vardı": " were already there", " zaten listede, eksik bilgiler tamamlandı.": " already in the list, missing info filled in.", " · Mug modu açık, bu saldırı mug olarak işaretlenir": " · Mug mode is on, this attack will be marked as a mug", " · hazır: ": " · ready: ", " · tavan ~": " · ceiling ~", " ürün alındı (": " items fetched (", " ürün gösteriliyor": " items shown", " üye alındı, son güncelleme ": " members fetched, last update ", " üye alındı.": " members fetched.", " üye gösteriliyor": " members shown", ". Anahtarın ffscouter.com sitesinde kayıtlı olduğundan emin ol.": ". Make sure your key is registered on ffscouter.com.", ". Mug nakdin yaklaşık yüzde 5 kadarını alır. Networth nakitten fazlasını içerdiği için bu bir tavandır, gerçek kazanç genelde çok daha düşüktür.": ". A mug takes about 5% of cash. Networth includes more than cash, so this is a ceiling; the real gain is usually much lower.", ". Stat değeri bir tahmindir.": ". The stat value is an estimate.", ". Tarayıcı bu sitelere istek atmayı engelliyor olabilir, Tampermonkey sürümünde bu sorun olmaz.": ". The browser may be blocking requests to these sites; this doesn't happen in the Tampermonkey version.", "Mug koruması %": "Mug protection %", "Sıfırlamadan beri": "Since reset", "Sırada: ": "Next: ", "Bugün saldırı": "Attacks today", "Bugün tahmini tatlı": "Estimated treats today", "Kaynak": "Source", "Son 1 saat": "Last hour", "Tatlı şansı": "Treat chance", "Hiçbir crime'da olmayan üyeler (": "Members in no crime (", "Atla": "Skip", "Vazgeç": "Cancel", "Düzenle": "Edit", "Mug ettim": "I mugged", "Tutarı kopyala": "Copy amount", "Kaydet": "Save", "Barlar": "Bars", "Para": "Money", "Seyahat": "Travel", "Herkes bir crime'da.": "Everyone is in a crime.", "Süzgeçlere uyan ürün yok.": "No items match the filters.", "Eşleşen hedef yok": "No matching targets", "Süzgeçlere uyan üye yok": "No members match the filters", "Henüz veri yok. \"Yenile\"ye bas.": "No data yet. Press \"Refresh\".", "Veri geldi ama tanınan bir alan yok. Hata ayıklama kutusuna bakıp bana gönder.": "Data arrived but no known field was found. Check the debug box and send it to the developer.", "Listede": "In list", "Okay": "Okay", "BOŞ": "EMPTY", "Bugün": "Today", "Hariç": "Excluded", "Yeni": "New", "dolmasına ": "until full: ", "varışa ": "arrives in ", "yolculuk yok": "not travelling", "stok ": "stock ", "alış ": "buy ", "uçuş ": "flight ", "Son aktif: ": "Last active: ", " Ödendi": " Paid", "API anahtarı geçersiz. Anahtarı kontrol et.": "API key is invalid. Check the key.", "Adaylar alınamadı.": "Candidates could not be fetched.", "Alınamadı.": "Could not be fetched.", "Anahtar 16 harf ve rakamdan oluşur. Boşluk veya fazladan karakter olmasın.": "The key is 16 letters and digits. No spaces or extra characters.", "Anahtar bu tarayıcıdan silindi.": "The key was deleted from this browser.", "Anahtar harf ve rakamdan oluşur. Boşluk veya fazladan karakter olmasın.": "The key consists of letters and digits. No spaces or extra characters.", "Anahtar kayıtlı. Değiştirmek için yenisini yapıştır": "Key saved. Paste a new one to change it", "Arama yarıda kesildi.": "Search was cut short.", "Bağlantı kurulamadı.": "Could not connect.", "Beklenmeyen yanıt": "Unexpected response", "Bir saldırı ": "An attack ", "Birleşik Krallık": "United Kingdom", "Bu anahtarın erişim seviyesi yetmiyor. Limited Access seviyesinde yeni bir anahtar oluştur.": "This key's access level is not enough. Create a new key with Limited Access level.", "Bu araca ait bir yedek değil.": "This is not a backup of this tool.", "Bu geçerli bir yedek değil.": "This is not a valid backup.", "Bu tarayıcı kayıt tutmuyor. Sayfayı kapatınca liste silinir. \"Excel'e kopyala ve yedekle\" bölümünden yedek al.": "This browser doesn't keep data. The list is lost when you close the page. Make a backup from the \"Copy to Excel and back up\" section.", "Cayman Adaları": "Cayman Islands", "Crime listesi bulunamadı. Hata ayıklama kutusundaki yanıtı bana gönder.": "Crime list not found. Send the response in the debug box to the developer.", "Cüzdan": "Wallet", "Durum henüz kontrol edilmedi": "Status not checked yet", "Durum ": "Status ", " kontrol edildi": " checked", "Emin misin? Sil": "Are you sure? Delete", "Emin misin? Sıfırla": "Are you sure? Reset", "Emin misin? Temizle": "Are you sure? Clear", "Emin misin? ": "Are you sure? ", " hedefi sil": " targets: delete", "Enerji Torn dan alınıyor.": "Fetching energy from Torn.", "Enerji alınamadı": "Could not fetch energy", "Eşya fiyatları bulunamadı.": "Item prices not found.", "FF Scouter anahtarı kaydedildi.": "FF Scouter key saved.", "FF Scouter anahtarı yok, FF gösterilmiyor.": "No FF Scouter key, FF is not shown.", "FF Scouter beklenmedik bir yanıt verdi. Anahtarın ffscouter.com sitesinde kayıtlı olmalı.": "FF Scouter gave an unexpected response. Your key must be registered on ffscouter.com.", "FF Scouter bu filtrelerle aday bulamadı. Seviye aralığını genişlet.": "FF Scouter found no candidates with these filters. Widen the level range.", "FF Scouter bu hedefler için tahmin vermedi.": "FF Scouter gave no estimate for these targets.", "FF Scouter değerleri alınıyor…": "Fetching FF Scouter values…", "FF Scouter okunabilir bir yanıt vermedi (HTTP ": "FF Scouter gave no readable response (HTTP ", "FF Scouter servisine bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın ffscouter.com adresine istek atmasını engelliyor olabilir.": "Could not connect to FF Scouter. Check your internet. If this continues, the browser may be blocking this page from requesting ffscouter.com.", "FF Scouter çok sık istek geldiğini söylüyor. Bir dakika bekle.": "FF Scouter says there are too many requests. Wait a minute.", "FF Scouter çok sık istek geldiğini söylüyor.": "FF Scouter says there are too many requests.", "FF Scouter'a bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın ffscouter.com'a istek atmasını engelliyor olabilir.": "Could not connect to FF Scouter. Check your internet. If this continues, the browser may be blocking this page from requesting ffscouter.com.", "FF alınamadı: ": "FF could not be fetched: ", "FF anahtarı kayıtlı": "FF key saved", "FF değerleri alınamadı.": "FF values could not be fetched.", "Geçerli bir faction ID si yaz. Profil linkini de yapıştırabilirsin.": "Enter a valid faction ID. You can also paste a profile link.", "Geçerli bir oyuncu ID'si yaz. Profil linkini de yapıştırabilirsin.": "Enter a valid player ID. You can also paste a profile link.", "Görülen oyuncu kaydı sıfırlandı. Listendeki hedefler yine de tekrar gösterilmez.": "The seen-player record was reset. Targets already in your list still won't be shown again.", "Görülenleri sıfırla (": "Reset seen (", "Güncellendi ": "Updated ", "Güney Afrika": "South Africa", "Günlük networth": "Daily networth", "Güç": "Strength", "Hata oluştu.": "An error occurred.", "Havuz doldurulamadı.": "The pool could not be filled.", "Havuz tutarı ve vuruş sayısı gerekli.": "Pool amount and hit count are required.", "Hazır": "Ready", "Hedeflerin Torn'dan çekiliyor…": "Fetching your targets from Torn…", "Hız": "Speed", "Kayıtlı anahtar kullanılıyor. Değiştirmek için yenisini yapıştır.": "Using the saved key. Paste a new one to change it.", "Kopyalanamadı, tutar: ": "Could not copy, amount: ", "Kopyalanamadı.": "Could not copy.", "Kopyalandı.": "Copied.", "Liste kopyalandı.": "List copied.", "Liste ve API anahtarı yalnızca bu tarayıcıda saklanır.": "The list and API key are stored only in this browser.", "Metni seçtim. Ctrl+C ile kopyala.": "Text selected. Copy with Ctrl+C.", "Mülk kasası": "Property vault", "Networth alınıyor: ": "Fetching networth: ", "OC'ler çekiliyor…": "Fetching OCs…", "Okunabilen ID bulunamadı.": "No readable ID found.", "Otomatik durum kontrolü durdu: ": "Automatic status check stopped: ", "Pasif listesi kopyalandı.": "Inactive list copied.", "Planlanıyor": "Planning", "Rakip/ben %": "Opponent/me %", "Rapor geldi ama vuruş sayılarını bulamadım. Hata ayıklama kutusundaki yanıtı bana gönder, düzelteyim. Şimdilik elle yapıştırabilirsin.": "The report arrived but I couldn't find the hit counts. Send the response in the debug box to the developer. For now you can paste manually.", "Saldırı linki": "Attack link", "Son saldırı": "Last attack", "Statlar alınamadı.": "Stats could not be fetched.", "Statların alınıyor…": "Fetching your stats…", "Statların güncellendi.": "Your stats were updated.", "Süzgeçlere ve ara süreye uyan saldırılabilir hedef kalmadı. Hedef bulucudan \"Havuzu doldur\" ile yeni hedef ekleyebilir ya da ara süreyi kısaltabilirsin.": "No attackable targets left that match the filters and gap. Add new targets with \"Fill the pool\" in the finder, or shorten the gap.", "Süzgeçlere ve ara süreye uyan saldırılabilir üye yok. FF aralığını genişletebilir ya da hastane çıkışlarını bekleyebilirsin.": "No attackable members match the filters and gap. Widen the FF range or wait for hospital releases.", "Sıfırlandı · ": "Reset · ", "Sıfırlandı": "Reset", "Toplam statı 850m, 1.2b ya da 950000000 gibi yaz.": "Enter total stats like 850m, 1.2b or 950000000.", "Toplanıyor": "Recruiting", "Toplu seçimi kapat": "Close bulk select", "Torn anahtarı yok, Torn değerleri gösterilemiyor.": "No Torn key, Torn values cannot be shown.", "Torn değeri yok": "No Torn value", "Torn enerji değerini vermedi.": "Torn did not return the energy value.", "Torn eşya listesi beklenmeyen biçimde geldi.": "The Torn item list arrived in an unexpected format.", "Torn fiyatları alınamadı: ": "Torn prices could not be fetched: ", "Torn networth değerini vermedi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.": "Torn did not return the networth value. If you send the debug box below to the developer, it can be fixed.", "Torn okunabilir bir yanıt vermedi (HTTP ": "Torn gave no readable response (HTTP ", "Torn çok sık istek geldiğini söylüyor. Bir dakika bekleyip tekrar dene.": "Torn says there are too many requests. Wait a minute and try again.", "Torn üye listesini vermedi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.": "Torn did not return the member list. If you send the debug box below to the developer, it can be fixed.", "Torn'a bağlanılamadı. İnternetini kontrol et. Sorun sürerse tarayıcı bu sayfanın Torn API'sine istek atmasını engelliyor olabilir.": "Could not connect to Torn. Check your internet. If this continues, the browser may be blocking this page from calling the Torn API.", "Torn'da hedef listen boş görünüyor.": "Your target list in Torn looks empty.", "Torn'dan beklenmeyen bir yanıt geldi. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim.": "An unexpected response came from Torn. If you send the debug box below to the developer, it can be fixed.", "Torn'un yanıtından statlarını okuyamadım. Aşağıdaki hata ayıklama kutusunu bana gönderirsen düzeltirim. Toplamı elle de yazabilirsin.": "Could not read your stats from Torn's response. If you send the debug box below to the developer, it can be fixed. You can also enter the total by hand.", "Tıbbi": "Medical", "Veriler çekiliyor…": "Fetching data…", "Vuruş başı ücret ": "Fee per hit ", " oldu.": " now.", "Vuruşlar çekiliyor…": "Fetching hits…", "Yedek hazır. Metni kopyalayıp bir yere kaydet.": "Backup ready. Copy the text and save it somewhere.", "Yeni aday çıkmadı: ": "No new candidates: ", "Yeni adaylar aranıyor: ": "Searching for new candidates: ", "Yeni adaylar aranıyor…": "Searching for new candidates…", "Yurtdışı": "Abroad", "Yurtdışı stok verisi alınamadı": "Abroad stock data could not be fetched", "bağlantı hatası": "connection error", "hiç saldırılmadı": "never attacked", "Çeviklik": "Agility", "Çin": "China", "Önce API anahtarını kaydet.": "Save your API key first.", "Önce Torn API anahtarını kaydet. Faction bilgisi için anahtarın faction erişimi olmalı.": "Save your Torn API key first. For faction info, the key needs faction access.", "Önce Torn API anahtarını kaydet.": "Save your Torn API key first.", "Önce anahtarı yapıştır.": "Paste the key first.", "Önce bir API anahtarı kaydet.": "Save an API key first.", "Önce diğer işlemin bitmesini bekle.": "Wait for the other operation to finish first.", "Önce listeye hedef ekle. Hedef bulucudaki \"Havuzu doldur\" düğmesi bunu toplu yapar.": "Add targets to the list first. The \"Fill the pool\" button in the finder does this in bulk.", "Önce listeye hedef ekle.": "Add targets to the list first.", "Önce rakip faction üyelerini çek.": "Fetch the enemy faction members first.", "Üye listesi bulunamadı. Hata ayıklama kutusundaki yanıtı bana gönder.": "Member list not found. Send the response in the debug box to the developer.", "Üyeler alınamadı.": "Members could not be fetched.", "Üyeler çekiliyor…": "Fetching members…", "ödendi": "paid", "İlaç (drug)": "Drug", "İndirilemedi, \"Yedek oluştur\" ile metni kopyala.": "Could not download; copy the text with \"Create backup\".", "İsviçre": "Switzerland", "Şirket": "Company", "Meksika": "Mexico", "Kanada": "Canada", "Hawaii": "Hawaii", "Arjantin": "Argentina", "Japonya": "Japan", "BAE": "UAE", "Hastanede": "In hospital", "Hapiste": "In jail", "Yolda": "Traveling", "Federal": "Federal", "Saldır": "Attack", "Profil": "Profile", "Sil": "Delete", "Ödeme sayfası": "Payment page", "Dahil et": "Include", "Hepsini seç": "Select all", "Seç": "Select", "Vuruş": "Hits", "Kapat": "Close", "Geniş": "Wide", "Mini pencere": "Mini window", "Mini pencereye geç": "Switch to mini window", "Genişlet": "Expand", "Saldırıyı aynı sekmede aç ve mini pencereye geç": "Open attacks in the same tab and switch to the mini window", "Mug sırası": "Mug queue", "War sırası": "War queue", "Sırada hedef yok": "No target in the queue", "Tam pencereyi aç": "Open the full window", "Bugün saldırı: ": "Attacks today: ", "Sıra": "Queue", "Dil": "Language", "isimsiz": "unnamed", "Hedef aracı": "Target tool", "Halloween sayacı · bugün": "Halloween counter · today", "Tatlı": "Treats", "tatlı": "treats", "Tavan": "Ceiling", "tavan": "ceiling", "Mug koruması": "Mug protection", "Yan değiştir": "Switch side", " pasif (": " inactive (", "Kapat ×": "Close ×", " seçili": " selected", " kadarı.": "% of yours.", "Ad [1234567]\n7654321 Başka Ad\nhttps://www.torn.com/profiles.php?XID=1111111": "Name [1234567]\n7654321 Other Name\nhttps://www.torn.com/profiles.php?XID=1111111", "/ saat": "/ hour", " (durum ": " (status ", "Mug sonrası kalan nakit 12 saat boyunca doğrusal azalan bir korumada. Kalan koruma yaklaşık %": "After a mug, the remaining cash is protected on a scale that decreases linearly over 12 hours. Remaining protection is about %", "Fair Fight tahmini": "Fair Fight estimate", ", stok verisi ": ", stock data ", " alındı.": " fetched."};
  var lang = 'tr';
  var UIROOT = (typeof root !== 'undefined') ? root : document;
  var I18N_ROOT = (typeof root !== 'undefined') ? root : document.body;
  var enRe = null, enCache = new Map(), trState = new Map(), trAttrState = new Map();
  var TR_ATTRS = ['placeholder', 'title', 'aria-label'];
  (function () {
    var parts = Object.keys(EN_DICT).filter(function (k) { return k.length > 6; });
    parts.sort(function (a, b) { return b.length - a.length; });
    enRe = new RegExp(parts.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|'), 'g');
  })();
  function loc() { return lang === 'en' ? 'en-GB' : 'tr-TR'; }
  var TIME_RULES = [
    [/(\d+) dk önce/g, '$1 min ago'], [/(\d+) sa önce/g, '$1 h ago'], [/(\d+) gün önce/g, '$1 d ago'], [/\baz önce\b/g, 'just now'], [/\baz kaldı\b/g, 'soon'],
    [/(\d+) sa (\d+) dk/g, '$1 h $2 min'], [/(\d+) gün (\d+) sa/g, '$1 d $2 h'],
    [/(\d+) dk(?![A-Za-zçğıöşüÇĞİÖŞÜ])/g, '$1 min'], [/(\d+) sa(?![A-Za-zçğıöşüÇĞİÖŞÜ])/g, '$1 h'], [/(\d+) gün(?![A-Za-zçğıöşüÇĞİÖŞÜ])/g, '$1 d'],
    [/(\d+) sn(?![A-Za-zçğıöşüÇĞİÖŞÜ])/g, '$1 s'],
    [/(\d+) üye, /g, '$1 members, '], [/\balış (?=[$\d])/g, 'buy '], [/\buçuş (?=[$\d])/g, 'flight '], [/\bstok (?=\d)/g, 'stock '], [/\bDurum (?=\d|az |just)/g, 'Status '], [/\bEnerji (?=\d)/g, 'Energy '], [/\b1 (target|member|item|crime|attack)s\b/g, '1 $1'], [/^Kolay(?= · %|$)/, 'Easy'], [/^Orta(?= · %|$)/, 'Medium'], [/^Zor(?= · %|$)/, 'Hard']
  ];
  function trEN(s) {
    if (enCache.has(s)) return enCache.get(s);
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2], out;
    if (!core) out = s;
    else if (Object.prototype.hasOwnProperty.call(EN_DICT, core)) out = m[1] + EN_DICT[core] + m[3];
    else {
      out = s.replace(enRe, function (x) { return EN_DICT[x]; });
      for (var i = 0; i < TIME_RULES.length; i++) out = out.replace(TIME_RULES[i][0], TIME_RULES[i][1]);
    }
    if (enCache.size > 6000) enCache.clear();
    enCache.set(s, out);
    return out;
  }
  function trText(n) {
    var cur = n.data, st = trState.get(n);
    if (st && cur === st.en) return;
    var en = trEN(cur);
    if (en !== cur) { trState.set(n, { tr: cur, en: en }); n.data = en; } else if (st) trState.delete(n);
  }
  function trAttrs(el) {
    TR_ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var cur = el.getAttribute(a), key = a, map = trAttrState.get(el) || {}, st = map[key];
      if (st && cur === st.en) return;
      var en = trEN(cur);
      if (en !== cur) { map[key] = { tr: cur, en: en }; trAttrState.set(el, map); el.setAttribute(a, en); } else if (st) { delete map[key]; }
    });
  }
  function trTree(node) {
    if (node.nodeType === 3) { trText(node); return; }
    if (node.nodeType !== 1 && node.nodeType !== 11) return;
    if (node.nodeType === 1) {
      var tg = node.tagName;
      trAttrs(node);
      if (tg === 'SCRIPT' || tg === 'STYLE' || tg === 'TEXTAREA') return;
    }
    var ch = node.childNodes;
    for (var i = 0; i < ch.length; i++) trTree(ch[i]);
  }
  function trRestore() {
    trState.forEach(function (st, n) { if (n.data === st.en) n.data = st.tr; });
    trAttrState.forEach(function (map, el) { Object.keys(map).forEach(function (a) { if (el.getAttribute(a) === map[a].en) el.setAttribute(a, map[a].tr); }); });
    trState.clear(); trAttrState.clear();
  }
  function setLang(l, initial) {
    lang = l === 'en' ? 'en' : 'tr';
    lsSet(LANG_LS, lang);
    var bs = UIROOT.querySelectorAll('[data-lang]');
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-lang') === lang);
    if (!HOSTAPI) { document.documentElement.lang = lang; document.title = 'Torn-Helper'; }
    if (lang === 'en') trTree(I18N_ROOT);
    else trRestore();
    if (!initial) {
      enCache.clear();
      [render, renderWar, renderFac, renderMem, renderOc, renderMe, renderTrv, miniRender].forEach(function (f) { try { f(true); } catch (e) {} });
    }
  }
  function initI18n() {
    var saved = lsGet(LANG_LS);
    var start = saved || (/^tr/i.test(navigator.language || '') ? 'tr' : 'en');
    new MutationObserver(function (muts) {
      if (lang !== 'en') return;
      muts.forEach(function (m) {
        if (m.type === 'childList') { for (var i = 0; i < m.addedNodes.length; i++) trTree(m.addedNodes[i]); }
        else if (m.type === 'characterData') trText(m.target);
        else if (m.type === 'attributes') trAttrs(m.target);
      });
    }).observe(I18N_ROOT, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TR_ATTRS });
    UIROOT.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-lang]');
      if (b) setLang(b.getAttribute('data-lang'));
    });
    setInterval(function () { trState.forEach(function (st, n) { if (!n.isConnected) trState.delete(n); }); trAttrState.forEach(function (m, el) { if (!el.isConnected) trAttrState.delete(el); }); }, 20000);
    setLang(start, true);
  }

  /* ---------- mini pencere ---------- */
  var HOSTAPI = (typeof THOST !== 'undefined') ? THOST : null;
  function fullOpen() { return HOSTAPI ? HOSTAPI.state() === 'full' : true; }
  function miniMode() { return HOSTAPI && HOSTAPI.ui.miniMode === 'war' ? 'war' : 'halloween'; }
  function miniOn(m) { return !!HOSTAPI && HOSTAPI.state() === 'mini' && miniMode() === m; }
  var lastMAtk = 0;
  function miniRender() {
    if (!HOSTAPI || HOSTAPI.state() !== 'mini') return;
    var body = $('mini-b');
    if (!body) return;
    var isWar = miniMode() === 'war', q = isWar ? wQueue() : queueList(), cur = q[0], today = 0;
    $('mini-title').textContent = isWar ? 'War sırası' : (cfg.mug ? 'Mug sırası' : 'Sıra');
    if (isWar) { var td = new Date().toDateString(); war.hits.forEach(function (h) { if (new Date(h.t).toDateString() === td) today++; }); }
    else today = all().filter(function (t) { return isToday(t.lastAttack); }).length;
    if (!cur) {
      body.innerHTML = '<p class="hint" style="margin:0 0 8px">Sırada hedef yok</p><button type="button" class="btn" id="m-full">Tam pencereyi aç</button>';
      return;
    }
    var chips = isWar ? wStatusChip(cur) + ffChip(cur) + ratioChip(cur) : statusChip(cur) + ffChip(cur) + ratioChip(cur) + nwChip(cur) + mugChip(cur);
    var nxt = q.slice(1, 4).map(function (t) { return esc(t.name || ('#' + t.id)); }).join(', ');
    body.innerHTML = '<div class="qcard"><div class="who"><span class="name">' + esc(cur.name || (isWar ? '#' + cur.id : 'isimsiz')) + '</span>' +
      '<span class="uid">#' + esc(cur.id) + (cur.level ? ' · Sv ' + esc(cur.level) : '') + '</span>' + chips + '</div>' +
      '<div class="qmeta">' + (!isWar && cur.note ? esc(cur.note) + ' · ' : '') + 'Bugün saldırı: ' + today + ' · ' + q.length + ' hedef sırada.</div>' +
      '<div class="qbtns"><a id="m-atk" class="atk" data-id="' + esc(cur.id) + '" href="' + esc(atkUrl(cur.id)) + '" target="_self">Saldır</a>' +
      '<button type="button" class="btn" id="m-skip">Atla</button></div>' +
      (nxt ? '<div class="qnext">Sırada: ' + nxt + '</div>' : '') + '</div>';
  }
  function initMini() {
    if (!HOSTAPI) return;
    var sync = function () { var cs = UIROOT.querySelectorAll('.opt-same'); for (var i = 0; i < cs.length; i++) cs[i].checked = !!HOSTAPI.ui.sameTab; };
    sync();
    UIROOT.addEventListener('change', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('opt-same')) { HOSTAPI.ui.sameTab = ev.target.checked; HOSTAPI.save(); sync(); }
    });
    UIROOT.addEventListener('click', function (ev) {
      var mb = ev.target.closest('[data-mini]');
      if (mb) { var m = mb.getAttribute('data-mini'); HOSTAPI.setMini(m === 'auto' ? (curView === 'war' ? 'war' : 'halloween') : m); return; }
      var a = ev.target.closest('a[href*="sid=attack"]');
      if (a && HOSTAPI.ui.sameTab && HOSTAPI.state() === 'full') {
        a.setAttribute('target', '_self'); a.removeAttribute('rel');
        var mode = curView === 'war' ? 'war' : 'halloween';
        HOSTAPI.prepare(mode);
        setTimeout(function () { HOSTAPI.setMini(mode); }, 60);
      }
    }, true);
    var body = $('mini-b');
    if (body) body.addEventListener('click', function (ev) {
      var a = ev.target.closest('#m-atk');
      if (a) {
        var now = Date.now();
        if (now - lastMAtk < 400) { ev.preventDefault(); return; }
        lastMAtk = now;
        if (miniMode() === 'war') warHit(a.getAttribute('data-id')); else recordAttack(a.getAttribute('data-id'), cfg.mug);
        return;
      }
      if (ev.target.closest('#m-skip')) { if (miniMode() === 'war') warSkipCurrent(); else skipCurrent(); miniRender(); return; }
      if (ev.target.closest('#m-full')) HOSTAPI.setState('full');
    });
    var lastSt = HOSTAPI.state();
    HOSTAPI.onchange = function (st) {
      var prev = lastSt; lastSt = st;
      if (st === 'full') { if (prev === 'mini') showView(miniMode()); else enterCurView(curView || 'home'); }
      if (st === 'mini') {
        if (miniMode() === 'war') { renderWar(); if (getKey() && war.fid && Date.now() - (war.fetchedAt || 0) > 20000) warLoad(false); }
        else render(false);
      }
      miniRender();
    };
    setInterval(miniRender, 4000);
    if (HOSTAPI.state() === 'mini') HOSTAPI.onchange('mini');
  }

  /* ---------- hata bildir ---------- */
  var APP_VERSION = '1.4.0', REPO = 'DgkYY/Torn-Helper';
  function maskKeys(t) { return String(t || '').replace(/\b[A-Za-z0-9]{16}\b/g, '[key]').replace(/(key=)[^&\s"']+/gi, '$1[key]'); }
  function bugReport() {
    var msgs = [], ms = UIROOT.querySelectorAll('.msg');
    for (var i = 0; i < ms.length; i++) { var t = (ms[i].textContent || '').trim(); if (t) msgs.push('- ' + t); }
    var dbg = $('dbg-t') ? $('dbg-t').value : '';
    var body = '> Bu issue herkese açıktır. Göndermeden önce özel bilgileri (para, statlar, isimler) sil. / This issue is public. Remove private info (money, stats, names) before submitting.\n\n**Sorunu anlat / Describe the problem:**\n\n\n\n---\n' +
      'Version: ' + APP_VERSION + (HOSTAPI ? ' (userscript)' : ' (html)') + '\n' +
      'Mode: ' + (curView || '-') + '\n' +
      'Language: ' + lang + '\n' +
      'Browser: ' + (navigator.userAgent || '') + '\n' +
      (msgs.length ? '\nMessages:\n' + maskKeys(msgs.join('\n')).slice(0, 1200) + '\n' : '') +
      (dbg ? '\nDebug response (key removed):\n```\n' + maskKeys(dbg).slice(0, 1800) + '\n```\n' : '');
    return { title: 'Bug: ', body: body };
  }
  function initBug() {
    $('foot-ver').textContent = 'Torn-Helper v' + APP_VERSION;
    $('bug-open').addEventListener('click', function () {
      var r = bugReport();
      var url = 'https://github.com/' + REPO + '/issues/new?title=' + encodeURIComponent(r.title) + '&body=' + encodeURIComponent(r.body);
      window.open(url, '_blank', 'noopener');
    });
    $('bug-copy').addEventListener('click', function () {
      copyText(bugReport().body).then(function (ok) { say('status', ok ? 'Rapor kopyalandı. Geliştiriciye gönder.' : 'Rapor kopyalanamadı.', !ok); });
    });
  }

  /* ---------- uçuş önerileri (seyahat sayfası) ---------- */
  var tips = { sort: 'hour', dismissed: false, visible: false, timer: null };
  function tipsRows() {
    var key = tips.sort === 'trip' ? 'trip' : 'hour';
    return trv.rows.map(trvCalc).filter(function (o) { return o.unit != null && o.unit > 0 && o.r.qty > 0; })
      .sort(function (a, b) { return b[key] - a[key]; }).slice(0, 5);
  }
  function renderTips() {
    var b = $('tips-b');
    if (!b || !tips.visible) return;
    $('tips-title').textContent = 'Uçuş önerileri';
    if (!trv.rows.length) { b.innerHTML = '<p class="hint" style="margin:0">Veriler çekiliyor, birkaç saniye…</p>'; return; }
    var rows = tipsRows();
    var head = '<div class="tips-sort"><button type="button" class="btn' + (tips.sort === 'hour' ? ' on' : '') + '" data-tsort="hour">Kâr/saat</button><button type="button" class="btn' + (tips.sort === 'trip' ? ' on' : '') + '" data-tsort="trip">Kâr/uçuş</button>' +
      '<span class="dim">Kapasite ' + esc(trv.cfg.cap) + '</span></div>';
    if (!rows.length) { b.innerHTML = head + '<p class="hint" style="margin:6px 0 0">Kârlı ürün bulunamadı. Torn API anahtarını kaydet ya da süzgeçleri gevşet.</p>'; return; }
    b.innerHTML = head + rows.map(function (o) {
      var r = o.r;
      return '<div class="tip"><div class="tip1"><b>' + esc(r.name || ('#' + r.id)) + '</b> <span class="dim">' + esc(CTRY[r.c][0]) + '</span></div>' +
        '<div class="tip2 mono"><span class="chip ok">+' + money(o.unit) + ' / adet</span> <span>uçuş ' + money(o.trip) + '</span> <span><b>' + money(o.hour) + '</b> / saat</span> <span class="dim">stok ' + r.qty + '</span></div></div>';
    }).join('');
  }
  function showTips() {
    var el = $('tips');
    if (!el || tips.dismissed) return;
    tips.visible = true; el.hidden = false;
    renderTips();
    if (!trv.rows.length || Date.now() - trv.stockAt > 90000) trvLoad(false).then(renderTips);
    clearInterval(tips.timer);
    tips.timer = setInterval(function () {
      if (!tips.visible || document.hidden) return;
      if (Date.now() - trv.stockAt > 55000 && pollOk('trv', 55000)) trvLoad(false).then(renderTips); else renderTips();
    }, 20000);
  }
  function hideTips() {
    tips.visible = false; clearInterval(tips.timer);
    var el = $('tips'); if (el) el.hidden = true;
  }
  function initTips() {
    if (!HOSTAPI || !$('tips')) return;
    HOSTAPI.travelEnter = function () { if (HOSTAPI.ui.tips === false) return; tips.dismissed = false; showTips(); };
    HOSTAPI.travelLeave = function () { hideTips(); };
    var sync = function () { var cs = UIROOT.querySelectorAll('.opt-tips'); for (var i = 0; i < cs.length; i++) cs[i].checked = HOSTAPI.ui.tips !== false; };
    sync();
    UIROOT.addEventListener('change', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('opt-tips')) { HOSTAPI.ui.tips = ev.target.checked; HOSTAPI.save(); sync(); if (!ev.target.checked) hideTips(); }
    });
    $('tips').addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-tsort]');
      if (t) { tips.sort = t.getAttribute('data-tsort'); renderTips(); return; }
      if (ev.target.closest('#tips-x')) { tips.dismissed = true; hideTips(); return; }
      if (ev.target.closest('#tips-all')) { HOSTAPI.setState('full'); showView('trv'); }
    });
    if (HOSTAPI.onTravel()) HOSTAPI.travelEnter();
  }

  /* ---------- başlangıç ---------- */
  loadLocal();
  if (ffOwnKey()) $('ff-key').placeholder = 'FF anahtarı kayıtlı';
  if (getKey()) $('api-key').placeholder = 'Anahtar kayıtlı. Değiştirmek için yenisini yapıştır';
  if (!storeOk) setStatus('Bu tarayıcı kayıt tutmuyor. Sayfayı kapatınca liste silinir. "Excel\'e kopyala ve yedekle" bölümünden yedek al.', true);
  else setStatus('Liste ve API anahtarı yalnızca bu tarayıcıda saklanır.', false);
  loadCfg();
  loadLog();
  loadSeen();
  applyCfgToInputs();
  loadMy();
  renderStats();
  render(true);
  setInterval(function () { render(false); }, 60000);
  setInterval(function () { if (!document.hidden && isOpen() && pollOk('energy', 45000)) fetchEnergy(); }, 45000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && isOpen()) fetchEnergy(); });
  initViews();
  initI18n();
  initMini();
  initTips();
  initBug();
})();

  }

  openBtn.addEventListener('click', function () { setState('full'); });
  root.getElementById('x-close').addEventListener('click', function () { setState('btn'); });
  root.getElementById('x-wide').addEventListener('click', function () { ui.wide = !ui.wide; saveUi(); applyUi(); });
  root.getElementById('mini-x').addEventListener('click', function () { setState('btn'); });
  root.getElementById('mini-full').addEventListener('click', function () { setState('full'); });
  root.getElementById('mini-side').addEventListener('click', function () { ui.side = ui.side === 'left' ? 'right' : 'left'; saveUi(); applyUi(); });
  root.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && ui.state === 'full' && ev.target && !/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName || '')) setState('btn');
  });
  applyUi();
  if (ui.state !== 'btn') boot();
  checkTravel();
  setInterval(checkTravel, 2000);
})();
