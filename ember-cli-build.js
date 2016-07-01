/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    stringifyPath: 'markdown',
    babel: {
      includePolyfill: true
    }
  });

  app.import("bower_components/highlightjs/styles/monokai-sublime.css");

  return app.toTree();
};
