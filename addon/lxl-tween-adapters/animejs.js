import Ember from 'ember';
import anime from 'ember-animejs';

const {
  computed,
  get
} = Ember;

const { RSVP: { Promise } } = Ember;

export default Ember.Object.extend({
  animations: computed(() => []),

  animate($element, effect, duration) {
    if (!effect.opacity) { effect.opacity = 1; }
    if (!effect.easing) { effect.easing = 'easeOutCubic'; }

    effect.targets = $element.get(0);
    effect.duration = duration;

    const animation = anime(effect);

    get(this, 'animations').push(animation);

    return new Promise((resolve) => {
      animation.complete = resolve;
    });
  },

  finish() {
    get(this, 'animations').forEach((animation) => {
      animation.seek(100);
    });
  }
});
