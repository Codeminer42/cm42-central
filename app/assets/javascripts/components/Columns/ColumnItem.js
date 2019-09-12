import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { saveStory } from '../../actions/story'

const columnTarget = {
  canDrop({ canMoveStory, story }) {
    return canMoveStory(story)
  },

  drop({ moveStory, column }, monitor) {
    const story = monitor.getItem().story
    return moveStory(story, column)
  }
}

const collect = (connect, monitor) => {
  const info = {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
  }
  return info
}

const Column = ({
  title,
  children,
  column,
  renderAction,
  onClose,
  connectDropTarget,
  canMoveStory,
  saveStory,
  moveStory,
  item,
  story
}) =>
  connectDropTarget(
    <div className="Column">
      <div className="Column__header">
        <h3 className="Column__name">{title}</h3>
        <div className="Column__actions">
          {renderAction()}
          <button type="button" className="Column__btn-close" onClick={onClose}>
            <i className="mi md-light md-16">close</i>
          </button>
        </div>
      </div>
      <div className="Column__body">{children}</div>
    </div>
  )

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func
}

Column.defaultProps = {
  renderAction: () => null
}

export default connect(
  null,
  { saveStory }
)(DropTarget('STORY', columnTarget, collect)(Column))
