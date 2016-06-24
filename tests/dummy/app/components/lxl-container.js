import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  open: true,

  classNames: ['clearfix', 'lxl-outer-outer-container'],

  actions: {
    restart() {
      this.set('open', false);

      Ember.run.next(() => this.set('open', true));
    }
  }
});
