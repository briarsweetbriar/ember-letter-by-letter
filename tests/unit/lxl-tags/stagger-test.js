import Ember from 'ember';
import CPS from 'ember-letter-by-letter/lxl-tags/stagger';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | stagger');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new stagger on the lxlContainer`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '20' };
    const promise = stagger[methodName](lxlContainer, [12.5]);

    assert.equal(get(lxlContainer, 'stagger'), 12.5, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} multiplies the initial stagger if starting with a *`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '20' };
    const promise = stagger[methodName](lxlContainer, ['*2.5']);

    assert.equal(get(lxlContainer, 'stagger'), 50, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} adds the initial stagger if starting with a +`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '20' };
    const promise = stagger[methodName](lxlContainer, ['+2.5']);

    assert.equal(get(lxlContainer, 'stagger'), 22.5, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} divides the initial stagger if starting with a /`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '20' };
    const promise = stagger[methodName](lxlContainer, ['/2']);

    assert.equal(get(lxlContainer, 'stagger'), 10, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} subtracts the initial stagger if starting with a -`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '20' };
    const promise = stagger[methodName](lxlContainer, ['-2.5']);

    assert.equal(get(lxlContainer, 'stagger'), 17.5, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} gives the remainder of the initial stagger if starting with a %`, function(assert) {
    assert.expect(3);

    const stagger = CPS.create();
    const lxlContainer = { stagger: '22' };
    const promise = stagger[methodName](lxlContainer, ['%2.5']);

    assert.equal(get(lxlContainer, 'stagger'), 2, 'stagger was updated');
    assert.equal(get(stagger, 'initialCps'), 22, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer stagger to its initial value', function(assert) {
  assert.expect(2);

  const stagger = CPS.create({ initialCps: 5 });
  const lxlContainer = { stagger: '22' };
  const promise = stagger.close(lxlContainer);

  assert.equal(get(lxlContainer, 'stagger'), 5, 'stagger was returned to initialCps');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
