import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class Popover extends Component {
  constructor(props) {
    super(props);

    this.saveChildRef = this.saveChildRef.bind(this);
    this.saveContentRef = this.saveContentRef.bind(this);
  }

  componentDidMount() {
    const { delay, trigger, title } = this.props;

    $(this.childRef).popover({
      delay,
      trigger,
      title,
      html: true,
      content: this.contentRef,
    });
  }

  componentWillUnmount() {
    $(this.childRef).popover('destroy');
  }

  saveChildRef(ref) {
    this.childRef = ref;
  }

  saveContentRef(ref) {
    this.contentRef = ref;
  }

  render() {
    return (
      <Fragment>
        <div data-testid="story-popover-children">
          {this.props.children({ ref: this.saveChildRef })}
        </div>
        <div style={{ display: 'none' }}>
          {this.props.renderContent({ ref: this.saveContentRef })}
        </div>
      </Fragment>
    );
  }
}

Popover.propTypes = {
  title: PropTypes.string.isRequired,
  trigger: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

Popover.defaultProps = {
  delay: 0,
};
