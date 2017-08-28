import React from 'react';

class AsyncForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(ev) {
    ev.preventDefault();
    this.setState({ loading: true });
    this.props
      .onSubmit(this.props.getFormData())
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    return this.props.children({
      loading: this.state.loading,
      handleSubmit: this._handleSubmit
    });
  }
}

export default AsyncForm;
