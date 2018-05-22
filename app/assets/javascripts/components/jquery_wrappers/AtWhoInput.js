import React from 'react';

class AtWhoInput extends React.Component {
  constructor(props) {
    super(props);
    this.saveTextareaRef = (textarea) => { this.textarea = textarea };
  }

  componentDidMount() {
    this.loadAtWho();
  }

  componentWillUnmount() {
    this.unloadAtWho();
  }

  loadAtWho() {
    $(this.textarea).atwho({
      at: "@",
      data: this.props.usernames
    }).on('inserted.atwho', this.props.onChange);
  }

  unloadAtWho() {
    $(this.textarea).atwho('destroy');
  }

  render() {
    return (
      <textarea
        ref={ this.saveTextareaRef }
        name={this.props.name}
        className={`form-control ${this.props.name}-textarea`}
        defaultValue={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

export default AtWhoInput;
