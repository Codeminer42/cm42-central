import * as Notification from '../../../app/assets/javascripts/actions/notifications';
import { types } from '../../../app/assets/javascripts/models/beta/notification';
import status from 'http-status';

describe('Notifications Actions', () => {
  describe('sendSuccessNotification', () => {
    it('dispatches addNotification with the new notification', () => {
      const newNotification = {
        id: 42,
        type: types.SUCCESS,
        message: 'Success message'
      }

      const FakeNotification = {
        createNotification: () => newNotification,
        types
      };

      const fakeDispatch = sinon.stub();

      Notification.sendSuccessNotification(newNotification.message)
        (fakeDispatch, null, { Notification: FakeNotification });

      expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(newNotification));
    });

    it('dispatches removeNotification after 5000ms to remove notification', () => {
      const newNotification = {
        id: 42,
        type: types.SUCCESS,
        message: 'Success message'
      }

      const FakeNotification = {
        createNotification: () => newNotification,
        types
      };

      const fakeDispatch = sinon.stub();

      Notification.sendSuccessNotification(newNotification.message)
        (fakeDispatch, null, { Notification: FakeNotification });

      setTimeout(() => {
        expect(fakeDispatch).toHaveBeenCalledWith(Notification.removeNotification(newNotification.id));
      }, 5000);
    });
  });

  describe('sendErrorNotification', () => {
    const createNotification = (type, message) => ({
      id: 42,
      type,
      message
    });

    describe('when respose error is an unprocessable_entity', () => {
      const error = {
        response: {
          status: status.UNPROCESSABLE_ENTITY,
          data: {
            story: {
              errors: {}
            }
          }
        }
      };

      it('dispatches addValidationNotifications', () => {
        const FakeNotification = {
          createNotification,
          types
        };

        const fakeDispatch = sinon.stub();

        Notification.sendErrorNotification(error)
          (fakeDispatch, null, { Notification: FakeNotification });

        expect(fakeDispatch).toHaveBeenCalled();
      });
    });

    describe('when respose error is unauthorized', () => {
      const error = {
        response: {
          status: status.UNAUTHORIZED
        }
      };

      it('dispatches addNotification with the unauthorized message', () => {
        const FakeNotification = {
          createNotification,
          types
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('users.You are not authorized to perform this action')
        });

        const fakeDispatch = sinon.stub();

        Notification.sendErrorNotification(error)
          (fakeDispatch, null, { Notification: FakeNotification });

        expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(newNotification));
      });
    });

    describe('when respose error is not_found', () => {
      const error = {
        response: {
          status: status.NOT_FOUND
        }
      };

      it('dispatches addNotification with the not_found message', () => {
        const FakeNotification = {
          createNotification,
          types
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('not_found')
        });

        const fakeDispatch = sinon.stub();

        Notification.sendErrorNotification(error)
          (fakeDispatch, null, { Notification: FakeNotification });

        expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(newNotification));
      });
    });

    describe('when respose error is unknown', () => {
      const error = {
        response: {
          status: 'unknown'
        }
      };

      it('dispatches addNotification with the default message', () => {
        const FakeNotification = {
          createNotification,
          types
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('messages.operations.error.default_error')
        });

        const fakeDispatch = sinon.stub();

        Notification.sendErrorNotification(error)
          (fakeDispatch, null, { Notification: FakeNotification });

        expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(newNotification));
      });
    });

    describe('when error has no response property', () => {
      const error = {
        message: "I'm an error!"
      }

      it('dispatches addNotification with the default message', () => {
        const FakeNotification = {
          createNotification,
          types
        };

        const newNotification = createNotification({
          type: types.ERROR,
          message: I18n.t('messages.operations.error.default_error')
        });

        const fakeDispatch = sinon.stub();

        Notification.sendErrorNotification(error)
          (fakeDispatch, null, { Notification: FakeNotification });

        expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(newNotification));
      })
    })
  });

  describe('addValidationNotifications', () => {
    const errors = {
      title: 'can not be null',
      estimate: 'can not be 0'
    }

    it('add all errors to addNotification', () => {
      const createNotification = (type, message) => ({
        id: 42,
        type,
        message
      });

      const expectedNotifications = Object.keys(errors).map(error =>
        createNotification({
          type: types.ERROR,
          message: `Error. ${error}: ${errors[error]}`
        })
      );

      const FakeNotification = {
        createNotification,
        types
      };

      const fakeDispatch = sinon.stub();

      Notification.addValidationNotifications(errors)
        (fakeDispatch, null, { Notification: FakeNotification });

      expect(fakeDispatch).toHaveBeenCalledWith(Notification.addNotification(expectedNotifications));
    });
  });
});
