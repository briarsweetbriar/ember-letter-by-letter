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
    Called when a tag is opening, such as ((#cps))

    @method open
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((cps))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialCps = parseFloat(get(lxlContainer, 'cps'));
    const newCps = calculateWithModifier(initialCps, params[0]);

    set(lxlContainer, 'cps', newCps);
    set(this, 'initialCps', initialCps);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/cps))

    @method close
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'cps', get(this, 'initialCps'));

    return resolve();
  }
});
