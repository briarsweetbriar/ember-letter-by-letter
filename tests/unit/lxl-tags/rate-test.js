import Ember from 'ember';
import Rate from 'ember-letter-by-letter/lxl-tags/rate';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | rate');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new rate on the lxlContainer`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '20' };
    const promise = rate[methodName](lxlContainer, [12.5]);

    assert.equal(get(lxlContainer, 'rate'), 12.5, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 20, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} multiplies the initial rate if starting with a *`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '20' };
    const promise = rate[methodName](lxlContainer, ['*2.5']);

    assert.equal(get(lxlContainer, 'rate'), 50, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 20, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} adds the initial rate if starting with a +`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '20' };
    const promise = rate[methodName](lxlContainer, ['+2.5']);

    assert.equal(get(lxlContainer, 'rate'), 22.5, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 20, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} divides the initial rate if starting with a /`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '20' };
    const promise = rate[methodName](lxlContainer, ['/2']);

    assert.equal(get(lxlContainer, 'rate'), 10, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 20, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} subtracts the initial rate if starting with a -`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '20' };
    const promise = rate[methodName](lxlContainer, ['-2.5']);

    assert.equal(get(lxlContainer, 'rate'), 17.5, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 20, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} gives the remainder of the initial rate if starting with a %`, function(assert) {
    assert.expect(3);

    const rate = Rate.create();
    const lxlContainer = { rate: '22' };
    const promise = rate[methodName](lxlContainer, ['%2.5']);

    assert.equal(get(lxlContainer, 'rate'), 2, 'rate was updated');
    assert.equal(get(rate, 'initialRate'), 22, 'initialRate was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer rate to its initial value', function(assert) {
  assert.expect(2);

  const rate = Rate.create({ initialRate: 5 });
  const lxlContainer = { rate: '22' };
  const promise = rate.close(lxlContainer);

  assert.equal(get(lxlContainer, 'rate'), 5, 'rate was returned to initialRate');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
