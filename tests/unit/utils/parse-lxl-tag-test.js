import parseLxlTag from 'ember-letter-by-letter/utils/parse-lxl-tag';
import { module, test } from 'qunit';

module('Unit | Utility | parse lxl tag');

test('it grabs the tagName', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('((foo))');

  assert.equal(result.tagName, 'foo', 'tagName is correct');
});

test('`method` is "start" if `#`', function(assert) {
  assert.expect(2);

  const result = parseLxlTag('((#foo))');

  assert.equal(result.method, 'start', 'method is correct');
  assert.ok(result.isOpening, '`isOpening` is true');
});

test('`method` is "start" if none', function(assert) {
  assert.expect(2);

  const result = parseLxlTag('((foo))');

  assert.equal(result.method, 'start', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
});

test('`method` is "stop" if `/`', function(assert) {
  assert.expect(2);

  const result = parseLxlTag('((/foo))');

  assert.equal(result.method, 'stop', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
});

test('`params` are split by spaces', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('((/foo bar baz))');

  assert.deepEqual(result.params, ['bar', 'baz'], 'params are correct');
});

test('`params` are split by spaces, unless in double quotes', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('((/foo "I went to the bar, and \'ordered\' a drink" baz \'single quotes "also" work\' "as do a coder\'s unmatched quotes"))');

  assert.deepEqual(result.params, [
    "I went to the bar, and 'ordered' a drink",
    'baz',
    'single quotes "also" work',
    "as do a coder's unmatched quotes"
  ], 'params are correct');
});
