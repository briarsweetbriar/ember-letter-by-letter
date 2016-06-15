export function initialize(appInstance) {
  appInstance.registerOptionsForType('lxl-tag', { instantiate: false });
}

export default {
  name: 'ember-letter-by-letter/register-lxl-tags',
  initialize
};
