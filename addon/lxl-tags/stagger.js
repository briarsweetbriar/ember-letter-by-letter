import Ember from 'ember';
import { LXLTag } from 'ember-letter-by-letter';

const {
  get,
  set
} = Ember;

const { RSVP: { resolve } } = Ember;

function calculateCPS(initialCps, modifier) {
  modifier = modifier.toString();

  const operator = modifier.charAt(0);
  const modifierValue = parseFloat(modifier.substring(1));
  switch (operator) {
    case '*': return initialCps * modifierValue;
    case '+': return initialCps + modifierValue;
    case '/': return initialCps / modifierValue;
    case '-': return initialCps - modifierValue;
    case '%': return initialCps % modifierValue;
    default: return parseFloat(modifier);
  }
}

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
    const initialCps = parseFloat(get(lxlContainer, 'stagger'));
    const newCps = calculateCPS(initialCps, params[0]);

    set(lxlContainer, 'stagger', newCps);
    set(this, 'initialCps', initialCps);

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
    set(lxlContainer, 'stagger', get(this, 'initialCps'));

    return resolve();
  }
});
