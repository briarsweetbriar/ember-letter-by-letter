import Ember from 'ember';
import TweenEffect from 'ember-letter-by-letter/lxl-tags/tween-effect';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | tween effect');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new tweenEffect on the lxlContainer`, function(assert) {
    assert.expect(3);

    const tweenEffect = TweenEffect.create();
    const lxlContainer = { tweenEffect: { foo: 'bar' } };
    const promise = tweenEffect[methodName](lxlContainer, [{ baz: 'boom' }]);

    assert.equal(get(lxlContainer, 'tweenEffect'), { baz: 'boom' }, 'tweenEffect was updated');
    assert.equal(get(tweenEffect, 'initialTweenEffect'), { foo: 'bar' }, 'initialTweenEffect was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer tweenEffect to its initial value', function(assert) {
  assert.expect(2);

  const tweenEffect = TweenEffect.create({ initialTweenEffect: { foo: 'bar' } });
  const lxlContainer = { tweenEffect: { baz: 'boom' } };
  const promise = tweenEffect.close(lxlContainer);

  assert.equal(get(lxlContainer, 'tweenEffect'), { foo: 'bar' }, 'tweenEffect was returned to initialTweenEffect');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
