import <%= classifiedModuleName %> from '<%= dasherizedPackageName %>/lxl-tween-adapters/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('Unit | LXLTweenAdapter | <%= dasherizedModuleName %>');

// Replace this with your real tests.
test('it works', function(assert) {
  const <%= camelizedModuleName %> = <%= classifiedModuleName %>.create();
  assert.ok(<%= camelizedModuleName %>);
});
