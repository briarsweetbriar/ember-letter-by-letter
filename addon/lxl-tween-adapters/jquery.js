import Ember from 'ember';

export default Ember.Object.extend({
  animate($element, effect, duration) {
    $element.fadeIn(duration).css('opacity', 1);
  },

  finish() {}
});
