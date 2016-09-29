import Ember from 'ember';
import motion from 'ember-popmotion';

const {
  computed,
  get
} = Ember;

export default Ember.Object.extend({
  tweens: computed(() => []),

  animate($element, values, duration) {
    values.opacity = values.opacity ? values.opacity : { to: 1, from: 0 };

    get(this, 'tweens').push(motion.tween({
      values,
      duration
    }).on($element[0]).start());
  },

  finish() {
    get(this, 'tweens').forEach((tween) => {
      tween.seek(1);
    });
  }
});
