import * as Notification from '../../../app/assets/javascripts/actions/notifications';
import { types } from '../../../app/assets/javascripts/models/beta/notification';
import status from 'http-status';

describe('Notifications Actions', () => {
  describe('sendSuccessNotification', () => {
    it('dispatches addNotification with the new notification', () => {
      const newNotification = {
        id: 42,
        type: types.SUCCESS,
        message: 'Success message',
      };

      const FakeNotification = {
        createNotification: () => newNotification,
        types,
      };

      const fakeDispatch = vi.fn();

      Notification.sendSuccessNotification(newNotification.message)(
        fakeDispatch,
        null,
        { Notification: FakeNotification }
      );

      expect(fakeDispatch).toHaveBeenCalledWith(
        Notification.addNotification(newNotification)
      );
    });

    it('dispatches removeNotification after 5000ms to remove notification', () => {
      const newNotification = {
        id: 42,
        type: types.SUCCESS,
        message: 'Success message',
      };

      const FakeNotification = {
        createNotification: () => newNotification,
        types,
      };

      const clock = sinon.useFakeTimers();

      const fakeDispatch = vi.fn();

      Notification.sendSuccessNotification(newNotification.message)(
        fakeDispatch,
        null,
        { Notification: FakeNotification }
      );

      clock.tick(5000);

      expect(fakeDispatch).toHaveBeenCalledWith(
        Notification.removeNotification(newNotification.id)
      );

      clock.restore();
    });
  });

  describe('sendErrorNotification', () => {
    const createNotification = (type, message) => ({
      id: 42,
      type,
      message,
    });

    describe('when response error is an unprocessable_entity', () => {
      const error = {
        response: {
          status: status.UNPROCESSABLE_ENTITY,
          data: {
            story: {
              errors: {},
            },
          },
        },
      };

      it('dispatches addValidationNotifications', () => {
        const FakeNotification = {
          createNotification,
          types,
        };

        const fakeDispatch = vi.fn();

        Notification.sendErrorNotification(error)(fakeDispatch, null, {
          Notification: FakeNotification,
        });

        expect(fakeDispatch).toHaveBeenCalled();
      });
    });

    describe('when response error is unauthorized', () => {
      const error = {
        response: {
          status: status.UNAUTHORIZED,
        },
      };

      it('dispatches addNotification with the unauthorized message', () => {
        const FakeNotification = {
          createNotification,
          types,
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t(
            'users.You are not authorized to perform this action'
          ),
        });

        const fakeDispatch = vi.fn();

        Notification.sendErrorNotification(error)(fakeDispatch, null, {
          Notification: FakeNotification,
        });

        expect(fakeDispatch).toHaveBeenCalledWith(
          Notification.addNotification(newNotification)
        );
      });
    });

    describe('when response error is not_found', () => {
      const error = {
        response: {
          status: status.NOT_FOUND,
        },
      };

      it('dispatches addNotification with the not_found message', () => {
        const FakeNotification = {
          createNotification,
          types,
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('not_found'),
        });

        const fakeDispatch = vi.fn();

        Notification.sendErrorNotification(error)(fakeDispatch, null, {
          Notification: FakeNotification,
        });

        expect(fakeDispatch).toHaveBeenCalledWith(
          Notification.addNotification(newNotification)
        );
      });
    });

    describe('when response error is unknown', () => {
      const error = {
        response: {
          status: 'unknown',
        },
      };

      it('dispatches addNotification with the default message', () => {
        const FakeNotification = {
          createNotification,
          types,
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('messages.operations.error.default_error'),
        });

        const fakeDispatch = vi.fn();

        Notification.sendErrorNotification(error)(fakeDispatch, null, {
          Notification: FakeNotification,
        });

        expect(fakeDispatch).toHaveBeenCalledWith(
          Notification.addNotification(newNotification)
        );
      });
    });

    describe('when error has no response property', () => {
      const error = {
        message: "I'm an error!",
      };

      it('dispatches addNotification with the default message', () => {
        const FakeNotification = {
          createNotification,
          types,
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('messages.operations.error.default_error'),
        });

        const fakeDispatch = vi.fn();

        Notification.sendErrorNotification(error)(fakeDispatch, null, {
          Notification: FakeNotification,
        });

        expect(fakeDispatch).toHaveBeenCalledWith(
          Notification.addNotification(newNotification)
        );
      });
    });

    describe('when error has invalid response', () => {
      const invalidMessageErrors = [null, undefined, '', false];

      invalidMessageErrors.forEach(message => {
        const error = {
          response: message,
        };

        it('dispatch addNotification with default notification', () => {
          const defaultNotifcation = createNotification({
            type: types.ERROR,
            message: I18n.t('messages.operations.error.default_error'),
          });

          const FakeNotification = {
            createNotification,
            types,
          };

          const fakeDispatch = vi.fn();

          Notification.sendErrorNotification(error)(fakeDispatch, null, {
            Notification: FakeNotification,
          });

          expect(fakeDispatch).toHaveBeenCalledWith(
            Notification.addNotification(defaultNotifcation)
          );
        });
      });
    });

    describe('when custom is true', () => {
      const errorsMessage = ['error', 'message here', 'lorem ipsum'];

      errorsMessage.forEach(error => {
        describe(`and error is ${error}`, () => {
          it(`dispatch addNotification with ${error}`, () => {
            const trueCustom = { custom: true };

            const FakeNotification = {
              createNotification,
              types,
            };

            const newNotification = createNotification({
              type: types.ERROR,
              message: I18n.t(error),
            });

            const fakeDispatch = vi.fn();

            Notification.sendErrorNotification(error, trueCustom)(
              fakeDispatch,
              null,
              { Notification: FakeNotification }
            );

            expect(fakeDispatch).toHaveBeenCalledWith(
              Notification.addNotification(newNotification)
            );
          });
        });
      });
    });
  });

  describe('sendCustomErrorNotification', () => {
    const createNotification = (type, message) => ({
      id: 42,
      type,
      message,
    });

    const errorsMessage = ['error', 'message here', 'lorem ipsum'];

    errorsMessage.forEach(error => {
      describe(`when message is ${error}`, () => {
        it(`dispatch addNotification with ${error}`, () => {
          const FakeNotification = {
            createNotification,
            types,
          };

          const newNotification = createNotification({
            type: types.ERROR,
            message: I18n.t(error),
          });

          const fakeDispatch = vi.fn();

          Notification.sendCustomErrorNotification(error)(fakeDispatch, null, {
            Notification: FakeNotification,
          });

          expect(fakeDispatch).toHaveBeenCalledWith(
            Notification.addNotification(newNotification)
          );
        });
      });
    });
  });

  describe('addValidationNotifications', () => {
    const errors = {
      title: 'can not be null',
      estimate: 'can not be 0',
    };

    it('add all errors to addNotification', () => {
      const createNotification = (type, message) => ({
        id: 42,
        type,
        message,
      });

      const expectedNotifications = Object.keys(errors).map(error =>
        createNotification({
          type: types.ERROR,
          message: `Error. ${error}: ${errors[error]}`,
        })
      );

      const FakeNotification = {
        createNotification,
        types,
      };

      const fakeDispatch = vi.fn();

      Notification.addValidationNotifications(errors)(fakeDispatch, null, {
        Notification: FakeNotification,
      });

      expect(fakeDispatch).toHaveBeenCalledWith(
        Notification.addNotification(expectedNotifications)
      );
    });
  });
});
