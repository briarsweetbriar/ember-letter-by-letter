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
      route: 'stagger'
    }, {
      route: 'tween-rate'
    }, {
      route: 'tween-effect'
    }, {
      route: 'keys'
    }]
  }, {
    route: 'lxl-tags',
    sections: [{
      route: 'custom'
    }, {
      route: 'stagger'
    }, {
      route: 'instant'
    }]
  }]
});
