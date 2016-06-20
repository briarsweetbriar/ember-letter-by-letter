import addClassTo from 'ember-letter-by-letter/utils/add-class-to';
import { module, test } from 'qunit';

module('Unit | Utility | add class to');

test('it adds classes to a DOM element with no class', function(assert) {
  assert.expect(1);

  const result = addClassTo(['foo', 'bar'], '<code id="something">');

  assert.equal(result, '<code id="something" class="foo bar">', 'classes added');
});

test('it adds classes to a DOM element with class', function(assert) {
  assert.expect(1);

  const result = addClassTo(['foo', 'bar'], '<code class="baz">');

  assert.equal(result, '<code class="foo bar baz">', 'classes added');
});

test('it returns closing tags as-is', function(assert) {
  assert.expect(1);

  const result = addClassTo(['foo', 'bar'], '</code>');

  assert.equal(result, '</code>', 'classes not added');
});
