import Ember from 'ember';
import { keyDown } from 'ember-keyboard';
import { LXLTag } from 'ember-letter-by-letter';

const {
  get,
  getProperties,
  isPresent,
  setProperties
} = Ember;

const { RSVP: { Promise } } = Ember;
const { run: { later } } = Ember;

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#pause))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((pause))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {
    return new Promise((resolve) => {
      if (get(lxlContainer, 'isInstant')) { resolve(); }

      setProperties(this, {
        lxlContainer,
        resolve
      });

      get(lxlContainer, 'keys').forEach((key) => {
        lxlContainer.off(keyDown(key), lxlContainer._advanceText);
        lxlContainer.on(keyDown(key), this, this._resolve);
      });

      ['mouseUp', 'touchEnd'].forEach((eventName) => {
        lxlContainer.off(eventName, lxlContainer._pressEvent);
        lxlContainer.on(eventName, this, this._resolve);
      });

      const duration = params[0];

      if (isPresent(duration)) {
        later(() => {
          this._resolve();
        }, duration);
      }
    });
  },

  _resolve() {
    const { isDestroyed, lxlContainer, resolve } = getProperties(this, 'isDestroyed', 'lxlContainer', 'resolve');

    if (isDestroyed) { return; }

    resolve();

    later(() => {
      get(lxlContainer, 'keys').forEach((key) => {
        lxlContainer.off(keyDown(key), this, this._resolve);
        lxlContainer.on(keyDown(key), lxlContainer._advanceText);
      });

      ['mouseUp', 'touchEnd'].forEach((eventName) => {
        lxlContainer.off(eventName, this, this._resolve);
        lxlContainer.on(eventName, lxlContainer._pressEvent);
      });

      this.destroy();
    });
  }
});
