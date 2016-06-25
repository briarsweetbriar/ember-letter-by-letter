import Ember from 'ember';
import { LXLTag } from 'ember-letter-by-letter';
import calculateWithModifier from 'ember-letter-by-letter/utils/calculate-with-modifier';

const {
  get,
  set
} = Ember;

const { RSVP: { resolve } } = Ember;

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#tween-rate))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((tween-rate))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialTweenRate = parseFloat(get(lxlContainer, 'tweenRate'));
    const newRate = calculateWithModifier(initialTweenRate, params[0]);

    set(lxlContainer, 'tweenRate', newRate);
    set(this, 'initialTweenRate', initialTweenRate);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/tween-rate))

    @method close
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'tweenRate', get(this, 'initialTweenRate'));

    return resolve();
  }
});
