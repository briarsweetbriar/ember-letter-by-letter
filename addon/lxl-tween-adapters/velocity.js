import Ember from 'ember';

export default Ember.Object.extend({
  animate($element, effect, duration) {
    effect.opacity = effect.opacity ? effect.opacity : [1, 0];

    return Ember.$.Velocity.animate($element, effect, { duration });
  },

  finish($elements) {
    $elements.velocity('finish');
  }
});
