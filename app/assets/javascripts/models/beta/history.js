import { sortBy, mapObject, reject } from 'underscore';
import { findById } from './user';

export const getDate = (oldValue, newValue) =>
  [
    oldValue ? I18n.l("date.formats.long", oldValue) : null,
    oldValue ? I18n.l("date.formats.long", newValue) : null
  ];

const isDate = key => key.endsWith("_at");

const isId = key => key.endsWith("_id");

const isInitials = key => key === 'owned_by_initials';

export const deserializeChanges = changes =>
  mapObject(changes, (change, key) => {
    const [oldValue, newValue] = isDate(key) ? getDate(change[0], change[1]) : change;
    return { oldValue, newValue, key };
  });

export const sortByActivityCreation = history =>
  sortBy(history, ({ activity }) => activity.created_at);

export const deserializeHistory = (history, users) =>
  sortByActivityCreation(history)
    .map(item => ({
      activity: {
        ...item.activity,
        changes: filterChanges(deserializeChanges(item.activity.subject_changes)),
        user: findById(users, item.activity.user_id).name
      }
    }))
    .reverse();

export const filterChanges = changes =>
  reject(changes, item => isInitials(item.key) || isId(item.key));
