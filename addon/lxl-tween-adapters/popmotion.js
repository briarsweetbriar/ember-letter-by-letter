import Ember from 'ember';
import motion from 'ember-popmotion';

const {
  assign,
  computed,
  get
} = Ember;

export default Ember.Object.extend({
  tweens: computed(() => []),

  animate($element, values, duration) {
    values.opacity = values.opacity ? values.opacity : 1;
    if (!values.hasOwnProperty) { values = assign({}, values); }

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
