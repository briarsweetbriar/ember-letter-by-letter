import Ember from 'ember';
import Instant from 'ember-letter-by-letter/lxl-tags/instant';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | LXLTag | instant');

['open', 'execute'].forEach((methodName) => {
  test(`${methodName} sets a new stagger on the lxlContainer`, function(assert) {
    assert.expect(2);

    const instant = Instant.create();
    const lxlContainer = { };
    const promise = instant[methodName](lxlContainer);

    assert.equal(get(lxlContainer, 'instant'), true, 'instant was set');
    assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
  });
});

test('close sets a new stagger on the lxlContainer', function(assert) {
  assert.expect(2);

  const instant = Instant.create();
  const lxlContainer = { };
  const promise = instant.close(lxlContainer);

  assert.equal(get(lxlContainer, 'instant'), false, 'instant was set');
  assert.equal(promise.constructor.name, 'Promise', 'returns a promise');
});
