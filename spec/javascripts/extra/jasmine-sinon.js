const messageFactories = {
  spy(txt) {
    return function (pass, spy) {
      return `${messageUtils.expectedSpy(pass, spy, txt)}.`;
    };
  },
  spyWithCallCount(txt) {
    return function (pass, spy, otherArgs) {
      return `${messageUtils.expectedSpy(pass, spy, txt)}. ${
        messageUtils.callCount(spy)}.`;
    };
  },
  spyWithOtherArgs(txt) {
    return function (pass, spy, otherArgs) {
      return `${messageUtils.expectedSpy(pass, spy, txt)} ${
        messageUtils.otherArgs(otherArgs)}`;
    };
  },
};

var messageUtils = {
  expectedSpy(pass, spy, txt) {
    const not = (pass ? 'not ' : '');
    const printf = spy.printf || sinon.spy.printf;
    return printf.call(spy, 'Expected spy "%n" %1%2', not, txt);
  },
  callCount(spy) {
    const printf = spy.printf || sinon.spy.printf;
    return printf.call(spy, '"%n" was called %c');
  },
  otherArgs(otherArgs) {
    if (!otherArgs || !otherArgs.length) {
      return '';
    } else if (otherArgs.length > 1) {
      return jasmine.pp(otherArgs);
    }
    return jasmine.pp(otherArgs[0]);
  },
};

const matchers = [
  {
    sinonName: 'called',
    jasmineName: 'toHaveBeenCalled',
    message: messageFactories.spyWithCallCount('to have been called'),
  },
  {
    sinonName: 'calledOnce',
    jasmineName: 'toHaveBeenCalledOnce',
    message: messageFactories.spyWithCallCount('to have been called once'),
  },
  {
    sinonName: 'calledTwice',
    jasmineName: 'toHaveBeenCalledTwice',
    message: messageFactories.spyWithCallCount('to have been called twice'),
  },
  {
    sinonName: 'calledThrice',
    jasmineName: 'toHaveBeenCalledThrice',
    message: messageFactories.spyWithCallCount('to have been called thrice'),
  },
  {
    sinonName: 'calledBefore',
    jasmineName: 'toHaveBeenCalledBefore',
    message: messageFactories.spyWithOtherArgs('to have been called before'),
  },
  {
    sinonName: 'calledAfter',
    jasmineName: 'toHaveBeenCalledAfter',
    message: messageFactories.spyWithOtherArgs('to have been called after'),
  },
  {
    sinonName: 'calledOn',
    jasmineName: 'toHaveBeenCalledOn',
    message: messageFactories.spyWithOtherArgs('to have been called on'),
  },
  {
    sinonName: 'alwaysCalledOn',
    jasmineName: 'toHaveBeenAlwaysCalledOn',
    message: messageFactories.spyWithOtherArgs('to have been always called on'),
  },
  {
    sinonName: 'calledWith',
    jasmineName: 'toHaveBeenCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been called with'),
  },
  {
    sinonName: 'alwaysCalledWith',
    jasmineName: 'toHaveBeenAlwaysCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been always called with'),
  },
  {
    sinonName: 'calledWithExactly',
    jasmineName: 'toHaveBeenCalledWithExactly',
    message: messageFactories.spyWithOtherArgs('to have been called with exactly'),
  },
  {
    sinonName: 'alwaysCalledWithExactly',
    jasmineName: 'toHaveBeenAlwaysCalledWithExactly',
    message: messageFactories.spyWithOtherArgs('to have been always called with exactly'),
  },
  {
    sinonName: 'calledWithMatch',
    jasmineName: 'toHaveBeenCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been called with match'),
  },
  {
    sinonName: 'alwaysCalledWithMatch',
    jasmineName: 'toHaveBeenAlwaysCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been always called with match'),
  },
  {
    sinonName: 'calledWithNew',
    jasmineName: 'toHaveBeenCalledWithNew',
    message: messageFactories.spy('to have been called with new'),
  },
  {
    sinonName: 'neverCalledWith',
    jasmineName: 'toHaveBeenNeverCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been never called with'),
  },
  {
    sinonName: 'neverCalledWithMatch',
    jasmineName: 'toHaveBeenNeverCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been never called with match'),
  },
  {
    sinonName: 'threw',
    jasmineName: 'toHaveThrown',
    message: messageFactories.spyWithOtherArgs('to have thrown an error'),
  },
  {
    sinonName: 'alwaysThrew',
    jasmineName: 'toHaveAlwaysThrown',
    message: messageFactories.spyWithOtherArgs('to have always thrown an error'),
  },
  {
    sinonName: 'returned',
    jasmineName: 'toHaveReturned',
    message: messageFactories.spyWithOtherArgs('to have returned'),
  },
  {
    sinonName: 'alwaysReturned',
    jasmineName: 'toHaveAlwaysReturned',
    message: messageFactories.spyWithOtherArgs('to have always returned'),
  },
];

function createCustomMatcher(arg, util, customEqualityTesters) {
  return sinon.match(val => util.equals(val, arg, customEqualityTesters));
}

function createMatcher(matcher) {
  const original = jasmine.matchers[matcher.jasmineName];

  return function (util, customEqualityTesters) {
    return {
      compare() {
        let sinonProperty,
          arg,
          pass;
        const args = [].slice.call(arguments, 0);
        const actual = args[0];

        if (jasmine.isSpy(actual) && original) {
          return original(util, customEqualityTesters).compare.apply(null, args);
        }

        for (let i = 0, len = args.length; i < len; i++) {
          arg = args[i];
          if (arg && (typeof arg.jasmineMatches === 'function' || arg instanceof jasmine.ObjectContaining)) {
            args[i] = createCustomMatcher(arg, util, customEqualityTesters);
          }
        }

        sinonProperty = actual[matcher.sinonName];

        if (typeof sinonProperty === 'function') {
          pass = sinonProperty.apply(actual, args.slice(1));
        } else {
          pass = sinonProperty;
        }

        return {
          pass,
          message: matcher.message(pass, actual, args.slice(1)),
        };
      },
    };
  };
}

function createJasmineSinonMatchers(matchers) {
  let matcher,
    jasmineSinonMatchers = {};
  for (let i = 0, len = matchers.length; i < len; i++) {
    matcher = matchers[i];
    jasmineSinonMatchers[matcher.jasmineName] = createMatcher(matcher);
  }
  return jasmineSinonMatchers;
}

beforeEach(() => {
  jasmine.addMatchers(createJasmineSinonMatchers(matchers));
});

jasmine.jasmineSinon = {
  messageFactories,
};
