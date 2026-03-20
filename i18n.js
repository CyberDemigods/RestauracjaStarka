/* ============================================================
   Hotel Starka — i18n (Internationalization) Module
   Requires: translations.js loaded before this file.
   ============================================================ */

(function () {
  'use strict';

  // ---- Config -----------------------------------------------
  var SUPPORTED_LANGS = ['pl', 'en', 'de', 'fr', 'es', 'it', 'cs', 'ru', 'uk', 'nl'];
  var DEFAULT_LANG = 'pl';
  var STORAGE_KEY = 'hotel_lang';

  var LANG_LABELS = {
    pl: 'PL',
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
    it: 'IT',
    cs: 'CS',
    ru: 'RU',
    uk: 'UA',
    nl: 'NL'
  };

  var LANG_NAMES = {
    pl: 'Polski',
    en: 'English',
    de: 'Deutsch',
    fr: 'Francais',
    es: 'Espanol',
    it: 'Italiano',
    cs: 'Cestina',
    ru: 'Russkij',
    uk: 'Ukrainska',
    nl: 'Nederlands'
  };

  // ---- Inject CSS -------------------------------------------
  function injectStyles() {
    var css = [
      // Wrapper
      '.lang-switcher {',
      '  position: relative;',
      '  display: inline-block;',
      '  margin-left: 12px;',
      '  z-index: 1000;',
      '}',

      // Trigger button
      '.lang-switcher__btn {',
      '  background: transparent;',
      '  border: 1px solid rgba(198,163,93,0.4);',
      '  color: #C6A35D;',
      '  font-family: inherit;',
      '  font-size: 11px;',
      '  font-weight: 600;',
      '  letter-spacing: 1px;',
      '  text-transform: uppercase;',
      '  padding: 5px 12px;',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 4px;',
      '  transition: border-color 0.3s, color 0.3s;',
      '}',
      '.lang-switcher__btn:hover,',
      '.lang-switcher__btn:focus {',
      '  border-color: #C6A35D;',
      '  color: #e2c87e;',
      '  outline: none;',
      '}',
      '.lang-switcher__btn::after {',
      '  content: "";',
      '  display: inline-block;',
      '  width: 0;',
      '  height: 0;',
      '  border-left: 4px solid transparent;',
      '  border-right: 4px solid transparent;',
      '  border-top: 4px solid #C6A35D;',
      '  margin-left: 4px;',
      '  transition: transform 0.3s;',
      '}',
      '.lang-switcher.open .lang-switcher__btn::after {',
      '  transform: rotate(180deg);',
      '}',

      // Dropdown menu
      '.lang-switcher__menu {',
      '  display: none;',
      '  position: absolute;',
      '  top: calc(100% + 4px);',
      '  right: 0;',
      '  min-width: 140px;',
      '  background: #3B1F0B;',
      '  border: 1px solid #C6A35D;',
      '  box-shadow: 0 6px 20px rgba(0,0,0,0.5);',
      '  list-style: none;',
      '  margin: 0;',
      '  padding: 4px 0;',
      '  max-height: 320px;',
      '  overflow-y: auto;',
      '}',
      '.lang-switcher.open .lang-switcher__menu {',
      '  display: block;',
      '}',

      // Menu items
      '.lang-switcher__menu li {',
      '  margin: 0;',
      '  padding: 0;',
      '}',
      '.lang-switcher__item {',
      '  display: block;',
      '  width: 100%;',
      '  background: transparent;',
      '  border: none;',
      '  color: #d4c5a9;',
      '  font-family: inherit;',
      '  font-size: 12px;',
      '  letter-spacing: 0.5px;',
      '  text-align: left;',
      '  padding: 8px 16px;',
      '  cursor: pointer;',
      '  transition: background 0.2s, color 0.2s;',
      '  white-space: nowrap;',
      '}',
      '.lang-switcher__item:hover,',
      '.lang-switcher__item:focus {',
      '  background: rgba(198,163,93,0.15);',
      '  color: #C6A35D;',
      '  outline: none;',
      '}',
      '.lang-switcher__item.active {',
      '  color: #C6A35D;',
      '  font-weight: 700;',
      '}',

      // Mobile: when inside a mobile menu the dropdown opens inline
      '@media (max-width: 768px) {',
      '  .lang-switcher {',
      '    width: 100%;',
      '    margin-left: 0;',
      '    margin-top: 8px;',
      '  }',
      '  .lang-switcher__btn {',
      '    width: 100%;',
      '    justify-content: center;',
      '  }',
      '  .lang-switcher__menu {',
      '    position: static;',
      '    border: none;',
      '    border-top: 1px solid rgba(198,163,93,0.3);',
      '    box-shadow: none;',
      '    width: 100%;',
      '    max-height: none;',
      '  }',
      '  .lang-switcher__item {',
      '    text-align: center;',
      '  }',
      '}'
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'i18n-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- Translation helpers ----------------------------------

  function getTranslation(lang, key) {
    if (typeof translations === 'undefined') return null;
    if (!translations[lang]) return null;
    return translations[lang][key] !== undefined ? translations[lang][key] : null;
  }

  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) {
      lang = DEFAULT_LANG;
    }

    // 1. Store in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* private browsing */ }

    // 2. Update <html lang>
    document.documentElement.setAttribute('lang', lang === 'uk' ? 'uk' : lang);

    // 3. Translate [data-i18n] -> innerHTML
    var elems = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elems.length; i++) {
      var key = elems[i].getAttribute('data-i18n');
      var val = getTranslation(lang, key);
      if (val !== null) {
        elems[i].innerHTML = val;
      }
    }

    // 4. Translate [data-i18n-placeholder] -> placeholder
    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var pKey = placeholders[j].getAttribute('data-i18n-placeholder');
      var pVal = getTranslation(lang, pKey);
      if (pVal !== null) {
        placeholders[j].setAttribute('placeholder', pVal);
      }
    }

    // 5. Translate [data-i18n-title] -> title
    var titles = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < titles.length; k++) {
      var tKey = titles[k].getAttribute('data-i18n-title');
      var tVal = getTranslation(lang, tKey);
      if (tVal !== null) {
        titles[k].setAttribute('title', tVal);
      }
    }

    // 6. Translate [data-i18n-alt] -> alt
    var alts = document.querySelectorAll('[data-i18n-alt]');
    for (var m = 0; m < alts.length; m++) {
      var aKey = alts[m].getAttribute('data-i18n-alt');
      var aVal = getTranslation(lang, aKey);
      if (aVal !== null) {
        alts[m].setAttribute('alt', aVal);
      }
    }

    // 7. Update page <title>
    var pageTitle = getTranslation(lang, 'page_title');
    if (pageTitle) {
      document.title = pageTitle;
    }

    // 8. Update meta description
    var pageDesc = getTranslation(lang, 'page_description');
    if (pageDesc) {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageDesc);
      }
    }

    // 9. Update dropdown button label & active state
    updateDropdownState(lang);
  }

  function getCurrentLanguage() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) {
        return stored;
      }
    } catch (e) { /* private browsing */ }
    return DEFAULT_LANG;
  }

  // ---- Dropdown UI ------------------------------------------

  function updateDropdownState(lang) {
    var btn = document.querySelector('.lang-switcher__btn');
    if (btn) {
      btn.textContent = LANG_LABELS[lang] || lang.toUpperCase();
      // Re-add the arrow (textContent wipes pseudo-element reference but CSS ::after still works)
    }
    var items = document.querySelectorAll('.lang-switcher__item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-lang') === lang) {
        items[i].classList.add('active');
      } else {
        items[i].classList.remove('active');
      }
    }
  }

  function buildDropdown() {
    var wrapper = document.createElement('div');
    wrapper.className = 'lang-switcher';

    // Trigger button
    var btn = document.createElement('button');
    btn.className = 'lang-switcher__btn';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = LANG_LABELS[getCurrentLanguage()] || 'PL';
    wrapper.appendChild(btn);

    // Menu
    var menu = document.createElement('ul');
    menu.className = 'lang-switcher__menu';
    menu.setAttribute('role', 'menu');

    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var code = SUPPORTED_LANGS[i];
      var li = document.createElement('li');
      li.setAttribute('role', 'none');

      var item = document.createElement('button');
      item.className = 'lang-switcher__item';
      item.setAttribute('type', 'button');
      item.setAttribute('role', 'menuitem');
      item.setAttribute('data-lang', code);
      item.textContent = LANG_LABELS[code] + ' \u2014 ' + LANG_NAMES[code];

      (function (langCode) {
        item.addEventListener('click', function () {
          setLanguage(langCode);
          closeDropdown(wrapper, btn);
        });
      })(code);

      li.appendChild(item);
      menu.appendChild(li);
    }

    wrapper.appendChild(menu);

    // Toggle open/close
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrapper.classList.contains('open');
      if (isOpen) {
        closeDropdown(wrapper, btn);
      } else {
        wrapper.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on outside click
    document.addEventListener('click', function () {
      closeDropdown(wrapper, btn);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDropdown(wrapper, btn);
      }
    });

    return wrapper;
  }

  function closeDropdown(wrapper, btn) {
    wrapper.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function insertDropdownIntoNav() {
    var dropdown = buildDropdown();

    // Try to find a nav element to append to
    var nav = document.querySelector('nav') ||
              document.querySelector('.nav') ||
              document.querySelector('.navbar') ||
              document.querySelector('header');

    if (nav) {
      // Try to find the nav list / right side to append nicely
      var navRight = nav.querySelector('.nav-right') ||
                     nav.querySelector('.navbar-right') ||
                     nav.querySelector('.nav__right') ||
                     nav.querySelector('ul');
      if (navRight) {
        var li = document.createElement('li');
        li.style.listStyle = 'none';
        li.appendChild(dropdown);
        navRight.appendChild(li);
      } else {
        nav.appendChild(dropdown);
      }
    } else {
      // Fallback: fixed position top-right
      dropdown.style.position = 'fixed';
      dropdown.style.top = '12px';
      dropdown.style.right = '12px';
      document.body.appendChild(dropdown);
    }
  }

  // ---- Browser language detection ---------------------------

  function detectBrowserLanguage() {
    var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    // Check exact match first (e.g. "pl", "en")
    var twoLetter = navLang.substring(0, 2);
    if (SUPPORTED_LANGS.indexOf(twoLetter) !== -1) {
      return twoLetter;
    }
    // Check navigator.languages array
    if (navigator.languages && navigator.languages.length) {
      for (var i = 0; i < navigator.languages.length; i++) {
        var code = navigator.languages[i].substring(0, 2).toLowerCase();
        if (SUPPORTED_LANGS.indexOf(code) !== -1) {
          return code;
        }
      }
    }
    return DEFAULT_LANG;
  }

  // ---- Initialization ---------------------------------------

  function init() {
    injectStyles();

    var lang;
    try {
      lang = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      lang = null;
    }

    if (!lang || SUPPORTED_LANGS.indexOf(lang) === -1) {
      lang = detectBrowserLanguage();
    }

    insertDropdownIntoNav();
    setLanguage(lang);
  }

  // ---- Boot -------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---- Public API -------------------------------------------
  window.setLanguage = setLanguage;
  window.getCurrentLanguage = getCurrentLanguage;

})();
