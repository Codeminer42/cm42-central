import React, { useState } from 'react';
import { TwitterPicker } from 'react-color';

const ColorPick = ({ color: initialColor }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(initialColor);

  const handleClick = () =>
    setDisplayColorPicker(oldDisplayColorPicker => !oldDisplayColorPicker);
  const handleClose = () => setDisplayColorPicker(false);
  const handleChange = color => setColor(color.hex);

  return (
    <>
      <div onClick={handleClick} className="swatch">
        <div style={{ backgroundColor: color }} className="color-box" />
        <input type="hidden" value={color} name="tag_group[bg_color]" />
      </div>
      {displayColorPicker && (
        <div className="color-box-popover">
          <div className="color-box-cover" onClick={handleClose} />
          <TwitterPicker color={color} onChange={handleChange} />
        </div>
      )}
    </>
  );
};

export default ColorPick;
