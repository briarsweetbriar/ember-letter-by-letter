import { LXLTag } from 'ember-letter-by-letter';

export default LXLTag.extend({
  /**
    Called when a tag is opening, such as ((#<%= dasherizedModuleName %>))

    @method open
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  open(lxlContainer, params) {

  },

  /**
    Called when a tag is neither opening nor closing, such as ((<%= dasherizedModuleName %>))

    @method execute
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  execute(lxlContainer, params) {

  },

  /**
    Called when a tag is closing, such as ((/<%= dasherizedModuleName %>))

    @method close
    @param {Object} lxlContainer
    @param {Array} params

    @return {Promise}
  */

  close(lxlContainer, params) {

  }
});
