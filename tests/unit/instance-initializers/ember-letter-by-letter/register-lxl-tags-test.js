import Ember from 'ember';
import { initialize } from 'dummy/instance-initializers/ember-letter-by-letter/register-lxl-tags';
import { module, test } from 'qunit';
import destroyApp from '../../../helpers/destroy-app';

module('Unit | Instance Initializer | ember letter by letter/register lxl tags', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

test('lxl-tags are uninitialized', function(assert) {
  assert.expect(1);

  initialize(this.appInstance);

  this.appInstance.register('lxl-tag:foo', Ember.Object.extend());

  assert.ok(this.appInstance.lookup('lxl-tag:foo').create, 'not initialized');
});
