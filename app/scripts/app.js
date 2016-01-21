(function(document) {
  'use strict';

  var webComponentsSupported = ('registerElement' in document &&
  'import' in document.createElement('link') &&
  'content' in document.createElement('template'));

  function finishLazyLoading() {
    var link = document.querySelector('#bundle');
    // window.Polymer = window.Polymer || {dom: 'shadow'};

    function onImportLoaded() {
      // var skeleton = document.getElementById('skeleton');
      // skeleton.remove();

      console.log('Elements are upgraded!');
    }

    if (link.import && link.import.readyState === 'complete') {
      console.log('async Import loaded too quickly! Please wait...');
      onImportLoaded();
    }else {
      console.log('Removing skeleton...');
      link.addEventListener('load', onImportLoaded);
    }
  }

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
    console.log('web-components polyfill is needed!');
  }else {
    console.log('Native Web Components supported! finishlazyLoading...');
    finishLazyLoading();
  }

  // main logic...
  function once(node, event, fn, args) {
    /* jshint validthis: true */
    var _self = this;
    var listener = function() {
      fn.apply(_self, args);
      node.removeEventListener(event, listener, false);
    };
    node.addEventListener(event, listener, false);
  }

  var semafloor = document.querySelector('semafloor-test');
  var skeleton = document.getElementById('skeleton');

  page('/:category/view/', function(ctx) {
    var _category = ctx.params.category;

    function setData() {
      // remove skeleton when page is attached.
      if (skeleton !== null) {
        skeleton.remove();
        skeleton = null;
      }

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
    console.log('Cant\'t find: ' + window.location.href +
      '. Redirected you to Home Page.');
    page.redirect('/home/view');
  });

  page({
    hashbang: true
  });
  // page();

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  // app.addEventListener('dom-change', function() {
  //   console.log('Our app is ready to rock!');
  // });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // // Grab a reference to our auto-binding template
  // // and give it some initial binding values
  // // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  // // Sets app default base URL
  // app.baseUrl = '/';
  // if (window.location.port === '') {  // if production
  //   // Uncomment app.baseURL below and
  //   // set app.baseURL to '/your-pathname/' if running from folder in production
  //   // app.baseUrl = '/polymer-starter-kit/';
  // }

  // var sw = document.querySelector('#sw');
  // var stateColor = sw.state === 'installed' ? '#673AB7' :
  //                  sw.state === 'updated' ? '#4CAF50' :
  //                  sw.state === 'error' ? '#F44336' :
  //                  sw.state === 'unsupported' ? '#9E9E9E' :
  //                  'background-color: #3F51B5; color: #F44336; font-weight: 800;';
  // console.log('%cThe state of Service Worker on current browser: %c %s ',
  //     'color: #2196f3',
  //     stateColor,
  //     sw.state);
  // var displayInstalledToast = function() {
  //   // Check to make sure caching is actually enabled—it won't be in the dev environment.
  //   if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
  //     // Polymer.dom(document).querySelector('#caching-complete').show();
  //     console.log('%cThe' + '%c %s ' + '%capp is ready to ' + '%cwork offline!',
  //     'color: #fff; background-color: #424242;',
  //     'background-color: #eee; color: #009688; font-weight: 800;',
  //     'Semafloor',
  //     'background-color: #424242; color: #fff;',
  //     'background-color: #424242; color: #ffff00');
  //   }
  // };
  //
  // var displayUpdatedToast = function() {
  //   console.log('%cThe' + '%c %s ' + '%capp is updated progressively to ' + '%crock!',
  //   'background-color: #424242; color: #fff;',
  //   'background-color: #eee; color: #009688; font-weight: 800;',
  //   'Semafloor',
  //   'background-color: #424242; color: #4CAF50;',
  //   'background-color: #424242; color: #4CAF50');
  // };
  //
  // var displayErrorToast = function() {
  //   console.log('%cJesus Christ! The ' + '%c%s' + '%c app is throwing errors' + '%c!',
  //   'background-color: #424242; color: #fff;',
  //   'background-color: #eee; color: #009688; font-weight: 800;',
  //   'Semafloor',
  //   'background-color: #424242; color: #F44336;',
  //   'background-color: #424242; color: #F44336');
  // };
  //
  // sw.addEventListener('service-worker-installed', displayInstalledToast, false);
  // sw.addEventListener('service-worker-updated', displayUpdatedToast, false);
  // sw.addEventListener('service-worker-error', displayErrorToast, false);
})(document);
