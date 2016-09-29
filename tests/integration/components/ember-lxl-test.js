import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { initialize as initializeLxlTags } from 'ember-letter-by-letter';

const {
  getOwner,
  set
} = Ember;

const { run: { later } } = Ember;

moduleForComponent('ember-lxl', 'Integration | Component | ember lxl', {
  integration: true,

  beforeEach() {
    initializeLxlTags(getOwner(this));
  }
});

test('it coerces its text into a string', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-lxl text=123}}`);

  assert.equal(this.$('.lxl-word').text().trim(), '123', 'number coerced');
});

test('it parses words into word and letter spans', function(assert) {
  assert.expect(2);

  this.render(hbs`{{ember-lxl text="Word, I have a word."}}`);

  assert.equal(this.$('.lxl-word').length, 5, 'it wraps words');
  assert.equal(this.$('.lxl-word:first .lxl-letter').length, 5, 'it wraps characters into spans');
});

test('tags are respected', function(assert) {
  assert.expect(8);

  this.render(hbs`{{ember-lxl text="Outside <span id='span'>inside <strong id='strong'>bold</strong></span>"}}`);

  assert.equal(this.$('.lxl-word').length, 5, 'it wraps words');

  const $span = this.$('#span');
  assert.equal($span.length, 1, 'span is present');
  assert.equal($span.text().trim(), 'inside  bold', 'span contains the right text');
  assert.ok($span.is('span'), 'span is correct element');

  const $strong = this.$('#strong');
  assert.equal($strong.length, 1, 'strong is present');
  assert.equal($strong.text().trim(), 'bold', 'strong contains the right text');
  assert.ok($strong.is('strong'), 'strong is correct element');

  assert.equal(this.$('.lxl-word').length - this.$('.lxl-dom-element').length, 3, 'correct number of lxl-words');
});

test('it executes lxl-tags', function(assert) {
  assert.expect(6);

  const done = assert.async();

  this.render(hbs`{{ember-lxl text="Slow [[#cps 1000000000]]very fast, and it's still fast and fast fast fast[[/cps]] slow." cps=10 tweenRate=5}}`);

  assert.equal(this.$('.lxl-word:first').css('opacity'), 1, 'first starts out 0');
  assert.equal(this.$('.lxl-word:last').css('opacity'), 0, 'last starts out 0');
  assert.equal(this.$('.lxl-word').length - this.$('.lxl-tag').length, 12, 'correct number of lxl-words');

  later(() => {
    assert.equal(this.$('.lxl-word:nth(2)').css('opacity'), 1, 'second word faded in');
    assert.equal(this.$('.lxl-word:nth(11)').css('opacity'), 1, 'last fast word faded in');
    assert.ok(parseFloat(this.$('.lxl-word:last .lxl-letter:last').css('opacity')) < 1, 'last letter not faded in');

    done();
  }, 1000);
});

test('it gradually fades the characters in', function(assert) {
  assert.expect(5);

  const done = assert.async();

  this.render(hbs`{{ember-lxl text="Word." cps=100 tweenRate=5}}`);

  assert.equal(this.$('.lxl-letter:first').css('opacity'), 0, 'first starts out 0');
  assert.equal(this.$('.lxl-letter:last').css('opacity'), 0, 'last starts out 0');

  later(() => {
    assert.ok(this.$('.lxl-letter:first').css('opacity') > this.$('.lxl-letter:last').css('opacity'), 'fades from first to last');
  }, 20);

  later(() => {
    assert.equal(this.$('.lxl-letter:first').css('opacity'), 1, 'first becomes 1');
    assert.equal(this.$('.lxl-letter:last').css('opacity'), 1, 'last becomes 1');

    done();
  }, 125);
});

test('it pauses once it reaches the bottom of the container', function(assert) {
  assert.expect(19);

  const done = assert.async();

  set(this, 'completed', () => {
    assert.ok(false, 'ran onComplete callback prematurely');
  });

  set(this, 'paused', () => {
    assert.ok(true, 'ran onPageEnd callback');
  });

  set(this, 'resumed', () => {
    assert.ok(true, 'ran onPageStart callback');
  });

  set(this, 'started', () => {
    assert.ok(true, 'ran onStartedWriting callback');
  });

  set(this, 'stopped', () => {
    assert.ok(true, 'ran onStoppedWriting callback');
  });

  this.render(hbs`
    <div style="width: 250px; height: 50px; font-family: DejaVu Serif; font-size: 18px;">
      {{ember-lxl
        text="This is a really long sentance, but that's totally necessary!"
        cps=10000000000
        tweenRate=0
        onComplete=(action completed)
        onPageEnd=(action paused)
        onPageStart=(action resumed)
        onStartedWriting=(action started)
        onStoppedWriting=(action stopped)
      }}
    </div>
  `);

  assert.equal(this.$('.lxl-word').length, 10, 'it immediately writes all words');
  assert.equal(this.$('.lxl-letter').length, 4, 'it starts with this many characters wrapped');

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 17, 'it continues wrapping characters');
  }, 350);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 17, 'it has stopped wrapping characters');

    this.$('.lxl-container').trigger('mouseup');

    set(this, 'completed', () => {
      assert.ok(true, 'ran onComplete callback at correct time');
    });
  }, 400);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 42, 'it has resumed wrapping characters');

    this.$('.lxl-container').trigger('mouseup');
  }, 750);

  later(() => {
    assert.equal(this.$('.lxl-letter').length, 52, 'it completes writing');

    this.$('.lxl-container').trigger('mouseup');

    done();
  }, 1000);
});

test('text can be instawrote with a click', function(assert) {
  assert.expect(2);

  const done = assert.async();

  this.render(hbs`
    <div style="width: 250px; height: 50px; font-family: DejaVu Serif; font-size: 18px;">
      {{ember-lxl
        text="This is a really long sentance, but that's totally necessary!"
      }}
    </div>
  `);

  assert.equal(this.$('.lxl-word:last').css('opacity'), 0, 'last word starts faded out');

  later(() => {
    this.$('.lxl-container').trigger('mouseup');
  }, 25);

  later(() => {
    this.$('.lxl-container').trigger('mouseup');
  }, 50);

  later(() => {
    this.$('.lxl-container').trigger('mouseup');
  }, 75);

  later(() => {
    this.$('.lxl-container').trigger('mouseup');
  }, 100);

  later(() => {
    assert.equal(this.$('.lxl-word:last').css('opacity'), 1, 'last word faded in');

    done();
  }, 250);
});

test('text is not scrollable by default', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-lxl text="Word, I have a word."}}`);

  assert.ok(!this.$('.lxl-container').hasClass('ps-container'), 'scrollbar not applied');
});

test('text can be scrollable', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-lxl text="Word, I have a word." scrollable=true}}`);

  assert.ok(this.$('.lxl-container').hasClass('ps-container'), 'scrollbar applied');
});
