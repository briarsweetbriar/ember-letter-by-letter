import Ember from 'ember';
import config from 'ember-get-config';
import layout from '../templates/components/ember-lxl';
import addClassTo from 'ember-letter-by-letter/utils/add-class-to';
import parseLxlTag from 'ember-letter-by-letter/utils/parse-lxl-tag';
import {
  keyDown,
  EKMixin
} from 'ember-keyboard';
import ResizeAware from 'ember-resize-for-addons';

const second = 1000;
const lxlTagClass = 'lxl-tag';
const lxlDomClass = 'lxl-dom-element';
const wordClass = 'lxl-word';
const letterClass = 'lxl-letter';

const htmlTagRegex = '<.*?>';
const lxlTagRegex = '\\[\\[.*?\\]\\]';

const {
  Component,
  computed,
  get,
  getOwner,
  getProperties,
  guidFor,
  isBlank,
  isNone,
  isPresent,
  set
} = Ember;

const {
  String: {
    htmlSafe
  }
} = Ember;

const { run: { later } } = Ember;
const { or } = computed;

export default Component.extend(EKMixin, ResizeAware, {
  layout,

  keys: [],
  rate: 25,
  effect: {},
  duration: 25,
  scrollOptions: {
    suppressScrollX: true
  },

  activeWordIndex: -1,
  _scrolledAheadIndex: 0,
  activeTags: {},
  classNames: ['lxl-container'],

  isInstant: or('instantWritePage', 'instant', '_scrolledAhead'),

  tweenAdapter: computed('tweenLibrary', {
    get() {
      const library = get(this, 'tweenLibrary') || get(config, 'emberLetterByLetter.tweenLibrary') || 'jquery';

      return getOwner(this).lookup(`lxl-tween-adapter:${library}`);
    }
  }),

  _notifyComplete() {
    set(this, 'isComplete', true);
    if (isPresent(this.attrs.onComplete)) {
      this.attrs.onComplete();
    }
  },

  _notifyPageEnd() {
    set(this, 'pageLoaded', true);
    if (isPresent(this.attrs.onPageEnd) && !get(this, 'isComplete')) {
      this.attrs.onPageEnd();
    }
    this._notifyStoppedWriting();
  },

  _notifyPageStart() {
    set(this, 'pageLoaded', false);
    if (isPresent(this.attrs.onPageStart) && !get(this, 'isComplete')) {
      this.attrs.onPageStart();
    }
    this._notifyStartedWriting();
  },

  _notifyStartedWriting() {
    set(this, 'isWriting', true);
    if (isPresent(this.attrs.onStartedWriting) && !get(this, 'isComplete')) {
      this.attrs.onStartedWriting();
    }
  },

  _notifyStoppedWriting() {
    set(this, 'isWriting', false);
    if (isPresent(this.attrs.onStoppedWriting) && !get(this, 'isComplete')) {
      this.attrs.onStoppedWriting();
    }
  },

  didInsertElement(...args) {
    this._super(...args);

    Ember.run.scheduleOnce('afterRender', this, this._didInsertElement);
  },

  didRender(...args) {
    this._super(...args);

    const cbs = get(this, 'cbs');
    const $links = this.$('[data-cb]');

    if (!$links) return;

    $links.each(function() {
      const $element = Ember.$(this);
      const name = $element.data('cb');

      $element.on('click', cbs[name]);
    });
  },

  willDestroy(...args) {
    this._super(...args);

    const cbs = get(this, 'cbs');
    const $links = this.$('[data-cb]');

    if (!$links) return;

    $links.each(function() {
      const $element = Ember.$(this);
      const name = $element.data('cb');

      $element.off('click', cbs[name]);
    });
  },

  didResize() {
    this._scrollToWord(get(this, 'currentPageFirstWord'));

    const nextPageFirstWord = set(this, 'nextPageFirstWord', this._findNextPageFirstWord());
    const nextPageFirstWordIndex = get(this, '$words').index(nextPageFirstWord);
    const activeWordIndex = get(this, 'activeWordIndex');

    if (isPresent(nextPageFirstWord) && nextPageFirstWordIndex < activeWordIndex) {
      this.incrementProperty('activeWordIndex');
      this._undoPreviousWord();
      this._markPageAsComplete();
    } else if (nextPageFirstWordIndex > activeWordIndex && get(this, 'pageLoaded')) {
      this._notifyPageStart();
      this._doNextWord();
    }
  },

  _didInsertElement() {
    this._bindPressEvents();
    this._bindKeys();
    this._initializePerfectScrollbar();
    this._notifyPageStart();
    this._scrollToFirstWord();
  },

  willDestroyElement(...args) {
    this._super(...args);

    this._removePerfectScrollbar();
  },

  _bindPressEvents() {
    ['mouseUp', 'touchEnd'].forEach((eventName) => {
      this.on(eventName, this._pressEvent);
    });
  },

  _bindKeys() {
    const keys = get(this, 'keys');

    keys.forEach((key) => {
      this.on(keyDown(key), this._advanceText);
    });
  },

  _initializePerfectScrollbar() {
    if (isNone(PerfectScrollbar)) { return; }

    if (get(this, 'scrollable')) {
      const guid = guidFor(this);
      PerfectScrollbar.initialize(this.$()[0], get(this, 'scrollOptions'));
      Ember.$(document).on(`ps-scroll-down.${guid}`, (event) => {
        if (event.target.id === guid) {
          set(this, 'nextPageFirstWord', this._findNextPageFirstWord());
          set(this, '_scrolledAheadIndex', this._findScrolledAheadIndex());
          if (!get(this, 'isWriting')) {
            this._notifyPageStart();
            this._doNextWord();
          }
        }
      });
    }
  },

  _removePerfectScrollbar() {
    if (isNone(PerfectScrollbar)) { return; }

    PerfectScrollbar.destroy(this.element);
    Ember.$(document).off(`ps-scroll-down.${guidFor(this)}`);
  },

  _scrollToFirstWord() {
    const $words = get(this, '$words');
    const firstWord = $words.first();

    this._scrollToWord(firstWord);
    this._doNextWord();

    set(this, 'currentPageFirstWord', firstWord);
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
      get(this, 'tweenAdapter').finish(this.$(`.${letterClass}`));
    }
  },

  _turnPage() {
    const nextPageFirstWord = get(this, 'nextPageFirstWord');

    set(this, 'currentPageFirstWord', nextPageFirstWord);

    this._scrollToWord(nextPageFirstWord);
    this._doNextWord();

    if (isBlank(nextPageFirstWord)) {
      this._notifyComplete();
    } else {
      this._notifyPageStart();
    }
  },

  _scrollToWord(word) {
    const $container = this.$();
    const $word = this.$(word);
    const scrollTop = $word.offset().top - $container.offset().top + $container.scrollTop();

    $container.scrollTop(scrollTop);

    set(this, 'nextPageFirstWord', this._findNextPageFirstWord());
  },

  _findScrolledAheadIndex() {
    const wordElements = get(this, 'wordElements');
    const $container = this.$().parent();
    const offsetTop = $container.offset().top;

    let index = 0;

    wordElements.find((element, wordIndex) => {
      index = wordIndex;
      const $element = this.$(element);
      return $element.offset().top >= offsetTop;
    });

    return index;
  },

  _findNextPageFirstWord() {
    const wordElements = get(this, 'wordElements');
    const $container = this.$();
    const offsetBottom = $container.offset().top + $container.height();

    return wordElements.find((element) => {
      const $element = this.$(element);

      return $element.offset().top + $element.height() >= offsetBottom;
    });
  },

  _scrolledAhead: computed('activeWordIndex', '_scrolledAheadIndex', {
    get() {
      return get(this, '_scrolledAheadIndex') > get(this, 'activeWordIndex');
    }
  }).readOnly(),

  cps: computed('rate', {
    get() {
      return second / get(this, 'rate');
    }
  }),

  tweenDuration: computed('cps', 'duration', 'isInstant', {
    get() {
      return get(this, 'isInstant') ? 0 : get(this, 'cps') * get(this, 'duration');
    }
  }),

  words: computed('text', {
    get() {
      // the first part of the regex matches html tags (eg, `<strong>`), the second part lxl-text-tags,
      // and the last part matches and removes spaces, as we break on spaces to capture words.
      const regex = new RegExp(`${htmlTagRegex}|${lxlTagRegex}|[^<>\\[\\]\\s]+`, 'g');

      return Ember.A(get(this, 'text').toString().match(regex));
    }
  }).readOnly(),

  formattedText: computed('words.[]', {
    get() {
      return htmlSafe(get(this, 'words').map((word) => {
        // test if the word is actually a tag
        return new RegExp(htmlTagRegex).test(word) ? addClassTo([lxlDomClass, wordClass], word) :
          new RegExp(lxlTagRegex).test(word) ?
            `<span class="${lxlTagClass} ${wordClass}" aria-hidden="true">${word}</span>` :
            `<span class="${wordClass}">${this._splitWord(word)}</span>`;
      }).join(' '));
    }
  }).readOnly(),

  _splitWord(word) {
    return word.match(/&.*?;|[^]/g).map((letter) => `<span class="${letterClass}">${letter}</span>`).join('');
  },

  $words: computed('formattedText', {
    get() {
      return this.$(`.${wordClass}`);
    }
  }).readOnly(),

  wordElements: computed('$words', {
    get() {
      return Ember.A(get(this, '$words').toArray());
    }
  }).readOnly(),

  _doNextWord() {
    const $words = get(this, '$words');

    if (isBlank($words)) { return; }

    const index = this.incrementProperty('activeWordIndex');
    const $word = $words.eq(index);
    const nextPageFirstWord = get(this, 'nextPageFirstWord');

    // stop if the word has already been written
    if ($word.css('opacity') === '1') { return; }

    const pageIsLoaded =
      index >= $words.length ||
      (isPresent(nextPageFirstWord) && index >= $words.index(nextPageFirstWord));

    if (pageIsLoaded) {
      this._markPageAsComplete();
      this.decrementProperty('activeWordIndex');
    } else {
      set(this, 'pageLoaded', false);

      this._writeWord($word);
    }
  },

  _markPageAsComplete() {
    later(() => {
      if (get(this, 'isDestroyed')) { return; }

      if (!get(this, 'instant')) {
        set(this, 'instantWritePage', false);
      }

      this._notifyPageEnd();
    }, get(this, 'tweenDuration'));
  },

  _writeWord($word) {
    if ($word.hasClass(lxlTagClass)) {
      this._executeCustomTag($word.text());
    } else if ($word.hasClass(lxlDomClass)) {
      this._executeDomTag($word);
    } else if (get(this, 'isInstant')) {
      this._shortCircuitWord($word);
    } else {
      const letters = $word.text().split('');

      $word.css('opacity', 1);
      this._writeLetter($word, letters.length, 0);
    }
  },

  _writeLetter($word, wordLength, characterIndex) {
    if (get(this, 'isInstant')) { return this._shortCircuitWord($word); }

    const cps = get(this, 'cps');
    const $letter = $word.find(`span.${letterClass}:eq(${characterIndex})`);

    this._tween($letter);

    later(() => {
      if (get(this, 'isDestroyed')) { return; }

      if (characterIndex + 1 < wordLength) {
        this._writeLetter($word, wordLength, characterIndex + 1);
      } else {
        this._doNextWord();
      }
    }, cps);
  },

  _shortCircuitWord($word) {
    $word.html($word.text().trim());
    this._tween($word);
    this._doNextWord();
  },

  _executeCustomTag(text) {
    const container = getOwner(this);
    const { isClosing, isOpening, method, params, tagName } = parseLxlTag(text);
    const activeTags = get(this, `activeTags.${tagName}`) || set(this, `activeTags.${tagName}`, Ember.A());
    const tag = isClosing ? activeTags.popObject() : container.lookup(`lxl-tag:${tagName}`).create();

    if (isOpening) {
      activeTags.pushObject(tag);
    }

    tag[method](this, params).then(() => {
      this._doNextWord();
    });
  },

  _executeDomTag($tag) {
    this._tween($tag);

    later(() => {
      this._doNextWord();
    }, get(this, 'cps'));
  },

  _tween($element) {
    const { tweenAdapter, effect, tweenDuration } = getProperties(this, 'tweenAdapter', 'effect', 'tweenDuration');

    tweenAdapter.animate($element, effect, tweenDuration);
  },

  _undoPreviousWord() {
    const $words = get(this, '$words');

    if (isBlank($words)) { return; }

    const index = this.decrementProperty('activeWordIndex');
    const $word = $words.eq(index);
    const nextPageFirstWord = get(this, 'nextPageFirstWord');

    if ($word.css('opacity') !== '0' && index >= $words.index(nextPageFirstWord)) {
      this._undoWord($word, index);
    }
  },

  _undoWord($word) {
    if (!$word.hasClass(lxlTagClass)) {
      $word.css('opacity', 0);
    }
    this._undoPreviousWord();
  }
});
