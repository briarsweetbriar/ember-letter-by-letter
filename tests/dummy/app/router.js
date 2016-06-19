import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('installation');
  this.route('usage', function() {
    this.route('cps');
    this.route('tween-rate');
    this.route('effect');
    this.route('keys');
  });
  this.route('lxl-tags', function() {
    this.route('custom');
    this.route('cps');
    this.route('instant');
  });
});

export default Router;
