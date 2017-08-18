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
    Called when a tag is opening, such as ((#rate))

    @method open
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((rate))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialRate = parseFloat(get(lxlContainer, 'rate'));
    const newrate = calculateWithModifier(initialRate, params[0]);

    set(lxlContainer, 'rate', newrate);
    set(this, 'initialRate', initialRate);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/rate))

    @method close
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'rate', get(this, 'initialRate'));

    return resolve();
  }
});
