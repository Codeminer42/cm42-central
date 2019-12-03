import React from 'react';
import PropTypes from 'prop-types';

const Column = ({ title, children, renderAction, onClose, visible }) => (
  visible &&
    <div className="Column" data-id="column">
      <div className="Column__header">
        <h3 className="Column__name" data-id="column-title">{title}</h3>
        <div className="Column__actions">
          {renderAction()}
          <button type="button" data-id="column-button" className="Column__btn-close" onClick={onClose}>
            <i className="mi md-light md-16">close</i>
          </button>
        </div>
      </div>
      <div data-id="column-children" className="Column__body">{children}</div>
    </div>
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func,
  visible: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func
}

Column.defaultProps = {
  renderAction: () => null
}

export default Column;
