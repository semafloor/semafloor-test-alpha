(function(document) {
  'use strict';

  function finishLazyLoading() {
    var link = document.querySelector('#bundle');
    // TODO: Shadow DOM seems to have improved overall rendering insanely.
    window.Polymer = window.Polymer || { dom: 'shadow' };

    function onImportLoaded() {
      var skeleton = document.querySelector('#skeleton');
      skeleton.remove();
      // console.log('Elements are upgraded!');
    }

    if (link.import && link.import.readyState === 'complete') {
      // console.log('Removing skeleton...');
      onImportLoaded();
    }else {
      // console.log('Async HTMLImport not ready!');
      link.addEventListener('load', onImportLoaded);
    }
  }

  var webComponentsSupported = ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'));

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
    console.log('%c Async Web Components polyfill! ' + '%c For more info please visit https://goo.gl/oO0XyS', 'background-color: #616161; color: #fff;', 'background-color: inherit; color: #03a9f4');
  }else {
    finishLazyLoading();
    console.log('%c Native Web Components supported! ' + '%c For more info please visit http://webcomponents.org/', 'background-color: #ff5722; color: #fff', 'background-color: inherit; color: #03a9f4');
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
  var sw = document.querySelector('platinum-sw-register');

  document.addEventListener('main-page-attached', function(ev) {
    console.log('%c Running on Polymer v' + Polymer.version + ' ' + '%c For more info, please visit https://www.polymer-project.org/1.0/ ', 'background-color: #E91E63; color: #fff', 'background-color: inherit; color: #03a9f4; font-sylte: italic');
    console.log('%c Running on Lodash v' + _.VERSION + ' ' + '%c For more info, please visit https://lodash.com/', 'background-color: #3f51b5; color: #fff', 'background-color: inherit; color: #03a9f4');

    console.log('%c Running on Semafloor v' + ev.detail.VERSION + ' ', 'background-color: #009688; color: #fff');
    var _mainTel = semafloor.getElementsByTagName('*').length;
    var _allTel = document.getElementsByTagName('*').length;
    console.log('Total element nodes in main page w/ Lazy-Loading:', _mainTel);
    console.log('Total element nodes in document w/ Lazy-Loading:', _allTel);
    console.log('Total element nodes of app-shell w/ Lazy-Loading:', _allTel - _mainTel);
  }, !1);

  sw.addEventListener('service-worker-installed', function(ev) {
    console.log('%c ' + ev.detail + ' This app can now work offline. ' + '%c For more info about Service Worker please visit https://goo.gl/BjF9w9', 'background-color: #009d81; color: #fff', 'background-color: inherit; color: #03a9f4');
  }, !1);
})(document);
