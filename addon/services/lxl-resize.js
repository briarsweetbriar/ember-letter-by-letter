// largely taken from https://github.com/mike-north/ember-resize/blob/master/addon/services/resize.js

import Ember from 'ember';

const {
  Evented,
  Service
} = Ember;

const { run: { debounce } } = Ember;

export default Service.extend(Evented, {
  _oldWidth: null,
  _oldHeight: null,

  init() {
    this._super(...arguments);
    this._onResizeHandler = (evt) => {
      debounce(this, this._fireResizeNotification, evt, 100);
    };
    this._installResizeListener();
  },

  destroy() {
    this._super(...arguments);
    this._uninstallResizeListener();
  },

  _hasWindowSizeChanged(w, h) {
    return w !== this.get('_oldWidth') || h !== this.get('_oldHeight');
  },

  _updateCachedWindowSize(_oldWidth, _oldHeight) {
    this.setProperties({
      _oldWidth,
      _oldHeight
    });
  },

  _installResizeListener() {
    window.addEventListener('resize', this._onResizeHandler);
  },

  _uninstallResizeListener() {
    window.removeEventListener('resize', this._onResizeHandler);
  },

  _fireResizeNotification(evt) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight);
    }
  }
});
