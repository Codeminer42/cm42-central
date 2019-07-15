import React from 'react';

const History = (props) => {
  const result = props.history.map(item => {
    return (
      <div key={item.activity.id} className="history-activity">
        <Header
          title={I18n.t(`activity.actions.${item.activity.action}`)}
          date={item.activity.created_at}
        />
        <Changes changes={item.activity.subject_changes} />
      </div>
    )
  })
  return <div className="History"> {result} </div>
}

const Header = props =>
  <div className="header">
    <div className="title">{props.title}</div>
    <div className="date">{props.date}</div>
  </div>


const Changes = props => {
  const result = Object.keys(props.changes).map(key => {
    return (
      <div key={key} className="info">
        <div className="action">{I18n.t(`activerecord.attributes.story.${key}`)}</div>
        <div className="changes">
          <div> {props.changes[key][0] || '---'} </div>
          <div> <i className="mi md-18">arrow_forward</i> </div>
          <div> {props.changes[key][1] || '---'} </div>
        </div>
      </div>
    )
  })

  return <div> {result} </div>

}

export default History
