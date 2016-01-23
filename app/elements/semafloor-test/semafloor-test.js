(function() {
  'use strict';
  var _pages = [
    'Home', 'My Profile', 'My Reservations',
    'Search & Reserve', 'Current Reservations', 'Room Information'
  ];
  var _pageCodes = [
    'home', 'profile', 'reserve', 'search', 'current', 'room'
  ];

  Polymer({
    is: 'semafloor-test',

    properties: {
      category: {
        type: String,
        value: 'home'
      },
      page: {
        type: String,
        value: 'home'
      },
      upgraded: {
        type: Boolean,
        value: false
      },

      tab: {
        type: String,
        value: 'today'
      },
      title: {
        type: String,
        value: 'Search & Reserve',
        computed: '_computeTitle(category)'
      },
      _profileAttached: {
        type: Boolean,
        value: false
      },
      _reserveAttached: {
        type: Boolean,
        value: false
      },
      _searchAttached: {
        type: Boolean,
        value: false
      },
      _currentAttached: {
        type: Boolean,
        value: false
      },
      _roomAttached: {
        type: Boolean,
        value: false
      },

    },

    observers: [
      '_notifyResizeAppHeaderOnCategoryChange(category)'
    ],

    listeners: {
      // 'home-page-attached': '_onHomePageAttached',
      'profile-page-attached': '_onProfilePageAttached',
      'reserve-page-attached': '_onReservePageAttached',
      'search-page-attached': '_onSearchPageAttached',
      'current-page-attached': '_onCurrentPageAttached',
      'room-page-attached': '_onRoomPageAttached'
      // 'profile-upgraded': 'importAnotherHref',
      // 'reserve-upgraded': 'importAnotherHref',
      // 'search-upgraded': 'importAnotherHref',
      // 'current-upgraded': 'importAnotherHref',
      // 'room-upgraded': 'importAnotherHref'
    },

    // 'created': function() {
    //   console.time('profile-page-attached');
    // },
    ready: function() {
      this.fire('upgraded');
      this.upgraded = true;
    },

    _isReserve: function(_category) {
      return _category === 'reserve';
    },
    _computeTitle: function(_category) {
      return _pages[_pageCodes.indexOf(_category)];
    },

    // reserve page logics.
    _onTransitionend: function(ev) {
      // when target isn't paper-ripple OR reserve page has yet to be attached.
      if (ev.target.tagName !== 'PAPER-RIPPLE' || !this._reserveAttached) {
        return;
      }
      this.$.reserve.onTransitionend(ev);
    },
    _onIronSelect: function() {
      // when the page now isn't reserve page OR reserve page has yet to be attached.
      if (this.category !== 'reserve' || !this._reserveAttached) {
        return;
      }
      this.$.reserve.onIronSelect();
    },

    _notifyResizeAppHeaderOnCategoryChange: function() {
      var _category = this.category;
      // console.log('1) app-header-notify-resize', this.category);
      // Dynamically HTML importing pages.
      if (_category !== 'home' && !this['_' + _category + 'Attached']) {
        var _dynamicallyImportHrefs = '../../bower_components/semafloor-' + _category +
          '-page/semafloor-' + _category + '-page.html';
        this.importHref(_dynamicallyImportHrefs, function() {
          // console.log('5) ' + _category + ' is loaded.');
        }, function(error) {
          console.error(_category, error);
        });
      }
      // Always notifyResize async-ly after 1.
      // this.async(function() {
      // console.log('2) ' + _category + ' after loaded!');
      // }, 1);
    },

    // page attached event.
    _onProfilePageAttached: function() {
      // console.log('3) on-profile-page-attached');
      this.async(function() {
        // console.log('4) profile-page-notify-resize');
        this.set('_profileAttached', true);
        this.$.mainHeader.notifyResize();
        // this.fire('profile-upgraded', 'reserve');
      }, 1);
    },
    _onReservePageAttached: function() {
      // Always notifyResize async-ly after 1.
      // console.log('3) on-reserve-page-attached');
      this.async(function() {
        // console.log('4) reserve-page-notify-resize');
        this.set('_reserveAttached', true);
        this.$.mainHeader.notifyResize();
        this.$.fakeTabs.notifyResize();
        this.$.reserve.updateReservePages();
        // this.fire('reserve-upgraded', 'search');
      }, 1);
    },
    _onSearchPageAttached: function() {
      // console.log('3) on-search-page-attached');
      this.set('_searchAttached', true);
      this.async(function() {
        // console.log('4) search-page-notify-resize');
        this.$.mainHeader.notifyResize();
      }, 1);
      // this.fire('search-upgraded', 'current');
    },
    _onCurrentPageAttached: function() {
      // console.log('3) on-current-page-attached');
      this.set('_currentAttached', true);
      this.async(function() {
        // console.log('4) current-page-notify-resize');
        this.$.mainHeader.notifyResize();
        this.$.current.updateCurrentPages();
      }, 1);
      // this.fire('current-upgraded', 'room');
    },
    _onRoomPageAttached: function() {
      // console.log('3) on-room-page-attached');
      this.async(function() {
        // console.log('4) room-page-notify-resize');
        this.$.mainHeader.notifyResize();
        this.$.room.updateIronImageWidth(this.getBoundingClientRect().width);
        // after 10ms.
        // this.fire('room-upgraded', 'profile');
      }, 1);
      this.set('_roomAttached', true);
    },

    // dynamically import subsequent href.
    // importAnotherHref: function(ev) {
    //   // when it's room page OR when the requested page has been ready no import is needed.
    //   if (ev.detail[0] === undefined || this['_' + ev.detail + 'Attached']) {
    //     return;
    //   }
    //
    //   var _category = ev.detail;
    //   var _dynamicallyImportHrefs = '../../bower_components/semafloor-' + _category +
    //     '-page/semafloor-' + _category + '-page.html';
    //   this.importHref(_dynamicallyImportHrefs, function() {
    //     console.log(_category + ' is loaded.');
    //   }, function(error) {
    //     console.error(_category, error);
    //   });
    // },

  });
})();
