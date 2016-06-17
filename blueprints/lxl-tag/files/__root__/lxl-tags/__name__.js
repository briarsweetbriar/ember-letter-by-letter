import { LXLTag } from 'ember-letter-by-letter';

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#<%= dasherizedModuleName %>))

    @method open
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
  */

  open(lxlContainer, params, hash, index) {

  },

  /**
    Called when a tag is neither opening nor closing, such as ((<%= dasherizedModuleName %>))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
  */

  execute(lxlContainer, params, hash, index) {

  },

  /**
    Called when a tag is closing, such as ((/<%= dasherizedModuleName %>))

    @method close
    @param {Object} lxlContainer
    @param {Array} params
    @param {Object} hash
    @param {Number} index
  */

  close(lxlContainer, params, hash, index) {

  }
});
