import React from "react";
import PropTypes from "prop-types";

const History = ({ history }) => {
  const result = history.map(item => {
    return (
      <div key={item.activity.id} className="history-activity">
        <Header
          title={I18n.t(`activity.actions.${item.activity.action}`)}
          date={item.activity.created_at}
        />
        <Changes changes={item.activity.subject_changes} />
      </div>
    );
  });
  return <div className="History"> {result} </div>;
};

export const Header = ({ title, date }) => (
  <div className="header">
    <div className="title">{title}</div>
    <div className="date">{I18n.l("date.formats.short", date)}</div>
  </div>
);

export const getDate = (key, changes) => {
  if (key.endsWith("_at")) {
    return [
      changes[key][0] ? I18n.l("date.formats.long", changes[key][0]) : null,
      changes[key][0] ? I18n.l("date.formats.long", changes[key][1]) : null
    ];
  }
  return [changes[key][0], changes[key][1]];
};

export const Changes = ({ changes }) => {
  const result = Object.keys(changes).map(key => {
    const value = getDate(key, changes);
    return (
      <div key={key} className="info">
        <div className="action">
          {I18n.t(`activerecord.attributes.story.${key}`)}
        </div>
        <div className="changes">
          <div> {value[0] || "---"} </div>
          <div>
            <i className="mi md-18">arrow_forward</i>
          </div>
          <div> {value[1] || "---"} </div>
        </div>
      </div>
    );
  });

  return <div> {result} </div>;
};

History.propTypes = {
  history: PropTypes.array.isRequired
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
};

Changes.propTypes = {
  changes: PropTypes.object.isRequired
};

export default History;
