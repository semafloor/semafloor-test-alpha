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

      uid: {
        type: String,
        value: 'google:56483'
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

      authURL: {
        type: String,
        value: 'https://semafloor-webapp.firebaseio.com'
      },
      authProvider: {
        type: String,
        value: 'google'
      },
      authStatus: {
        type: String,
        value: false
      },
      authUser: {
        type: Object,
        value: function() {
          return {};
        }
      },
      authMessage: {
        type: String,
        value: 'Some auth message.'
      },

    },

    observers: [
      '_notifyResizeAppHeaderOnCategoryChange(category)',
      '_updateUid(uid)'
    ],

    listeners: {
      // 'home-page-attached': '_onHomePageAttached',uid
      'profile-page-attached': '_onProfilePageAttached',
      'reserve-page-attached': '_onReservePageAttached',
      'search-page-attached': '_onSearchPageAttached',
      'current-page-attached': '_onCurrentPageAttached',
      'room-page-attached': '_onRoomPageAttached',
      'firebaseAuth.login': '_onLogin',
      'firebaseAuth.logout': '_onLogout'
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
      // paper-tabs has missing selectionBar even though page was attached.
      if (_category === 'reserve' && this._reserveAttached) {
        this.$.fakeTabs.notifyResize();
      }
      // this.async(function() {
      // console.log('2) ' + _category + ' after loaded!');
      // }, 1);
    },

    // page attached event.
    _onProfilePageAttached: function() {
      console.log('3) on-profile-page-attached');
      this.async(function() {
        // console.log('4) profile-page-notify-resize');
        this.set('_profileAttached', true);
        this.$.mainHeader.notifyResize();
        // if uid already updated, but profile has yet to attached to document.
        // reassign new uid to profile page when attached.
        this.$.profile.uid = this.uid;
        // this.fire('profile-upgraded', 'reserve');
      }, 1);
    },
    _onReservePageAttached: function() {
      // Always notifyResize async-ly after 1.
      console.log('3) on-reserve-page-attached');
      this.async(function() {
        // console.log('4) reserve-page-notify-resize');
        this.$.mainHeader.notifyResize();
        this.$.fakeTabs.notifyResize();
        this.set('_reserveAttached', true);
        this.$.reserve.updateReservePages();
        console.log(this.uid);
        this.$.reserve.uid = this.uid;
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

    isAuthed: function(_authStatus, _authUser) {
      return !_authStatus || !_authUser;
    },
    _computeAuthHidden: function(_authStatus, _authUser) {
      return (!_authStatus || !_authUser) ? 'need-login' : '';
    },

    onError: function(ev) {
      console.log(ev.detail.message);
    },
    _onLogin: function() {
      var _authMessage = !!this.authUser ?
      'Logged in as ' + this.authUser.google.displayName + '.' : 'Logged in!';
      console.log(this.authUser);
      if (this.$.authToast.opened) {
        this.$.authToast.close();
      }
      this.async(function() {
        this.set('authMessage', _authMessage);
        this.$.authToast.open();
        // notifyResize drawerHeaderLayout after logged in.
        this.$.dhl.notifyResize();
      }, 1);
      // if user exists, access to its database, else create new user database.
      this.async(function() {
        this._checkIfUserExists(this.authUser);
      }, 1);
    },
    _onLogout: function() {
      var _authMessage = 'Logged out!';
      if (this.$.authToast.opened) {
        this.$.authToast.close();
      }
      this.async(function() {
        this.set('authMessage', _authMessage);
        this.$.authToast.open();
      }, 1);
    },
    _authWithGoogle: function() {
      if (!!this.authUser) {
        return;
      }

      // this.set('authProvider', 'google'); // temporarily default to google.
      this.async(function() {
        this.$.firebaseAuth.login();
      }, 1);
    },
    _unAuth: function(ev) {
      console.log(ev);
      this.async(function() {
        this.$.firebaseAuth.logout();
        // notifyResize drawerHeaderLayout after logged out.
        this.$.dhl.notifyResize();
      }, 1);
    },

    /* jshint ignore:start */
    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    // if user exists, access to its database, else create new user database.
    _checkIfUserExists: function(_authUser) {
      // var uid = 'google:103450531185198654719';
      var _ref = this.$.firebaseAuth.ref;
      var _that = this;
      _ref.child('users/' + _authUser.provider).once('value', function(snapshot) {
        var _isUser = snapshot.child(_authUser.uid).exists();
        if (_isUser) {
          // access data directly from the user.
          console.log('allow profile page to read2
           data from the user.');
          // _that.$.profile.uid = _authUser.uid;
          _that.set('uid', _authUser.uid);
        }else {
          _ref.child('users/' + _authUser.provider + '/' + _authUser.uid)
            .transaction(function(data) {
            if (data === null) {
              return {
                displayName: _authUser.google.displayName,
                email: _authUser.google.email,
                id: _authUser.google.id,
                profileImageURL: _authUser.google.profileImageURL,
                provider: _authUser.provider,
                uid: _authUser.uid,
                cachedUserProfile: _authUser.google.cachedUserProfile,
                createdTime: Firebase.ServerValue.TIMESTAMP,
                profile: {
                  username: _authUser.google.displayName,
                  uid: _authUser.google.cachedUserProfile.given_name.slice(0, 1).toLowerCase() +
                    _authUser.google.cachedUserProfile.family_name.slice(0,1).toLowerCase() +
                    String.fromCharCode(_.random(97, 122)) +
                    String.fromCharCode(_.random(97, 122)) +
                    String.fromCharCode(_.random(97, 122)),
                  group: _.random(99),
                  email: _authUser.google.email,
                  role: _.sample(['normal', 'vip', 'boss', 'janitor', 'elite']),
                  room: String.fromCharCode(_.random(65, 90)) + ('000' + _.random(999)).slice(-3),
                  floor: String.fromCharCode(_.random(65, 90)) + ('000' + _.random(999)).slice(-3),
                  tzone: 'GMT +8',
                  tout: 1440
                },
                reservations: {
                  totalReservations: 0,
                  lastUpdateTime: Firebase.ServerValue.TIMESTAMP
                }
              };
            }else {
              // console.log('User already exists.');
              return;
            }
          }, function(error, committed, snapshot) {
            if (error) {
              console.error(error);
            }else if (!committed) {
              console.warn('Mission aborted!');
            }else {
              console.log(snapshot.val());
            }
          });
        }
      });
    },
    /* jshint ignore:end */
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

    // update uid when Firebase is connected to logged in user's database.
    _updateUid: function(_uid) {
      var _pageAttached = '_' + this.page + 'Attached';
      // if current page already attached to document, update its uid.
      if (this[_pageAttached]) {
        this.$[this.page].uid = _uid;
      }
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
