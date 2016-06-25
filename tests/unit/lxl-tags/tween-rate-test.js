import Ember from 'ember';
import TweenRate from 'ember-letter-by-letter/lxl-tags/tween-rate';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | tween rate');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new tweenRate on the lxlContainer`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '20' };
    const promise = tweenRate[methodName](lxlContainer, [12.5]);

    assert.equal(get(lxlContainer, 'tweenRate'), 12.5, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 20, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} multiplies the initial tweenRate if starting with a *`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '20' };
    const promise = tweenRate[methodName](lxlContainer, ['*2.5']);

    assert.equal(get(lxlContainer, 'tweenRate'), 50, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 20, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} adds the initial tweenRate if starting with a +`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '20' };
    const promise = tweenRate[methodName](lxlContainer, ['+2.5']);

    assert.equal(get(lxlContainer, 'tweenRate'), 22.5, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 20, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} divides the initial tweenRate if starting with a /`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '20' };
    const promise = tweenRate[methodName](lxlContainer, ['/2']);

    assert.equal(get(lxlContainer, 'tweenRate'), 10, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 20, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} subtracts the initial tweenRate if starting with a -`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '20' };
    const promise = tweenRate[methodName](lxlContainer, ['-2.5']);

    assert.equal(get(lxlContainer, 'tweenRate'), 17.5, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 20, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} gives the remainder of the initial tweenRate if starting with a %`, function(assert) {
    assert.expect(3);

    const tweenRate = TweenRate.create();
    const lxlContainer = { tweenRate: '22' };
    const promise = tweenRate[methodName](lxlContainer, ['%2.5']);

    assert.equal(get(lxlContainer, 'tweenRate'), 2, 'tweenRate was updated');
    assert.equal(get(tweenRate, 'initialTweenRate'), 22, 'initialTweenRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer tweenRate to its initial value', function(assert) {
  assert.expect(2);

  const tweenRate = TweenRate.create({ initialTweenRate: 5 });
  const lxlContainer = { tweenRate: '22' };
  const promise = tweenRate.close(lxlContainer);

  assert.equal(get(lxlContainer, 'tweenRate'), 5, 'tweenRate was returned to initialTweenRate');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
