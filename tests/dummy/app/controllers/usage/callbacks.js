import Ember from 'ember';

export default Ember.Controller.extend({
  _highlight(id) {
    Ember.$(id).velocity({ color: '#FFFBCC' }, 750).velocity({ color: '#000' }, 750);
  },

  actions: {
    highlightPageStart() {
      this._highlight('#on_page_start');
    },
    highlightPageEnd() {
      this._highlight('#on_page_end');
    },
    highlightComplete() {
      this._highlight('#on_complete');
    },
  }
});
