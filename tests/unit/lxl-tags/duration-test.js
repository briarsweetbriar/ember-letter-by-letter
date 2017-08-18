import Ember from 'ember';
import Duration from 'ember-letter-by-letter/lxl-tags/duration';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | tween rate');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new duration on the lxlContainer`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '20' };
    const promise = duration[methodName](lxlContainer, [12.5]);

    assert.equal(get(lxlContainer, 'duration'), 12.5, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 20, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} multiplies the initial duration if starting with a *`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '20' };
    const promise = duration[methodName](lxlContainer, ['*2.5']);

    assert.equal(get(lxlContainer, 'duration'), 50, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 20, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} adds the initial duration if starting with a +`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '20' };
    const promise = duration[methodName](lxlContainer, ['+2.5']);

    assert.equal(get(lxlContainer, 'duration'), 22.5, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 20, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} divides the initial duration if starting with a /`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '20' };
    const promise = duration[methodName](lxlContainer, ['/2']);

    assert.equal(get(lxlContainer, 'duration'), 10, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 20, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} subtracts the initial duration if starting with a -`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '20' };
    const promise = duration[methodName](lxlContainer, ['-2.5']);

    assert.equal(get(lxlContainer, 'duration'), 17.5, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 20, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} gives the remainder of the initial duration if starting with a %`, function(assert) {
    assert.expect(3);

    const duration = Duration.create();
    const lxlContainer = { duration: '22' };
    const promise = duration[methodName](lxlContainer, ['%2.5']);

    assert.equal(get(lxlContainer, 'duration'), 2, 'duration was updated');
    assert.equal(get(duration, 'initialDuration'), 22, 'initialDuration was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer duration to its initial value', function(assert) {
  assert.expect(2);

  const duration = Duration.create({ initialDuration: 5 });
  const lxlContainer = { duration: '22' };
  const promise = duration.close(lxlContainer);

  assert.equal(get(lxlContainer, 'duration'), 5, 'duration was returned to initialDuration');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
