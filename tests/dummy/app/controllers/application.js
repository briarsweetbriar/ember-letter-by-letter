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
      route: 'duration'
    }, {
      route: 'effect'
    }, {
      route: 'instant'
    }, {
      route: 'rate'
    }, {
      route: 'scrollable'
    }, {
      route: 'keys'
    }]
  }, {
    route: 'lxl-tags',
    sections: [{
      route: 'custom',
      name: '*Custom'
    }, {
      route: 'cb',
    }, {
      route: 'duration',
    }, {
      route: 'effect',
    }, {
      route: 'instant'
    }, {
      route: 'pause'
    }, {
      route: 'rate'
    }]
  }, {
    route: 'lxl-tween-adapters'
  }]
});
