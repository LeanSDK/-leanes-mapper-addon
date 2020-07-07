const chai = require("chai");
const sinon = require("sinon");
_ = require('lodash');
ES = require('../../../src/leanes/es/index');
const expect = chai.expect;
const assert = chai.assert;
({ co } = ES.NS.Utils);

describe('StateMachineMixin', () => {
  describe('include StateMachineMixin', () => {
    it('should create new class with state machine and instantiate', () => {
      expect(() => {
        const Test = (() => {
          class Test extends ES { };

          Test.inheritProtected();

          Test.initialize();

          return Test;

        }).call(this);
        const MyClass = (() => {
          class MyClass extends ES.NS.CoreObject { };

          MyClass.inheritProtected();

          MyClass.include(ES.NS.StateMachineMixin);

          MyClass.module(Test);

          MyClass.initialize();

          return MyClass;

        }).call(this);
        const myInstance = MyClass.new();
        assert.instanceOf(myInstance, Test.NS.MyClass, 'Cannot instantiate class MyClass');
      }).to.not.throw(Error);
    });
  });
  describe('include and initialize StateMachineMixin', () => {
    it('should create new class with state machine and initialize default state machine', () => {
      const spySMConfig = sinon.spy(() => { });
      expect(() => {
        const Test = (() => {
          class Test extends ES { };

          Test.inheritProtected();

          Test.initialize();

          return Test;

        }).call(this);
        const MyClass = (() => {
          class MyClass extends ES.NS.CoreObject { };

          MyClass.inheritProtected();

          MyClass.include(ES.NS.StateMachineMixin);

          MyClass.module(Test);

          MyClass.StateMachine('default', spySMConfig);

          MyClass.initialize();

          return MyClass;

        }).call(this);
        const myInstance = MyClass.new();
        assert.instanceOf(myInstance, Test.NS.MyClass, 'Cannot instantiate class MyClass');
        assert.isTrue(spySMConfig.called, 'Initializer did not called');
      }).to.not.throw(Error);
    });
  });
  describe('test hooks in StateMachineMixin', () => {
    it('should initialize and call hooks', () => {
      co(function* () {
        const MyClass, Test, myInstance;
        Test = (() => {
          class Test extends ES { };

          Test.inheritProtected();

          Test.initialize();

          return Test;

        }).call(this);
        const MyClass = (() => {
          class MyClass extends ES.NS.CoreObject { };

          MyClass.inheritProtected();

          MyClass.include(ES.NS.StateMachineMixin);

          MyClass.module(Test);

          MyClass.NS.testValue = 'test';

          MyClass.NS.testBeforeAllEvents = sinon.spy(() => { });

          MyClass.NS.testEventBefore = sinon.spy(() => { });

          MyClass.NS.testTransitionGuard = sinon.spy(() => {
            return this.testValue === 'test';
          });

          MyClass.NS.testOldStateBeforeExit = sinon.spy(() => { });

          MyClass.NS.testAfterAllTransitions = sinon.spy(() => { });

          MyClass.NS.testTransitionAfter = sinon.spy(() => { });

          MyClass.NS.testNewStateBeforeEnter = sinon.spy(() => { });

          MyClass.NS.testOldStateAfterExit = sinon.spy(() => { });

          MyClass.NS.testNewStateAfterEnter = sinon.spy(() => { });

          MyClass.NS.testEventAfter = sinon.spy(() => { });

          MyClass.NS.testAfterAllEvents = sinon.spy(() => { });

          MyClass.NS.testEventError = sinon.spy(() => { });

          MyClass.NS.testErrorOnAllEvents = sinon.spy(() => { });

          MyClass.StateMachine('default', () => {
            this.beforeAllEvents('testBeforeAllEvents');
            this.afterAllTransitions('testAfterAllTransitions');
            this.afterAllEvents('testAfterAllEvents');
            this.errorOnAllEvents('testErrorOnAllEvents');
            this.state('oldState', {
              initial: true,
              beforeExit: 'testOldStateBeforeExit',
              afterExit: 'testOldStateAfterExit'
            });
            this.state('newState', {
              beforeEnter: 'testNewStateBeforeEnter',
              afterEnter: 'testNewStateAfterEnter'
            });
            this.event('testEvent', {
              before: 'testEventBefore',
              after: 'testEventAfter',
              error: 'testEventError'
            }, () => {
              this.transition(['oldState'], 'newState', {
                guard: 'testTransitionGuard',
                after: 'testTransitionAfter'
              });
            });
          });

          MyClass.initialize();

          return MyClass;

        }).call(this);
        const myInstance = MyClass.new();
        yield myInstance.resetDefault();
        yield myInstance.testEvent();
        assert.instanceOf(myInstance.getStateMachine('default'), ES.NS.StateMachine, 'Cannot create state machine');
        assert.isTrue(myInstance.testBeforeAllEvents.called, 'testBeforeAllEvents did not called');
        assert.isTrue(myInstance.testEventBefore.called, 'testEventBefore did not called');
        assert.isTrue(myInstance.testTransitionGuard.called, 'testTransitionGuard did not called');
        assert.isTrue(myInstance.testOldStateBeforeExit.called, 'testOldStateBeforeExit did not called');
        assert.isTrue(myInstance.testAfterAllTransitions.called, 'testAfterAllTransitions did not called');
        assert.isTrue(myInstance.testTransitionAfter.called, 'testTransitionAfter did not called');
        assert.isTrue(myInstance.testNewStateBeforeEnter.called, 'testNewStateBeforeEnter did not called');
        assert.isTrue(myInstance.testOldStateAfterExit.called, 'testOldStateAfterExit did not called');
        assert.isTrue(myInstance.testNewStateAfterEnter.called, 'testNewStateAfterEnter did not called');
        assert.isTrue(myInstance.testEventAfter.called, 'testEventAfter did not called');
        assert.isTrue(myInstance.testAfterAllEvents.called, 'testAfterAllEvents did not called');
        assert.isFalse(myInstance.testEventError.called, 'testEventError called');
        assert.isFalse(myInstance.testErrorOnAllEvents.called, 'testErrorOnAllEvents called');
      });
    });
  });
  describe('test emitter in StateMachineMixin', () => {
    it('should initialize and call emitter hook', () => {
      co(function* () {
        const testEmit = sinon.spy(() => { });
        const Test = (() => {
          class Test extends ES { };

          Test.inheritProtected();

          return Test;

        }).call(this);
        Test.initialize();
        const MyClass = (() => {
          class MyClass extends ES.NS.CoreObject { };

          MyClass.inheritProtected();

          MyClass.include(ES.NS.StateMachineMixin);

          MyClass.module(Test);

          MyClass.NS.testValue = 'test';

          MyClass.NS.testEventBefore = sinon.spy(() => { });

          MyClass.NS.testTransitionGuard = sinon.spy(() => {
            return this.testValue === 'test';
          });

          MyClass.NS.testTransitionAfter = sinon.spy(() => { });

          MyClass.NS.testNewStateBeforeEnter = 'TestNotification';

          MyClass.NS.testOldStateAfterExit = sinon.spy(() => { });

          MyClass.NS.testErrorOnAllEvents = sinon.spy(() => { });

          MyClass.public({
            emit: Function
          }, {
            default: testEmit
          });

          MyClass.StateMachine('default', () => {
            ({
              errorOnAllEvents: 'testErrorOnAllEvents'
            });
            this.state('oldState', {
              initial: true,
              afterExit: 'testOldStateAfterExit'
            });
            this.state('newState', {
              beforeEnter: 'testNewStateBeforeEnter'
            });
            return this.event('testEvent', {
              before: 'testEventBefore'
            }, () => {
              return this.transition(['oldState'], 'newState', {
                guard: 'testTransitionGuard',
                after: 'testTransitionAfter'
              });
            });
          });

          return MyClass;

        }).call(this);
        MyClass.initialize();
        const myInstance = MyClass.new();
        yield myInstance.resetDefault();
        yield myInstance.testEvent('testArgument1', 'testArgument2');
        assert.instanceOf(myInstance.getStateMachine('default'), ES.NS.StateMachine, 'Cannot create state machine');
        assert.isTrue(myInstance.testEventBefore.called, 'testEventBefore did not called');
        assert.isTrue(myInstance.testTransitionGuard.called, 'testTransitionGuard did not called');
        assert.isTrue(myInstance.testTransitionAfter.calledWith('testArgument1', 'testArgument2'), 'testTransitionAfter did not called');
        assert.isTrue(testEmit.calledWith('TestNotification'), '"emit" not called with "TestNotification"');
        assert.isTrue(myInstance.testOldStateAfterExit.called, 'testOldStateAfterExit did not called');
        assert.isFalse(myInstance.testErrorOnAllEvents.called, 'testErrorOnAllEvents called');
      });
    });
  });
});
