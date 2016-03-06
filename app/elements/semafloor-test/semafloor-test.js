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
        // value: 'home'
      },
      page: {
        type: String,
        // value: 'home'
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
        // value: 'google:56483'
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
        type: Boolean,
        // value: false
      },
      authUser: {
        type: Object,
        // value: function() {
        //   return {};
        // }
      },
      authMessage: {
        type: String,
        value: 'Some auth message.'
      },

    },

    observers: [
      // '_notifyResizeAppHeaderOnCategoryChange(category)',
      '_updateUid(uid, category)'
    ],

    listeners: {
      // 'home-page-attached': '_onHomePageAttached',uid
      // 'profile-page-attached': '_onProfilePageAttached',
      // 'reserve-page-attached': '_onReservePageAttached',
      // 'search-page-attached': '_onSearchPageAttached',
      // 'current-page-attached': '_onCurrentPageAttached',
      // 'room-page-attached': '_onRoomPageAttached',
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
      // this.upgraded = true;
      this.fire('upgraded');
      this.set('upgraded', !0);
    },
    attached: function() {
      console.log('main app attached', this.category);
      // var _headerLayout = Polymer.dom(this.root).querySelector('app-header-layout');
      // console.log(_headerLayout);
      // _headerLayout.notifyResize();
    },

    _computeTitle: function(_category) {
      console.log('_computeTitle', _category);
      return _pages[_pageCodes.indexOf(_category)];
    },

    _isReserve: function(_category) {
      console.log('_isReserve', _category);
      return _category === 'reserve';
    },

    isAuthed: function(_authStatus, _authUser) {
      console.log('isAuthed', _authStatus, _authUser);
      return !_authStatus || !_authUser;
    },
    _computeAuthHidden: function(_authStatus, _authUser) {
      console.log('_computeAuthHidden', _authStatus, _authUser);
      return (!_authStatus || !_authUser) ? 'need-login' : '';
    },

    onError: function(ev) {
      console.log('onError');
      console.log(ev.detail.message);
    },
    _onLogin: function() {
      console.log('_onLogin');
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
        // this.$.dhl.notifyResize();
      }, 1);
      // if user exists, access to its database, else create new user database.
      this.async(function() {
        this._checkIfUserExists(this.authUser);
      }, 1);
    },
    _onLogout: function() {
      console.log('_onLogout');
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
      console.log('_authWithGoogle');
      if (!!this.authUser) {
        return;
      }

      // this.set('authProvider', 'google'); // temporarily default to google.
      this.async(function() {
        this.$.firebaseAuth.login();
      }, 1);
    },
    _unAuth: function(ev) {
      console.log('_unAuth', ev);
      this.async(function() {
        this.$.firebaseAuth.logout();
        // notifyResize drawerHeaderLayout after logged out.
        this.$.dhl.notifyResize();
      }, 1);
    },

    // update uid when Firebase is connected to logged in user's database.
    // TODO: 0 - when uid is received, setup page.
    // 1 - when _category changed, setup page if needed.
    _updateUid: function(_uid, _category) {
      var _isPageAttached = '_is' + _.capitalize(_category) + 'Attached';

      // If this page (or _category) has already opened and attached,
      // there is no need to re-importHref again.
      // TODO: Skip importHref-ing home page (for now).
      return;
      if (this[_isPageAttached] || _category === 'home') {
      }

      console.log('_updateUid', _uid, this.page);
      function _importHrefAfterUid(_href) {
        return new Promise(function(resolve, reject) {
          Polymer.Base.importHref(_href, function(ev) {
            console.log(_href + ': ', ev.target, ev.currentTarget);
            resolve(ev.target);
          }, reject, !0);
        });
      }

      function _lazifyPage(_isPageOpened) {
        console.log(_isPageOpened, this[_isPageOpened]);
        if (!this[_isPageOpened]) {
          this.set(_isPageOpened, !0);
          return !0;
        }else {
          return !1;
        }
      }

      var _category = this.category;
      var _href = [
        '../../bower_components/semafloor-',
        _category,
        '-page/semafloor-',
        _category,
        '-page.html'
      ].join('');
      var _isPageOpened = '_is' + _.capitalize(_category) + 'PageOpened';
      var _thisLazifyPage = _lazifyPage.bind(this);

      _importHrefAfterUid(_href).then(function(_values) {
        console.dir(_values.import);
        // Once element is importHref-ed, load it lazily.
        return _thisLazifyPage(_isPageOpened);
      }).then(function(_isPageOpened) {
        if (_isPageOpened) {
          console.warn('Page is now opened!');
        }else {
          console.warn('Page has already opened!');
        }
      }).catch(function(_error) {
        console.error(_error);
      });
      // TODO: To bind uid to the importHref-ed element when the element is attached?
      // var _pageAttached = '_' + this.page + 'Attached';
      // if current page already attached to document, update its uid.
      // if (this[_pageAttached]) {
      //   this.$[this.page].uid = _uid;
      // }
      // TODO: Should importHref page lazily here after all possible logics inside this element has
      // run completely. Main thread should be free now.
    },

    // TODO: Whatever is/ are above this line, are arranged accordingly with understandings.
    // reserve page logics.
    _onTransitionend: function(ev) {
      console.log('_onTransitionend');
      // when target isn't paper-ripple OR reserve page has yet to be attached.
      if (ev.target.tagName !== 'PAPER-RIPPLE' || !this._reserveAttached) {
        return;
      }
      this.$.reserve.onTransitionend(ev);
    },
    _onIronSelect: function() {
      console.log('_onIronSelect');
      // when the page now isn't reserve page OR reserve page has yet to be attached.
      if (this.category !== 'reserve' || !this._reserveAttached) {
        return;
      }
      this.$.reserve.onIronSelect();
    },

    // _notifyResizeAppHeaderOnCategoryChange: function() {
    //   console.log('_notifyResizeAppHeaderOnCategoryChange');
    //   return;
    //
    //   var _category = this.category;
    //   // console.log('1) app-header-notify-resize', this.category);
    //   // Dynamically HTML importing pages.
    //   if (_category !== 'home' && !this['_' + _category + 'Attached']) {
    //     var _dynamicallyImportHrefs = '../../bower_components/semafloor-' + _category +
    //       '-page/semafloor-' + _category + '-page.html';
    //     this.importHref(_dynamicallyImportHrefs, function() {
    //       // console.log('5) ' + _category + ' is loaded.');
    //     }, function(error) {
    //       console.error(_category, error);
    //     });
    //   }
    //   // paper-tabs has missing selectionBar even though page was attached.
    //   if (_category === 'reserve' && this._reserveAttached) {
    //     this.$.fakeTabs.notifyResize();
    //   }
    //   // this.async(function() {
    //   // console.log('2) ' + _category + ' after loaded!');
    //   // }, 1);
    // },

    // page attached event.
    // _onProfilePageAttached: function() {
    //   console.log('3) on-profile-page-attached');
    //   this.async(function() {
    //     // console.log('4) profile-page-notify-resize');
    //     this.set('_profileAttached', true);
    //     this.$.mainHeader.notifyResize();
    //     // if uid already updated, but profile has yet to attached to document.
    //     // reassign new uid to profile page when attached.
    //     this.$.profile.uid = this.uid;
    //     // this.fire('profile-upgraded', 'reserve');
    //   }, 1);
    // },
    // _onReservePageAttached: function() {
    //   // Always notifyResize async-ly after 1.
    //   console.log('3) on-reserve-page-attached');
    //   this.async(function() {
    //     // console.log('4) reserve-page-notify-resize');
    //     this.$.mainHeader.notifyResize();
    //     this.$.fakeTabs.notifyResize();
    //     this.set('_reserveAttached', true);
    //     this.$.reserve.updateReservePages();
    //     console.log(this.uid);
    //     this.$.reserve.uid = this.uid;
    //     // this.fire('reserve-upgraded', 'search');
    //   }, 1);
    // },
    // _onSearchPageAttached: function() {
    //   // console.log('3) on-search-page-attached');
    //   this.set('_searchAttached', true);
    //   this.async(function() {
    //     // console.log('4) search-page-notify-resize');
    //     this.$.mainHeader.notifyResize();
    //   }, 1);
    //   // this.fire('search-upgraded', 'current');
    // },
    // _onCurrentPageAttached: function() {
    //   // console.log('3) on-current-page-attached');
    //   this.set('_currentAttached', true);
    //   this.async(function() {
    //     // console.log('4) current-page-notify-resize');
    //     this.$.mainHeader.notifyResize();
    //     this.$.current.updateCurrentPages();
    //   }, 1);
    //   // this.fire('current-upgraded', 'room');
    // },
    // TODO: Universal page attached method.
    _onRoomPageAttached: function(ev) {
      // console.log('3) on-room-page-attached');
      // this.async(function() {
        // console.log('4) room-page-notify-resize');
        // this.$.mainHeader.notifyResize();
        // this.$.room.updateIronImageWidth(this.getBoundingClientRect().width);
        // after 10ms.
        // this.fire('room-upgraded', 'profile');
      // }, 1);

      console.log('_roomAttached');

      // ev.target.classList.add('finish-loading');
      // this.$.spinner.classList.add('finish-loading');
      this.toggleClass('finish-loading', !0, ev.target);
      this.toggleClass('finish-loading', !0, this.$.spinner);
      // this.async(function() {
      // }, 1);
      // this.set('_roomAttached', true);
    },

    /* jshint ignore:start */
    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    // if user exists, access to its database, else create new user database.
    _checkIfUserExists: function(_authUser) {
      console.log('_checkIfUserExists');
      // var uid = 'google:103450531185198654719';
      var _ref = this.$.firebaseAuth.ref;
      var _that = this;
      _ref.child('users/' + _authUser.provider).once('value').then(function(snapshot) {
        var _isUser = snapshot.child(_authUser.uid).exists();
        if (_isUser) {
          // access data directly from the user.
          console.warn('Existing User! Allow profile page to read data from the user.' +
            'Setting uid to appropriate page (_updateUid)...');
          // _that.$.profile.uid = _authUser.uid;
          _that.set('uid', _authUser.uid);
        }else {
          console.warn('Creating new user...');
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
              console.error('User already exists?!');
              return;
            }
          }).then(function(committed, snapshot) {
            // TODO: Not quite sure if this is the correct way for transaction.
            if (!committed) {
              console.warn('Mission aborted!');
            }else {
              console.log(snapshot.val());
            }
          }).catch(function(error) {
            console.error(error);
          });
        }
      });
    },
    /* jshint ignore:end */
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */

    // TODO: new app-layout no longer closes app-drawer when tap on anchor tags!
    _closeDrawer: function() {
      console.log('_closeDrawer');
      this.$.dhl.close();
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

    // TODO: I have no idea what this element is doing things so complicated.
    // TODO: Update to new self crafted spinner.
  });
})();
