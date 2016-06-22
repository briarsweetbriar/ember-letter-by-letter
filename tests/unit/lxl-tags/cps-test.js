import Ember from 'ember';
import CPS from 'ember-letter-by-letter/lxl-tags/cps';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | cps');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new cps on the lxlContainer`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '20' };
    const promise = cps[methodName](lxlContainer, [12.5]);

    assert.equal(get(lxlContainer, 'cps'), 12.5, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} multiplies the initial cps if starting with a *`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '20' };
    const promise = cps[methodName](lxlContainer, ['*2.5']);

    assert.equal(get(lxlContainer, 'cps'), 50, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} adds the initial cps if starting with a +`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '20' };
    const promise = cps[methodName](lxlContainer, ['+2.5']);

    assert.equal(get(lxlContainer, 'cps'), 22.5, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} divides the initial cps if starting with a /`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '20' };
    const promise = cps[methodName](lxlContainer, ['/2']);

    assert.equal(get(lxlContainer, 'cps'), 10, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} subtracts the initial cps if starting with a -`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '20' };
    const promise = cps[methodName](lxlContainer, ['-2.5']);

    assert.equal(get(lxlContainer, 'cps'), 17.5, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 20, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });

  test(`${methodName} gives the remainder of the initial cps if starting with a %`, function(assert) {
    assert.expect(3);

    const cps = CPS.create();
    const lxlContainer = { cps: '22' };
    const promise = cps[methodName](lxlContainer, ['%2.5']);

    assert.equal(get(lxlContainer, 'cps'), 2, 'cps was updated');
    assert.equal(get(cps, 'initialCps'), 22, 'initialCps was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close returns the lxlContainer cps to its initial value', function(assert) {
  assert.expect(2);

  const cps = CPS.create({ initialCps: 5 });
  const lxlContainer = { cps: '22' };
  const promise = cps.close(lxlContainer);

  assert.equal(get(lxlContainer, 'cps'), 5, 'cps was returned to initialCps');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
