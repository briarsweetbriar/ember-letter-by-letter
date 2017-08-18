import Ember from 'ember';
import Effect from 'ember-letter-by-letter/lxl-tags/effect';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | tween effect');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new effect on the lxlContainer`, function(assert) {
    assert.expect(3);

    const effect = Effect.create();
    const lxlContainer = { effect: { foo: 'bar' } };
    const promise = effect[methodName](lxlContainer, [{ baz: 'boom' }]);

    assert.deepEqual(get(lxlContainer, 'effect'), { baz: 'boom' }, 'effect was updated');
    assert.deepEqual(get(effect, 'initialEffect'), { foo: 'bar' }, 'initialEffect was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer effect to its initial value', function(assert) {
  assert.expect(2);

  const effect = Effect.create({ initialEffect: { foo: 'bar' } });
  const lxlContainer = { effect: { baz: 'boom' } };
  const promise = effect.close(lxlContainer);

  assert.deepEqual(get(lxlContainer, 'effect'), { foo: 'bar' }, 'effect was returned to initialEffect');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
