import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('installation');
  this.route('usage', function() {
    this.route('rate');
    this.route('duration');
    this.route('effect');
    this.route('keys');
    this.route('callbacks');
    this.route('instant');
    this.route('scrollable');
  });
  this.route('lxl-tags', function() {
    this.route('custom');
    this.route('rate');
    this.route('instant');
    this.route('duration');
    this.route('effect');
    this.route('pause');
    this.route('cb');
  });
  this.route('lxl-tween-adapters');
});

export default Router;
