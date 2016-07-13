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
      route: 'callbacks',
      name: 'Callbacks'
    }, {
      route: 'instant'
    }, {
      route: 'scrollable'
    }, {
      route: 'cps'
    }, {
      route: 'tween-rate',
      name: 'tweenRate'
    }, {
      route: 'tween-effect',
      name: 'tweenEffect'
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
  }, {
    route: 'lxl-tween-adapters'
  }]
});
