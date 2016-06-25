import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('installation');
  this.route('usage', function() {
    this.route('stagger');
    this.route('tween-rate');
    this.route('tween-effect');
    this.route('keys');
  });
  this.route('lxl-tags', function() {
    this.route('custom');
    this.route('stagger');
    this.route('instant');
    this.route('tween-rate');
    this.route('tween-effect');
  });

  this.route('lxl-tag', function() {});
});

export default Router;
