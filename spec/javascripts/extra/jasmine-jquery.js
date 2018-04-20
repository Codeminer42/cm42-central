/*!
Jasmine-jQuery: a set of jQuery helpers for Jasmine tests.

Version 2.0.7

https://github.com/velesin/jasmine-jquery

Copyright (c) 2010-2014 Wojciech Zawistowski, Travis Jeffery

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

+(function (window, jasmine, $) {
  jasmine.spiedEventsKey = function (selector, eventName) {
    return [$(selector).selector, eventName].toString();
  };

  jasmine.getFixtures = function () {
    return jasmine.currentFixtures_ = jasmine.currentFixtures_ || new jasmine.Fixtures();
  };

  jasmine.getStyleFixtures = function () {
    return jasmine.currentStyleFixtures_ = jasmine.currentStyleFixtures_ || new jasmine.StyleFixtures();
  };

  jasmine.Fixtures = function () {
    this.containerId = 'jasmine-fixtures';
    this.fixturesCache_ = {};
    this.fixturesPath = 'spec/javascripts/fixtures';
  };

  jasmine.Fixtures.prototype.set = function (html) {
    this.cleanUp();
    return this.createContainer_(html);
  };

  jasmine.Fixtures.prototype.appendSet = function (html) {
    this.addToContainer_(html);
  };

  jasmine.Fixtures.prototype.preload = function () {
    this.read.apply(this, arguments);
  };

  jasmine.Fixtures.prototype.load = function () {
    this.cleanUp();
    this.createContainer_(this.read.apply(this, arguments));
  };

  jasmine.Fixtures.prototype.appendLoad = function () {
    this.addToContainer_(this.read.apply(this, arguments));
  };

  jasmine.Fixtures.prototype.read = function () {
    let htmlChunks = [],
      fixtureUrls = arguments;

    for (let urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      htmlChunks.push(this.getFixtureHtml_(fixtureUrls[urlIndex]));
    }

    return htmlChunks.join('');
  };

  jasmine.Fixtures.prototype.clearCache = function () {
    this.fixturesCache_ = {};
  };

  jasmine.Fixtures.prototype.cleanUp = function () {
    $(`#${this.containerId}`).remove();
  };

  jasmine.Fixtures.prototype.sandbox = function (attributes) {
    const attributesToSet = attributes || {};
    return $('<div id="sandbox" />').attr(attributesToSet);
  };

  jasmine.Fixtures.prototype.createContainer_ = function (html) {
    const container = $('<div>')
      .attr('id', this.containerId)
      .html(html);

    $(document.body).append(container);
    return container;
  };

  jasmine.Fixtures.prototype.addToContainer_ = function (html) {
    const container = $(document.body).find(`#${this.containerId}`).append(html);

    if (!container.length) {
      this.createContainer_(html);
    }
  };

  jasmine.Fixtures.prototype.getFixtureHtml_ = function (url) {
    if (typeof this.fixturesCache_[url] === 'undefined') {
      this.loadFixtureIntoCache_(url);
    }
    return this.fixturesCache_[url];
  };

  jasmine.Fixtures.prototype.loadFixtureIntoCache_ = function (relativeUrl) {
    let self = this,
      url = this.makeFixtureUrl_(relativeUrl),
      htmlText = '',
      request = $.ajax({
        async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
        cache: false,
        url,
        dataType: 'html',
        success(data, status, $xhr) {
          htmlText = $xhr.responseText;
        },
      }).fail(($xhr, status, err) => {
        throw new Error(`Fixture could not be loaded: ${url} (status: ${status}, message: ${err.message})`);
      });

    const scripts = $($.parseHTML(htmlText, true)).find('script[src]') || [];

    scripts.each(function () {
      $.ajax({
        async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
        cache: false,
        dataType: 'script',
        url: $(this).attr('src'),
        success(data, status, $xhr) {
          htmlText += `<script>${$xhr.responseText}</script>`;
        },
        error($xhr, status, err) {
          throw new Error(`Script could not be loaded: ${url} (status: ${status}, message: ${err.message})`);
        },
      });
    });

    self.fixturesCache_[relativeUrl] = htmlText;
  };

  jasmine.Fixtures.prototype.makeFixtureUrl_ = function (relativeUrl) {
    return this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : `${this.fixturesPath}/${relativeUrl}`;
  };

  jasmine.Fixtures.prototype.proxyCallTo_ = function (methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments);
  };


  jasmine.StyleFixtures = function () {
    this.fixturesCache_ = {};
    this.fixturesNodes_ = [];
    this.fixturesPath = 'spec/javascripts/fixtures';
  };

  jasmine.StyleFixtures.prototype.set = function (css) {
    this.cleanUp();
    this.createStyle_(css);
  };

  jasmine.StyleFixtures.prototype.appendSet = function (css) {
    this.createStyle_(css);
  };

  jasmine.StyleFixtures.prototype.preload = function () {
    this.read_.apply(this, arguments);
  };

  jasmine.StyleFixtures.prototype.load = function () {
    this.cleanUp();
    this.createStyle_(this.read_.apply(this, arguments));
  };

  jasmine.StyleFixtures.prototype.appendLoad = function () {
    this.createStyle_(this.read_.apply(this, arguments));
  };

  jasmine.StyleFixtures.prototype.cleanUp = function () {
    while (this.fixturesNodes_.length) {
      this.fixturesNodes_.pop().remove();
    }
  };

  jasmine.StyleFixtures.prototype.createStyle_ = function (html) {
    let styleText = $('<div></div>').html(html).text(),
      style = $(`<style>${styleText}</style>`);

    this.fixturesNodes_.push(style);
    $('head').append(style);
  };

  jasmine.StyleFixtures.prototype.clearCache = jasmine.Fixtures.prototype.clearCache;
  jasmine.StyleFixtures.prototype.read_ = jasmine.Fixtures.prototype.read;
  jasmine.StyleFixtures.prototype.getFixtureHtml_ = jasmine.Fixtures.prototype.getFixtureHtml_;
  jasmine.StyleFixtures.prototype.loadFixtureIntoCache_ = jasmine.Fixtures.prototype.loadFixtureIntoCache_;
  jasmine.StyleFixtures.prototype.makeFixtureUrl_ = jasmine.Fixtures.prototype.makeFixtureUrl_;
  jasmine.StyleFixtures.prototype.proxyCallTo_ = jasmine.Fixtures.prototype.proxyCallTo_;

  jasmine.getJSONFixtures = function () {
    return jasmine.currentJSONFixtures_ = jasmine.currentJSONFixtures_ || new jasmine.JSONFixtures();
  };

  jasmine.JSONFixtures = function () {
    this.fixturesCache_ = {};
    this.fixturesPath = 'spec/javascripts/fixtures/json';
  };

  jasmine.JSONFixtures.prototype.load = function () {
    this.read.apply(this, arguments);
    return this.fixturesCache_;
  };

  jasmine.JSONFixtures.prototype.read = function () {
    const fixtureUrls = arguments;

    for (let urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      this.getFixtureData_(fixtureUrls[urlIndex]);
    }

    return this.fixturesCache_;
  };

  jasmine.JSONFixtures.prototype.clearCache = function () {
    this.fixturesCache_ = {};
  };

  jasmine.JSONFixtures.prototype.getFixtureData_ = function (url) {
    if (!this.fixturesCache_[url]) this.loadFixtureIntoCache_(url);
    return this.fixturesCache_[url];
  };

  jasmine.JSONFixtures.prototype.loadFixtureIntoCache_ = function (relativeUrl) {
    let self = this,
      url = this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : `${this.fixturesPath}/${relativeUrl}`;

    $.ajax({
      async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
      cache: false,
      dataType: 'json',
      url,
      success(data) {
        self.fixturesCache_[relativeUrl] = data;
      },
      error($xhr, status, err) {
        throw new Error(`JSONFixture could not be loaded: ${url} (status: ${status}, message: ${err.message})`);
      },
    });
  };

  jasmine.JSONFixtures.prototype.proxyCallTo_ = function (methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments);
  };

  jasmine.jQuery = function () {};

  jasmine.jQuery.browserTagCaseIndependentHtml = function (html) {
    return $('<div/>').append(html).html();
  };

  jasmine.jQuery.elementToString = function (element) {
    return $(element).map(function () { return this.outerHTML; }).toArray().join(', ');
  };

  const data = {
    spiedEvents: {},
    handlers: [],
  };

  jasmine.jQuery.events = {
    spyOn(selector, eventName) {
      const handler = function (e) {
        let calls = (typeof data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)] !== 'undefined') ? data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)].calls : 0;
        data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)] = {
          args: jasmine.util.argsToArray(arguments),
          calls: ++calls,
        };
      };

      $(selector).on(eventName, handler);
      data.handlers.push(handler);

      return {
        selector,
        eventName,
        handler,
        reset() {
          delete data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)];
        },
        calls: {
          count() {
            return data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)] ?
              data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)].calls : 0;
          },
          any() {
            return data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)] ?
              !!data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)].calls : false;
          },
        },
      };
    },

    args(selector, eventName) {
      const actualArgs = data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)].args;

      if (!actualArgs) {
        throw `There is no spy for ${eventName} on ${selector.toString()}. Make sure to create a spy using spyOnEvent.`;
      }

      return actualArgs;
    },

    wasTriggered(selector, eventName) {
      return !!(data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)]);
    },

    wasTriggeredWith(selector, eventName, expectedArgs, util, customEqualityTesters) {
      let actualArgs = jasmine.jQuery.events.args(selector, eventName).slice(1);

      if (Object.prototype.toString.call(expectedArgs) !== '[object Array]') { actualArgs = actualArgs[0]; }

      return util.equals(actualArgs, expectedArgs, customEqualityTesters);
    },

    wasPrevented(selector, eventName) {
      let spiedEvent = data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)],
        args = (jasmine.util.isUndefined(spiedEvent)) ? {} : spiedEvent.args,
        e = args ? args[0] : undefined;

      return e && e.isDefaultPrevented();
    },

    wasStopped(selector, eventName) {
      let spiedEvent = data.spiedEvents[jasmine.spiedEventsKey(selector, eventName)],
        args = (jasmine.util.isUndefined(spiedEvent)) ? {} : spiedEvent.args,
        e = args ? args[0] : undefined;

      return e && e.isPropagationStopped();
    },

    cleanUp() {
      data.spiedEvents = {};
      data.handlers = [];
    },
  };

  const hasProperty = function (actualValue, expectedValue) {
    if (expectedValue === undefined) { return actualValue !== undefined; }

    return actualValue === expectedValue;
  };

  beforeEach(() => {
    jasmine.addMatchers({
      toHaveClass() {
        return {
          compare(actual, className) {
            return { pass: $(actual).hasClass(className) };
          },
        };
      },

      toHaveCss() {
        return {
          compare(actual, css) {
            for (const prop in css) {
              const value = css[prop]
              // see issue #147 on gh
              ;if (value === 'auto' && $(actual).get(0).style[prop] === 'auto') continue;
              if ($(actual).css(prop) !== value) return { pass: false };
            }
            return { pass: true };
          },
        };
      },

      toBeVisible() {
        return {
          compare(actual) {
            return { pass: $(actual).is(':visible') };
          },
        };
      },

      toBeHidden() {
        return {
          compare(actual) {
            return { pass: $(actual).is(':hidden') };
          },
        };
      },

      toBeSelected() {
        return {
          compare(actual) {
            return { pass: $(actual).is(':selected') };
          },
        };
      },

      toBeChecked() {
        return {
          compare(actual) {
            return { pass: $(actual).is(':checked') };
          },
        };
      },

      toBeEmpty() {
        return {
          compare(actual) {
            return { pass: $(actual).is(':empty') };
          },
        };
      },

      toBeInDOM() {
        return {
          compare(actual) {
            return { pass: $.contains(document.documentElement, $(actual)[0]) };
          },
        };
      },

      toExist() {
        return {
          compare(actual) {
            return { pass: $(actual).length };
          },
        };
      },

      toHaveLength() {
        return {
          compare(actual, length) {
            return { pass: $(actual).length === length };
          },
        };
      },

      toHaveAttr() {
        return {
          compare(actual, attributeName, expectedAttributeValue) {
            return { pass: hasProperty($(actual).attr(attributeName), expectedAttributeValue) };
          },
        };
      },

      toHaveProp() {
        return {
          compare(actual, propertyName, expectedPropertyValue) {
            return { pass: hasProperty($(actual).prop(propertyName), expectedPropertyValue) };
          },
        };
      },

      toHaveId() {
        return {
          compare(actual, id) {
            return { pass: $(actual).attr('id') == id };
          },
        };
      },

      toHaveHtml() {
        return {
          compare(actual, html) {
            return { pass: $(actual).html() == jasmine.jQuery.browserTagCaseIndependentHtml(html) };
          },
        };
      },

      toContainHtml() {
        return {
          compare(actual, html) {
            let actualHtml = $(actual).html(),
              expectedHtml = jasmine.jQuery.browserTagCaseIndependentHtml(html);

            return { pass: (actualHtml.indexOf(expectedHtml) >= 0) };
          },
        };
      },

      toHaveText() {
        return {
          compare(actual, text) {
            const actualText = $(actual).text();
            const trimmedText = $.trim(actualText);

            if (text && $.isFunction(text.test)) {
              return { pass: text.test(actualText) || text.test(trimmedText) };
            }
            return { pass: (actualText == text || trimmedText == text) };
          },
        };
      },

      toContainText() {
        return {
          compare(actual, text) {
            const trimmedText = $.trim($(actual).text());

            if (text && $.isFunction(text.test)) {
              return { pass: text.test(trimmedText) };
            }
            return { pass: trimmedText.indexOf(text) != -1 };
          },
        };
      },

      toHaveValue() {
        return {
          compare(actual, value) {
            return { pass: $(actual).val() === value };
          },
        };
      },

      toHaveData() {
        return {
          compare(actual, key, expectedValue) {
            return { pass: hasProperty($(actual).data(key), expectedValue) };
          },
        };
      },

      toContainElement() {
        return {
          compare(actual, selector) {
            return { pass: $(actual).find(selector).length };
          },
        };
      },

      toBeMatchedBy() {
        return {
          compare(actual, selector) {
            return { pass: $(actual).filter(selector).length };
          },
        };
      },

      toBeDisabled() {
        return {
          compare(actual, selector) {
            return { pass: $(actual).is(':disabled') };
          },
        };
      },

      toBeFocused(selector) {
        return {
          compare(actual, selector) {
            return { pass: $(actual)[0] === $(actual)[0].ownerDocument.activeElement };
          },
        };
      },

      toHandle() {
        return {
          compare(actual, event) {
            if (!actual || actual.length === 0) return { pass: false };
            const events = $._data($(actual).get(0), 'events');

            if (!events || !event || typeof event !== 'string') {
              return { pass: false };
            }

            let namespaces = event.split('.'),
              eventType = namespaces.shift(),
              sortedNamespaces = namespaces.slice(0).sort(),
              namespaceRegExp = new RegExp(`(^|\\.)${sortedNamespaces.join('\\.(?:.*\\.)?')}(\\.|$)`);

            if (events[eventType] && namespaces.length) {
              for (let i = 0; i < events[eventType].length; i++) {
                const namespace = events[eventType][i].namespace;

                if (namespaceRegExp.test(namespace)) { return { pass: true }; }
              }
            } else {
              return { pass: (events[eventType] && events[eventType].length > 0) };
            }

            return { pass: false };
          },
        };
      },

      toHandleWith() {
        return {
          compare(actual, eventName, eventHandler) {
            if (!actual || actual.length === 0) return { pass: false };
            let normalizedEventName = eventName.split('.')[0],
              stack = $._data($(actual).get(0), 'events')[normalizedEventName];

            for (let i = 0; i < stack.length; i++) {
              if (stack[i].handler == eventHandler) return { pass: true };
            }

            return { pass: false };
          },
        };
      },

      toHaveBeenTriggeredOn() {
        return {
          compare(actual, selector) {
            const result = { pass: jasmine.jQuery.events.wasTriggered(selector, actual) };

            result.message = result.pass ?
              `Expected event ${$(actual)} not to have been triggered on ${selector}` :
              `Expected event ${$(actual)} to have been triggered on ${selector}`;

            return result;
          },
        };
      },

      toHaveBeenTriggered() {
        return {
          compare(actual) {
            let eventName = actual.eventName,
              selector = actual.selector,
              result = { pass: jasmine.jQuery.events.wasTriggered(selector, eventName) };

            result.message = result.pass ?
              `Expected event ${eventName} not to have been triggered on ${selector}` :
              `Expected event ${eventName} to have been triggered on ${selector}`;

            return result;
          },
        };
      },

      toHaveBeenTriggeredOnAndWith(j$, customEqualityTesters) {
        return {
          compare(actual, selector, expectedArgs) {
            let wasTriggered = jasmine.jQuery.events.wasTriggered(selector, actual),
              result = { pass: wasTriggered && jasmine.jQuery.events.wasTriggeredWith(selector, actual, expectedArgs, j$, customEqualityTesters) };

            if (wasTriggered) {
              const actualArgs = jasmine.jQuery.events.args(selector, actual, expectedArgs)[1];
              result.message = result.pass ?
                `Expected event ${actual} not to have been triggered with ${jasmine.pp(expectedArgs)} but it was triggered with ${jasmine.pp(actualArgs)}` :
                `Expected event ${actual} to have been triggered with ${jasmine.pp(expectedArgs)}  but it was triggered with ${jasmine.pp(actualArgs)}`;
            } else {
              // todo check on this
              result.message = result.pass ?
                `Expected event ${actual} not to have been triggered on ${selector}` :
                `Expected event ${actual} to have been triggered on ${selector}`;
            }

            return result;
          },
        };
      },

      toHaveBeenPreventedOn() {
        return {
          compare(actual, selector) {
            const result = { pass: jasmine.jQuery.events.wasPrevented(selector, actual) };

            result.message = result.pass ?
              `Expected event ${actual} not to have been prevented on ${selector}` :
              `Expected event ${actual} to have been prevented on ${selector}`;

            return result;
          },
        };
      },

      toHaveBeenPrevented() {
        return {
          compare(actual) {
            let eventName = actual.eventName,
              selector = actual.selector,
              result = { pass: jasmine.jQuery.events.wasPrevented(selector, eventName) };

            result.message = result.pass ?
              `Expected event ${eventName} not to have been prevented on ${selector}` :
              `Expected event ${eventName} to have been prevented on ${selector}`;

            return result;
          },
        };
      },

      toHaveBeenStoppedOn() {
        return {
          compare(actual, selector) {
            const result = { pass: jasmine.jQuery.events.wasStopped(selector, actual) };

            result.message = result.pass ?
              `Expected event ${actual} not to have been stopped on ${selector}` :
              `Expected event ${actual} to have been stopped on ${selector}`;

            return result;
          },
        };
      },

      toHaveBeenStopped() {
        return {
          compare(actual) {
            let eventName = actual.eventName,
              selector = actual.selector,
              result = { pass: jasmine.jQuery.events.wasStopped(selector, eventName) };

            result.message = result.pass ?
              `Expected event ${eventName} not to have been stopped on ${selector}` :
              `Expected event ${eventName} to have been stopped on ${selector}`;

            return result;
          },
        };
      },
    });

    jasmine.getEnv().addCustomEqualityTester((a, b) => {
      if (a && b) {
        if (a instanceof $ || jasmine.isDomNode(a)) {
          const $a = $(a);

          if (b instanceof $) { return $a.length == b.length && a.is(b); }

          return $a.is(b);
        }

        if (b instanceof $ || jasmine.isDomNode(b)) {
          const $b = $(b);

          if (a instanceof $) { return a.length == $b.length && $b.is(a); }

          return $(b).is(a);
        }
      }
    });

    jasmine.getEnv().addCustomEqualityTester((a, b) => {
      if (a instanceof $ && b instanceof $ && a.size() == b.size()) { return a.is(b); }
    });
  });

  afterEach(() => {
    jasmine.getFixtures().cleanUp();
    jasmine.getStyleFixtures().cleanUp();
    jasmine.jQuery.events.cleanUp();
  });

  window.readFixtures = function () {
    return jasmine.getFixtures().proxyCallTo_('read', arguments);
  };

  window.preloadFixtures = function () {
    jasmine.getFixtures().proxyCallTo_('preload', arguments);
  };

  window.loadFixtures = function () {
    jasmine.getFixtures().proxyCallTo_('load', arguments);
  };

  window.appendLoadFixtures = function () {
    jasmine.getFixtures().proxyCallTo_('appendLoad', arguments);
  };

  window.setFixtures = function (html) {
    return jasmine.getFixtures().proxyCallTo_('set', arguments);
  };

  window.appendSetFixtures = function () {
    jasmine.getFixtures().proxyCallTo_('appendSet', arguments);
  };

  window.sandbox = function (attributes) {
    return jasmine.getFixtures().sandbox(attributes);
  };

  window.spyOnEvent = function (selector, eventName) {
    return jasmine.jQuery.events.spyOn(selector, eventName);
  };

  window.preloadStyleFixtures = function () {
    jasmine.getStyleFixtures().proxyCallTo_('preload', arguments);
  };

  window.loadStyleFixtures = function () {
    jasmine.getStyleFixtures().proxyCallTo_('load', arguments);
  };

  window.appendLoadStyleFixtures = function () {
    jasmine.getStyleFixtures().proxyCallTo_('appendLoad', arguments);
  };

  window.setStyleFixtures = function (html) {
    jasmine.getStyleFixtures().proxyCallTo_('set', arguments);
  };

  window.appendSetStyleFixtures = function (html) {
    jasmine.getStyleFixtures().proxyCallTo_('appendSet', arguments);
  };

  window.loadJSONFixtures = function () {
    return jasmine.getJSONFixtures().proxyCallTo_('load', arguments);
  };

  window.getJSONFixture = function (url) {
    return jasmine.getJSONFixtures().proxyCallTo_('read', arguments)[url];
  };
}(window, window.jasmine, window.jQuery));
