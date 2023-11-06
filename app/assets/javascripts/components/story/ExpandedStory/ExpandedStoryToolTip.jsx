import React from 'react';
import Popover from 'components/jquery_wrappers/Popover';

const ExpandedStoryToolTip = ({ text }) => (
  <Popover
    delay={100}
    trigger="hover"
    title=""
    renderContent={({ ref }) => <div ref={ref}>{text}</div>}
  >
    {({ ref }) => (
      <div ref={ref}>
        <div className="infoToolTip">
          <i className="mi md-18">info_outline</i>
        </div>
      </div>
    )}
  </Popover>
);

export default ExpandedStoryToolTip;
