import React from 'react';

class TaggedInput extends React.Component {
  componentDidMount() {
    this.loadTagit();
  }

  loadTagit() {
    $(this.input).tagit(
      this.tagitProperties()
    ).on('change', this.props.onChange);
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
        ref={ input => { this.input = input } }
        { ...this.props.input }
      />
    );
  }
}

export default TaggedInput;
