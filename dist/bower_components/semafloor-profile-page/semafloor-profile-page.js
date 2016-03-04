var _rippleNames = [
  'uname', 'uid', 'group', 'email', 'role', 'room', 'floor', 'time', 'timeout'];

Polymer({

  is: 'semafloor-profile-page',

  properties: {
    profile: {
      type: Object,
      value: function() {
        return {};
        // return {
        //   username: 'John Doe',
        //   uid: 'jdxhr',
        //   group: 2,
        //   email: 'johndoe@jmail.com',
        //   role: 'normal',
        //   room: 'A002',
        //   floor: 'T001',
        //   tzone: 'GMT +8',
        //   tout: 1440
        // }
      }
    },
    uid: {
      type: String,
      value: 'google:9999'
    },

    _invalidEmail: {
      type: Boolean,
      value: false
    },
    _changEmail: {
      type: String,
      value: 'johndoe@jmail.com'
    },
    _timezone: {
      type: String,
      value: 'eight'
    },
    _scrolled: {
      type: Boolean,
      value: false
    },
    _rippleToBeCancelled: {
      type: Number,
      value: -1
    },
    _changeDialog: {
      type: String,
      value: 'El Psy Kongroo'
    },
    _changeTitle: {
      type: String,
      value: 'El Psy Kongroo'
    },
    _prevYPos: {
      type: Number,
      value: -10
    },
    _message: {
      type: String,
      value: 'El Psy Kongroo'
    },
    _dialogReady: {
      type: Boolean,
      value: false
    },

    _profileURL: {
      type: String,
      value: 'https://semafloor-webapp.firebaseio.com'
    },

  },

  listeners: {
    'touchmove': '_cancelRippleWhileScrolling'
  },

  observers: [
    '_updateProfile(uid)'
  ],

  // Element Lifecycle
  created: function() {
    // console.time('profile-page-ready');
    // console.log('profile-page-created');
  },

  ready: function() {
    // `ready` is called after all elements have been configured, but
    // propagates bottom-up. This element's children are ready, but parents
    // are not.
    //
    // This is the point where you should make modifications to the DOM (when
    // necessary), or kick off any processes the element wants to perform.
    // console.timeEnd('profile-page-ready');
    // this.fire('profile-page-ready');
  },

  attached: function() {
    // `attached` fires once the element and its parents have been inserted
    // into a document.
    //
    // This is a good place to perform any work related to your element's
    // visual state or active behavior (measuring sizes, beginning animations,
    // loading resources, etc).
    // console.timeEnd('profile-page-attached');
    this.fire('profile-page-attached');
  },

  detached: function() {
    // The analog to `attached`, `detached` fires when the element has been
    // removed from a document.
    //
    // Use this to clean up anything you did in `attached`.
  },

  _cancelRippleWhileScrolling: function(ev) {
    if (!this._scrolled) {
      // change if y position changes.
      if (this._prevYPos !== ev.changedTouches.screenY) {
        this.set('_scrolled', true);
      }
    }else {
      // cancel ripple effect during scrolling.
      var _ripples = Polymer.dom(this.root).querySelectorAll('paper-ripple');
      _ripples[this._rippleToBeCancelled].upAction();
    }
  },
  _onDown: function(ev) {
    var _target = ev.target;

    while (_target && _target.tagName !== 'DIV') {
      _target = _target.parentElement;
    }

    if (_target && _target.hasAttribute('ripple')) {
      var _ripple = _target.getAttribute('ripple');
      this.set('_rippleToBeCancelled', _rippleNames.indexOf(_ripple));
      this.set('_prevYPos', Math.ceil(ev.detail.y));
    }
  },
  _onUp: function() {
    if (this._scrolled) {
      this.set('_scrolled', false);
    }
  },

  _isEmail: function(_changeDialog) {
    return _changeDialog === 'email';
  },
  _setDialog: function() {
    if (!this._dialogReady) {
      // set dialog when tap.
      this.set('_dialogReady', true);
    }
  },
  _changeDetail: function(ev) {
    // do nothing when no tap or scrolled.
    if (!this._dialogReady || this._scrolled) {
      return;
    }

    var _target = ev.target;
    while (_target && _target.tagName !== 'DIV') {
      _target = _target.parentElement;
    }

    if (_target && _target.hasAttribute('data-profile')) {
      var _detail = _target.getAttribute('data-profile');

      this.set('_changeTitle', _detail === 'email' ?
        'Change email' : 'Change time zone');
      this.set('_changeDialog', _detail);
      this.$.changeDialog.open();
    }
    // reset _dialogReady to norm before tap.
    this.set('_dialogReady', false);
  },

  _confirmChange: function(ev) {
    if (this._scrolled) {
      return;
    }

    var _target = ev.target;
    if (_target && _target.tagName === 'PAPER-BUTTON') {
      var _text = 'Something wrong! Please try again.';
      // hide toast for the next display.
      if (this.$.profileToast.opened) {
        this.$.profileToast.hide();
      }
      // update change accordingly.
      if (this._changeDialog === 'email') {
        // workaround: to get value of input from the input.
        var _changeEmail = this._changeEmail;
        if (_changeEmail && !this._invalidEmail) {
          _text = 'Email has been changed successfully!';
          // TODO: change to modify value in Firebase.
          // this.set('profile.email', _changeEmail);
          this._commitFirebase('email', _changeEmail, _text);
        }
      }else {
        if (this._timezone) {
          _text = 'Time zone has been changed successfully!';
          // TODO: change to modify value in Firebase.
          // this.set('profile.tzone', this._timezone === 'eight' ?
          //   'GMT +8' : 'GMT +9');
          this._commitFirebase('tzone', this._timezone === 'eight' ? 'GMT +8' : 'GMT +9', _text);
        }
      }
      // update toast message.
      // this.set('_message', _text);
      // this.async(function() {
      //   this.$.profileToast.show()
      // }, 350);
    }
  },

  _updateProfile: function(_uid) {
    // when user logged in, uid will change thus Firebase references to different location.
    this.set('_profileURL', 'https://semafloor-webapp.firebaseio.com/users/google/' + _uid);
  },

  _onFirebaseValue: function(ev) {
    if (_.isNull(ev.detail.val())) {
      return;
    }
    // when Firebase retrieves new data, update profile.
    this.set('profile', ev.detail.val().profile);
  },
  // commit user changes to Firebase.
  _commitFirebase: function(_category, _commitValue, _successText) {
    var _that = this;
    var _ref = new Firebase(this.$.firebaseProfile.location);
    _ref.child('profile').once('value', function(snapshot) {
      _ref.child('profile/' + _category).transaction(function(data) {
        return _commitValue;
      }, function(error, committed, snapshot) {
        if (error) {
          console.error(error);
        }else if (!committed) {
          console.warn('Changes not committed!');
        }else {
          console.log('Changes committed to Firebase!');
          // Update toast message.
          _that.set('_message', _successText);
          _that.async(function() {
            _that.$.profileToast.show()
          }, 350);
        }
      });
    }, function(error) {
      console.error(error);
    });
  },

});
