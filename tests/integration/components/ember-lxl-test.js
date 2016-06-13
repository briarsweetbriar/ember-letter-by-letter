import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { set } = Ember;
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

test('it pauses once it reaches the bottom of the container', function(assert) {
  assert.expect(7);

  const done = assert.async();

  set(this, 'completed', () => {
    assert.ok(false, 'ran onComplete callback prematurely');
  });

  this.render(hbs`
    <div style="width: 125px; height: 50px;">
      {{ember-lxl
        text="This is a really long sentance, but that's totally necessary!"
        speed=10000000000
        rate=0
        onComplete=(action completed)
      }}
    </div>
  `);

  assert.equal(this.$('.lxl-word').length, 10, 'it immediately writes all words');
  assert.equal(this.$('.lxl-letter').length, 4, 'it starts with this many characters wrapped');

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 29, 'it continues wrapping characters');
  }, 150);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 29, 'it has stopped wrapping characters');

    this.$('.lxl-container').trigger('mouseup');

    set(this, 'completed', () => {
      assert.ok(true, 'ran onComplete callback at correct time');
    });
  }, 200);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 52, 'it has resumed wrapping characters');

    this.$('.lxl-container').trigger('mouseup');
  }, 350);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 52, 'it completes writing');

    done();
  }, 400);
});
