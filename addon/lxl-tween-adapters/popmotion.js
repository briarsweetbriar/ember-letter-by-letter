import Ember from 'ember';
import motion from 'ember-popmotion';

export default Ember.Object.extend({
  animate($element, values, duration) {
    values.opacity = values.opacity ? values.opacity : { to: 1, from: 0 };

    motion.tween({
      values,
      duration
    }).on($element[0]).start();
  }
});
