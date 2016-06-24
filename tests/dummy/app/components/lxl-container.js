import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  open: true,

  actions: {
    restart() {
      this.set('open', false);

      Ember.run.next(() => this.set('open', true));
    }
  }
});
