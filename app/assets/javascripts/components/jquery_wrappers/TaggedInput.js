import React from 'react';

class TaggedInput extends React.Component {
  constructor(props) {
    super(props);
    this.saveInputRef = (input) => { this.input = input };
  }

  componentDidMount() {
    this.loadTagit();
  }

  componentWillUnmount() {
    this.unloadTagit();
  }

  loadTagit() {
    $(this.input).tagit(
      this.tagitProperties()
    ).on('change', this.props.onChange);
  }

  unloadTagit() {
    $(this.input).tagit('removeAll');
  }

  tagitProperties() {
    return {
      availableTags: this.props.availableLabels,
      readOnly: this.props.disabled,
      singleField: true,
    };
  }

  render() {
    return (
      <input
        ref={ this.saveInputRef }
        { ...this.props.input }
      />
    );
  }
}

export default TaggedInput;
