import Ember from 'ember';
import layout from '../templates/components/ember-lxl';
import {
  keyDown,
  EKMixin
} from 'ember-keyboard';

const lxlTagClass = 'lxl-tag';
const wordClass = 'lxl-word';
const letterClass = 'lxl-letter';

const htmlTagRegex = '<.*?>';
const lxlTagRegex = '\\(\\([#\\/].*?\\)\\)';

const {
  Component,
  computed,
  get,
  getProperties,
  isBlank,
  isPresent,
  set,
  setProperties
} = Ember;

const { String: { htmlSafe } } = Ember;
const { run: { later } } = Ember;
const { or } = computed;

export default Component.extend(EKMixin, {
  layout,

  keys: [],
  effect: {},
  speed: 25,
  rate: 25,

  activeWordIndex: 0,
  classNames: ['lxl-container'],

  isInstant: or('instantWritePage', 'instantWriteText'),

  didInsertElement(...args) {
    this._super(...args);

    this._bindKeys();
    this._bindResize();
    this._scrollToFirstWord();
  },

  _bindKeys() {
    const keys = get(this, 'keys');

    keys.forEach((key) => {
      this.on(keyDown(key), this._advanceText);
    });
  },

  _bindResize() {
    const resizeService = get(this, 'resizeService');

    if (isPresent(resizeService)) {
      resizeService.on('debouncedDidResize', () => {
        const currentPageFirstWord = get(this, 'currentPageFirstWord');

        this._scrollToWord(currentPageFirstWord);
      });
    }
  },

  _scrollToFirstWord() {
    const $words = get(this, '$words');
    const firstWord = $words.first();

    this._scrollToWord(firstWord);

    set(this, 'currentPageFirstWord', firstWord);
  },

  mouseUp(...args) {
    this._super(...args);

    this._pressEvent(...args);
  },

  touchEnd(...args) {
    this._super(...args);

    this._pressEvent(...args);
  },

  _pressEvent(event) {
    // do nothing on right-click or mouse wheel or combo
    if (event.buttons > 1) { return; }

    // do nothing if the text contains highlighted text
    if (!window.getSelection().isCollapsed) { return; }

    this._advanceText(event);
  },

  _advanceText(event) {
    if (event) {
      event.preventDefault();
    }

    if (get(this, 'pageLoaded')) {
      this._turnPage();
    } else {
      set(this, 'instantWritePage', true);
    }
  },

  _turnPage() {
    const nextPageFirstWord = get(this, 'nextPageFirstWord');

    set(this, 'currentPageFirstWord', nextPageFirstWord);

    this._scrollToWord(nextPageFirstWord);

    if (isBlank(nextPageFirstWord) && this.attrs.onComplete) {
      this.attrs.onComplete();
    }
  },

  _scrollToWord(word) {
    const $words = get(this, '$words');
    const $container = this.$();
    const $word = this.$(word);
    const scrollTop = $word.offset().top - $container.offset().top + $container.scrollTop();

    $container.scrollTop(scrollTop);

    set(this, 'nextPageFirstWord', this._findNextPageFirstWord());

    this._writeWord($words.index($word));
  },

  _findNextPageFirstWord() {
    const {
      currentPageLastWordIndex,
      wordElements
    } = getProperties(this, 'currentPageLastWordIndex', 'wordElements');
    const $container = this.$().parent();
    const offsetBottom = $container.offset().top + $container.height();

    return wordElements.slice(currentPageLastWordIndex + 1).find((element) => {
      const $element = this.$(element);

      return $element.offset().top + $element.height() >= offsetBottom;
    });
  },

  words: computed('text', {
    get() {
      // the first part of the regex matches html tags (eg, `<strong>`), the second part lxl-text-tags,
      // and the last part matches and removes spaces, as we break on spaces to capture words.
      const regex = new RegExp(`${htmlTagRegex}|${lxlTagRegex}|[^<\\s]+`, 'g');

      return Ember.A(get(this, 'text').match(regex));
    }
  }).readOnly(),

  formattedText: computed('words.[]', {
    get() {
      return htmlSafe(get(this, 'words').map((word) => {
        // test if the word is actually a tag
        return new RegExp(htmlTagRegex).test(word) ? word :
          new RegExp(lxlTagRegex).test(word) ?
          `<span class="${lxlTagClass} ${wordClass}" aria-hidden="true">${word}</span>` :
          `<span class="${wordClass}">${word}</span>`;
      }).join(' '));
    }
  }).readOnly(),

  $words: computed('formattedText', {
    get() {
      return this.$(`span.${wordClass}`);
    }
  }).readOnly(),

  wordElements: computed('$words', {
    get() {
      return Ember.A(get(this, '$words').toArray());
    }
  }).readOnly(),

  _writeWord(index) {
    const $words = get(this, '$words');

    if (isBlank($words)) { return; }

    const $word = $words.eq(index);
    const nextPageFirstWord = get(this, 'nextPageFirstWord');

    // stop if the word has already been written
    if ($word.css('opacity') === '1') { return; }

    if ((isBlank(nextPageFirstWord) && index < $words.length) || index < $words.index(nextPageFirstWord)) {
      set(this, 'currentPageLastWordIndex', index);
      set(this, 'pageLoaded', false);
    } else if (!get(this, 'instantWriteText')) {
      setProperties(this, {
        instantWritePage: false,
        pageLoaded: true
      });

      // stop if past the last word in whole text or the last word on the current page
      return;
    } else if (index >= $words.length) {
      set(this, 'pageLoaded', true);

      return;
    }

    if ($word.hasClass(lxlTagClass)) {
      this._executeCustomTag($word.text(), index);
    } else if (get(this, 'isInstant')) {
      this._writeWord(index + 1);
    } else {
      const letters = $word.text().split('');

      $word.html(letters.map((letter) => `<span class="${letterClass}">${letter}</span>`).join(''));
      this._writeLetter($word, letters.length, 0, index);
    }

    $word.css('opacity', 1);
  },

  _writeLetter($word, wordLength, characterIndex, wordIndex) {
    if (get(this, 'isInstant')) {
      const text = $word.text().trim();

      $word.html(text);

      this._writeWord(wordIndex + 1);
    } else {
      const second = 1000;
      const duration = second / get(this, 'speed');
      const rate = get(this, 'rate');
      const values = get(this, 'effect');
      const $letter = $word.find(`span.${letterClass}:eq(${characterIndex})`);

      values.opacity = values.opacity ? values.opacity : { to: 1, from: 0 };

      motion.tween({
        values,
        duration: duration * rate
      }).on($letter[0]).start();

      later(() => {
        if (characterIndex + 1 < wordLength) {
          this._writeLetter($word, wordLength, characterIndex + 1, wordIndex);
        } else {
          this._writeWord(wordIndex + 1);
        }
      }, duration);
    }
  },

  _executeCustomTag(text, index) {
    const [, openingOrClosing, content] = text.match(/\(\((#|\/)(.*?)\)\)/);
    const args = content.split(' ');
    const tagName = args.shift();
    const tag = this[tagName].create();
    const method = openingOrClosing === '#' ? 'start' : 'stop';

    tag[method](this, index, ...args.join(' ').split('|'));
  }
});
