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
    Called when a tag is opening, such as ((#stagger))

    @method open
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((stagger))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  execute(lxlContainer, params) {
    const initialStagger = parseFloat(get(lxlContainer, 'stagger'));
    const newStagger = calculateWithModifier(initialStagger, params[0]);

    set(lxlContainer, 'stagger', newStagger);
    set(this, 'initialStagger', initialStagger);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/stagger))

    @method close
    @param {Object} lxlContainer
    @param {Array} params
    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'stagger', get(this, 'initialStagger'));

    return resolve();
  }
});