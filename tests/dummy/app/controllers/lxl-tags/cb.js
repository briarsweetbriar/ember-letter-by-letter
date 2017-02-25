import Ember from 'ember';

export default Ember.Controller.extend({
  value1: 'you clicked',
  value2: 'me',

  alert(arg1, arg2) {
    const value1 = Ember.typeOf(arg1) === 'string' ? arg1 : this.get('value1');
    const value2 = Ember.typeOf(arg2) === 'string' ? arg2 : this.get('value2');

    alert(`${value1}; ${value2}`);
  },

  customPause(duration) {
    return new Ember.RSVP.Promise((resolve) => {
      setTimeout(resolve, duration);
    })
  },

  cbs: Ember.computed({
    get() {
      return {
        alert: this.alert.bind(this),
        customPause: this.customPause.bind(this)
      }
    }
  })
});
