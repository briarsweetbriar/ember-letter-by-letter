import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('installation');
  this.route('usage');
  this.route('lxl-tags');
});

export default Router;
