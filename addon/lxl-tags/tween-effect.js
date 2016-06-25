import Ember from 'ember';
import { LXLTag } from 'ember-letter-by-letter';

const {
  get,
  set
} = Ember;

const { RSVP: { resolve } } = Ember;

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#tween-effect))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((tween-effect))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialTweenEffect = get(lxlContainer, 'tweenEffect');

    set(lxlContainer, 'tweenEffect', params[0]);
    set(this, 'initialTweenEffect', initialTweenEffect);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/tween-effect))

    @method close
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'tweenEffect', get(this, 'initialTweenEffect'));

    return resolve();
  }
});
