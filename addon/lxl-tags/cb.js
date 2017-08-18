import Ember from 'ember';
import { LXLTag } from 'ember-letter-by-letter';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#cb))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((cb))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {
    const [name, ...args] = params;

    const value = get(lxlContainer, `cbs.${name}`)(...args);

    return !value || !value.then ? resolve() : value;
  },

  /**
    Called when a tag is closing, such as ((/cb))

    @method close
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  close() {
    return resolve;
  }
});
