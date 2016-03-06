(function(document) {
  'use strict';

  function finishLazyLoading() {
    var link = document.querySelector('#bundle');
    // TODO: Shadow DOM seems to have improved overall rendering insanely.
    window.Polymer = window.Polymer || { dom: 'shadow' };

    function onImportLoaded() {
      var skeleton = document.querySelector('#skeleton');
      skeleton.remove();

      console.log('Elements are upgraded!');
    }

    if (link.import && link.import.readyState === 'complete') {
      console.log('Removing skeleton...');
      onImportLoaded();
    }else {
      console.log('Async HTMLImport not ready!');
      link.addEventListener('load', onImportLoaded);
    }
  }

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
    console.log('Async Web Componenets polyfill!');
  }else {
    console.log('Native Web Components supported!');
    finishLazyLoading();
  }

  function once(node, event, fn, args) {
    var _self = this;
    var listener = function() {
      fn.apply(_self, args);
      node.removeEventListener(event, listener, !1);
    };
    node.addEventListener(event, listener, !1);
  }

  var semafloor = document.querySelector('semafloor-main');

  window.addEventListener('main-page-attached', function() {
    var _mainTel = semafloor.getElementsByTagName('*').length;
    var _allTel = document.getElementsByTagName('*').length;
    console.log('Total element nodes in main page w/ Lazy-Loading:', _mainTel);
    console.log('Total element nodes in document w/ Lazy-Loading:', _allTel);
    console.log('Total element nodes of app-shell w/ Lazy-Loading:', _allTel - _mainTel);
  });

  page('/:category/view', function(ctx) {
    var _category = ctx.params.category;

    function setData() {
      semafloor.classList.add('finish-loading');

      semafloor.category = _category;
      semafloor.page = _category;
      window.scrollTo(0, 0);
    }

    if (!semafloor.upgraded) {
      once(semafloor, 'upgraded', setData);
    }else {
      setData();
    }
  });

  page('*', function() {
    console.warn('Can\'t find: ' + window.location.href + '. Redirecting to home page.');
    page.redirect('/home/view');
  });

  page({
    hashbang: true
  });
  // page();
})(document);
