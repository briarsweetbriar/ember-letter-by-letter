import Ember from 'ember';
import { keyDown } from 'ember-keyboard';
import Pause from 'ember-letter-by-letter/lxl-tags/pause';
import { module, test } from 'qunit';

const {
  Evented,
  on
} = Ember;

const { run: { later } } = Ember;

const LxlContainer = Ember.Object.extend(Evented, { keys: [] });

module('Unit | LXLTag | pause');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} resolves after the provided duration`, function(assert) {
    const done = assert.async();

    assert.expect(2);

    let resolved = false;

    const pause = Pause.create();
    const lxlContainer = LxlContainer.create();
    const promise = pause[methodName](lxlContainer, [100]);

    promise.then(() => {
      resolved = true;
    });

    assert.ok(!resolved, 'promise not immediately resolved');

    later(() => {
      assert.ok(resolved, 'promise resolved after 100ms');

      done();
    }, 200);
  });

  test(`${methodName} resolves after the bound key press`, function(assert) {
    const done = assert.async();

    assert.expect(1);

    let resolved = false;

    const pause = Pause.create();
    const lxlContainer = LxlContainer.create({
      keys: ['Enter', 'ArrowRight'],

      advanceText: on(keyDown('Enter'), keyDown('ArrowRight'), function() {
        assert.ok(resolved, 'advanceText ran');
      })
    });

    const promise = pause[methodName](lxlContainer, []);

    promise.then(() => {
      resolved = true;
    });

    lxlContainer.trigger(keyDown('ArrowRight'));

    later(() => {
      lxlContainer.trigger(keyDown('ArrowRight'));

      done();
    });
  });
});
