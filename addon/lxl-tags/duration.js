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
    Called when a tag is opening, such as ((#duration))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((duration))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialDuration = parseFloat(get(lxlContainer, 'duration'));
    const newRate = calculateWithModifier(initialDuration, params[0]);

    set(lxlContainer, 'duration', newRate);
    set(this, 'initialDuration', initialDuration);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/duration))

    @method close
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'duration', get(this, 'initialDuration'));

    return resolve();
  }
});
