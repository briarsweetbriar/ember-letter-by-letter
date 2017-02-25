import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('installation');
  this.route('usage', function() {
    this.route('cps');
    this.route('tween-rate');
    this.route('tween-effect');
    this.route('keys');
    this.route('callbacks');
    this.route('instant');
    this.route('scrollable');
  });
  this.route('lxl-tags', function() {
    this.route('custom');
    this.route('cps');
    this.route('instant');
    this.route('tween-rate');
    this.route('tween-effect');
    this.route('pause');
    this.route('cb');
  });
  this.route('lxl-tween-adapters');
});

export default Router;
