// largely taken from https://github.com/mike-north/ember-resize/blob/master/addon/services/resize.js

import Ember from 'ember';

const { Mixin } = Ember;

const { inject: { service } } = Ember;

export default Mixin.create({
  _oldViewWidth: null,
  _oldViewHeight: null,

  resizeService: service('lxl-resize'),

  didInsertElement() {
    this._super(...arguments);

    this.get('resizeService').on('didResize', this, this._handleResizeEvent);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.get('resizeService').off('didResize', this, this._handleResizeEvent);
  },

  _getComponentSize() {
    return this.$()[0].getClientRects()[0];
  },

  _handleResizeEvent() {
    const w = Math.floor(this._getComponentSize().width);
    const h = Math.floor(this._getComponentSize().height);
    if (this.get('_oldViewWidth') !== w || this.get('_oldViewHeight') !== h) {
      this.didResize();
      this.setProperties({
        _oldViewWidth: w,
        _oldViewHeight: h
      });
    }
  }
});
