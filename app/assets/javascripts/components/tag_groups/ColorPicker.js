/* eslint jsx-a11y/click-events-have-key-events:"off" */
/* eslint jsx-a11y/no-static-element-interactions:"off" */
/* eslint react/jsx-closing-tag-location:"off" */
/* eslint react/prop-types:"off" */
import React from 'react';
import { TwitterPicker } from 'react-color';

export default class ColorPick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.props.color,
    };

    this.handleClick = this.handleClick.bind(this);

    this.handleClose = this.handleClose.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleChange(color) {
    this.setState({ color: color.hex });
  }

  render() {
    return (
      <div>
        <div onClick={this.handleClick} className="swatch">
          <div style={{ backgroundColor: this.state.color }} className="color-box" />
          <input type="hidden" value={this.state.color} name="tag_group[bg_color]" />
        </div>
        { this.state.displayColorPicker && <div className="color-box-popover">
          <div className="color-box-cover" onClick={this.handleClose} />
          <TwitterPicker color={this.state.color} onChange={this.handleChange} />
        </div> }
      </div>
    );
  }
}

