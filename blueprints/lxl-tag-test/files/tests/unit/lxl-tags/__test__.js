import <%= camelizedModuleName %> from '<%= dasherizedPackageName %>/lxl-tags/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | LXLTag | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = <%= camelizedModuleName %>();
  assert.ok(result);
});
