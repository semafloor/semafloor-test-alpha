var spinnerTimeout;

Polymer({

  is: 'semafloor-reserve-page',

  properties: {
    selectedTab: {
      type: String,
      value: 'today'
    },
    thisweekCount: {
      type: Number,
      value: 99,
      notify: true
    },
    todayCount: {
      type: Number,
      value: 99,
      notify: true
    },
    upcomingCount: {
      type: Number,
      value: 99,
      notify: true
    },
    uid: {
      type: String,
      // TODO: For testing purpose...
      google:103450531185198654718
      // value: 'google:9999'
    },

    _page: {
      type: Number,
      value: 'waiting'
    },
    _tabTransitionEnd: {
      type: Boolean,
      value: false
    },
    _tabReady: {
      type: Boolean,
      value: false
    },
    _dataReady: {
      type: Boolean,
      value: false
    },

    _isLoading: {
      type: Boolean,
      value: !0
    },

  },

  listeners: {
    'data-ready': '_onDataReady'
  },

  // Element Lifecycle

  ready: function() {
    // `ready` is called after all elements have been configured, but
    // propagates bottom-up. This element's children are ready, but parents
    // are not.
    //
    // This is the point where you should make modifications to the DOM (when
    // necessary), or kick off any processes the element wants to perform.
  },

  attached: function() {
    // `attached` fires once the element and its parents have been inserted
    // into a document.
    //
    // This is a good place to perform any work related to your element's
    // visual state or active behavior (measuring sizes, beginning animations,
    // loading resources, etc).
    // this.fire('reserve-page-attached');
    this.fire('reserve-page-attached');
  },

  detached: function() {
    // The analog to `attached`, `detached` fires when the element has been
    // removed from a document.
    //
    // Use this to clean up anything you did in `attached`.
  },

  // Element Behavior

  /**
   * The `semafloor-reserve-page-lasers` event is fired whenever `fireLasers` is called.
   *
   * @event semafloor-reserve-page-lasers
   * @detail {{sound: String}}
   */

  onIronSelect: function() {
    // if tap set _tabReady.
    if (!this._tabReady) {
      this.set('_tabReady', true);
    }
    // RAIL approach to hit 100ms mark on R (resonse).
    // https://youtu.be/iIV1xPFXmBs?list=PLNYkxOF6rcICcHeQY02XLvoGL34rZFWZn;
    // showSpinner if failed to meet that 100ms.
    spinnerTimeout = this.async(function() {
      if (!this._isSpinnerOpened) {
        this.set('_isSpinnerOpened', !0);
        this.async(function() {
          this.set('_page', 'waiting');
          // reset _tabTransitionEnd on every new select starts.
          this.set('_tabTransitionEnd', false);
        }, 1);
      }else {
        this.set('_page', 'waiting');
        // reset _tabTransitionEnd on every new select starts.
        this.set('_tabTransitionEnd', false);
      }
    }, 100);

  },
  onTransitionend: function(ev) {
    // return when tab not yet trensition end OR tab not tap.
    if (this._tabTransitionEnd || !this._tabReady) {
      return;
    }

    // On the transitionend of first ripple...
    if (ev.target.tagName === 'PAPER-RIPPLE') {
      // set _tabTransitionEnd to indicate first transitionend being captured.
      this.set('_tabTransitionEnd', true);
      // hide spinner either meets the 100ms R mark or when it doesn't.
      this.cancelAsync(spinnerTimeout);
      // when data fetched from Firebase, set _dataReady then switch to page.
      // if data still pending from Firebase, pass it on to _onDataReady then.
      if (this._dataReady) {
        console.log(this.selectedTab);
        this.set('_page', this.selectedTab);
      }
    }
  },
  _onDataReady: function(ev) {
    // For the first fetch from Firebase, this will run for only once.
    // switch to page when data is fetched from Firebase.
    console.log(this.selectedTab);
    this.set('_page', this.selectedTab);
    // set _dataReady to indicate data already fetched and just switch to page
    // for the future new select.
    this.set('_dataReady', true);
    // update iron-list after switching to new page ASYNC-ly.
    // asyncly as iron-list now inside dom-if, wait until iron-list being rendered.
    this.async(function() {
      this.$[this.selectedTab + 'List'].updateList();

      this.set('_isLoading', !1);
    }, 1);
  },

  // importHref workaround.
  // reserve page shows nothing wnen it's in the midst of loading list and switch to other page
  // and come back to the page.
  // Needs to notifyResize the iron-pages in this case.
  updateReservePages: function() {
    this.$.reservePages.notifyResize();
  },

  _computeLoadingCls: function(_isLoading) {
    console.log(_isLoading);
    return _isLoading ? '' : 'finish-loading';
  },

  // TODO: Just realised this element is so broken.
});
