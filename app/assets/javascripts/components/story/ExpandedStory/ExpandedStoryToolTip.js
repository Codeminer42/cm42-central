import React from 'react';
import Popover from 'components/jquery_wrappers/Popover.js';

const ExpandedStoryToolTip = ({ text, children }) => (

  <Popover
    delay={100}
    trigger="hover"
    title=""
    renderContent={({ ref }) => (
      <div ref={ref}>
       {text}
      </div>
    )}
  >
    {
      ({ ref }) => (
        <div ref={ref}>
          { children }
        </div>
      )
    }
  </Popover>
);

export default ExpandedStoryToolTip;
