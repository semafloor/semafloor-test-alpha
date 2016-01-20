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
      console.log('app-header-notify-resize', this.category);
      // Dynamically HTML importing pages.
      if (_category !== 'home') {
        var _dynamicallyImportHrefs = '../../bower_components/semafloor-' + _category +
          '-page/semafloor-' + _category + '-page.html';
        this.importHref(_dynamicallyImportHrefs, function() {
          console.log(_category + ' is loaded.');
        }, function(error) {
          console.error(_category, error);
        });
      }
      // Always notifyResize async-ly after 1.
      this.async(function() {
        this.$.mainHeader.notifyResize();
        // workaround for missing loaded list.
        // when reserve page is attached and list has been loaded but does not show.
        if (_category === 'reserve' && this._reserveAttached) {
          this.$.fakeTabs.notifyResize();
          this.$.reserve.updateReservePages();
        }else if (_category === 'current' && this._currentAttached) {
          this.$.current.updateCurrentPages();
        }else if (_category === 'room' && this._roomAttached) {
          this.$.room.updateIronImageWidth();
        }
      }, 300);
    },

    // page attached event.
    _onProfilePageAttached: function() {
      // console.log('profile-page-attached');
      this.async(function() {
        this.set('_profileAttached', true);
      }, 1);
    },
    _onReservePageAttached: function() {
      // console.log('reserve-page-attached');
      // Always notifyResize async-ly after 1.
      this.async(function() {
        // console.log('reserve-page-notify-resize');
        this.$.mainHeader.notifyResize();
        this.set('_reserveAttached', true);
      }, 1);
    },
    _onSearchPageAttached: function() {
      // console.log('search-page-attached');
      this.set('_searchAttached', true);
    },
    _onCurrentPageAttached: function() {
      // console.log('current-page-attached');
      this.set('_currentAttached', true);
    },
    _onRoomPageAttached: function() {
      // console.log('room-page-attached');
      this.async(function() {
        this.$.room.updateIronImageWidth();
      }, 10);
      this.set('_roomAttached', true);
    },

  });
})();
