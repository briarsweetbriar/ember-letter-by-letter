import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  sections: [{
    route: 'index',
    name: 'Overview'
  }, {
    route: 'installation',
    name: 'Installation'
  }, {
    route: 'usage',
    name: 'Usage',
    sections: [{
      route: 'cps'
    }, {
      route: 'tween-rate',
      name: 'tweenRate'
    }, {
      route: 'tween-effect',
      name: 'tweenEffect'
    }, {
      route: 'callbacks'
    }, {
      route: 'keys'
    }]
  }, {
    route: 'lxl-tags',
    sections: [{
      route: 'custom',
      name: '*Custom'
    }, {
      route: 'instant'
    }, {
      route: 'pause'
    }, {
      route: 'cps'
    }, {
      route: 'tween-rate',
    }, {
      route: 'tween-effect',
    }]
  }]
});
