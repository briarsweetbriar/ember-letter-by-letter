import Ember from 'ember';
import { LXLTag } from 'ember-letter-by-letter';

const { set } = Ember;
const { RSVP: { resolve } } = Ember;

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#instant))

    @method open
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
    @return {Promise}
  */

  open(...args) {
    return this.execute(...args);
  },

  /**
    Called when a tag is neither opening nor closing, such as ((instant))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
    @return {Promise}
  */

  execute(lxlContainer) {
    set(lxlContainer, 'instant', true);

    return resolve();
  },

  /**
    Called when a tag is closing, such as ((/instant))

    @method close
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
    @return {Promise}
  */

  close(lxlContainer) {
    set(lxlContainer, 'instant', false);

    return resolve();
  }
});
