import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run: { later } } = Ember;

moduleForComponent('ember-lxl', 'Integration | Component | ember lxl', {
  integration: true
});

test('it parses words into word and letter spans', function(assert) {
  assert.expect(2);

  this.render(hbs`{{ember-lxl text="Word, I have a word."}}`);

  assert.equal(this.$('.lxl-word').length, 5, 'it wraps words');
  assert.equal(this.$('.lxl-word:first .lxl-letter').length, 5, 'it wraps characters into spans');
});

test('it gradually fades the characters in', function(assert) {
  assert.expect(5);

  const done = assert.async();

  this.render(hbs`{{ember-lxl text="Word." speed=100 rate=5}}`);

  assert.equal(this.$('.lxl-letter:first').css('opacity'), 0, 'first starts out 0');
  assert.equal(this.$('.lxl-letter:last').css('opacity'), 0, 'last starts out 0');

  later(() => {
    assert.ok(this.$('.lxl-letter:first').css('opacity') > this.$('.lxl-letter:last').css('opacity'), 'fades from first to last');
  }, 10);

  later(() => {
    assert.equal(this.$('.lxl-letter:first').css('opacity'), 1, 'first becomes 1');
    assert.equal(this.$('.lxl-letter:last').css('opacity'), 1, 'last becomes 1');

    done();
  }, 100);
});
