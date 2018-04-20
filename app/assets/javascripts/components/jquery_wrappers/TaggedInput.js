/* eslint react/prop-types:"off" */
import React from 'react';

class TaggedInput extends React.Component {
  constructor(props) {
    super(props);
    this.saveInputRef = (input) => { this.input = input; };
  }

  componentDidMount() {
    this.loadTagit();
  }

  loadTagit() {
    $(this.input).tagit(this.tagitProperties()).on('change', this.props.onChange);
  }

  tagitProperties() {
    return {
      availableTags: this.props.availableLabels,
      readOnly: this.props.disabled,
    };
  }

  render() {
    return (
      <input
        ref={this.saveInputRef}
        {...this.props.input}
      />
    );
  }
}

export default TaggedInput;
