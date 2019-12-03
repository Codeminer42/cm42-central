import React from 'react';
import PropTypes from 'prop-types';

const Column = ({ title, children, renderAction, onClose, visible }) => (
  visible &&
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
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node
}

Column.defaultProps = {
  renderAction: () => null
}

export default Column;
