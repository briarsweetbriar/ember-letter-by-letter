import Ember from 'ember';

export default Ember.Controller.extend({
  alert(arg1, arg2) {
    alert(`${arg1}; ${arg2}`);
  },

  customPause(duration) {
    return new Ember.RSVP.Promise((resolve) => {
      setTimeout(resolve, duration);
    })
  }
});
