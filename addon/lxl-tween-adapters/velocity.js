import Ember from 'ember';

export default Ember.Object.extend({
  animate($element, effect, duration) {
    effect.opacity = effect.opacity ? effect.opacity : 1;
    if (!effect.hasOwnProperty) { effect = Ember.assign({}, effect); }

    return Ember.$.Velocity.animate($element, effect, { duration, easing: 'ease-out' });
  },

  finish($elements) {
    $elements.velocity('finish');
  }
});
