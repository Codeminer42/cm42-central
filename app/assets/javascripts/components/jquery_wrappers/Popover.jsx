import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Popover = ({ title, trigger, delay = 0, children, renderContent }) => {
  const childRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (childRef.current) {
      $(childRef.current).popover({
        delay,
        trigger,
        title,
        html: true,
        content: contentRef.current,
      });
    }

    return () => {
      if (childRef.current) {
        $(childRef.current).popover('destroy');
      }
    };
  }, [delay, trigger, title]);

  return (
    <>
      <div data-testid="story-popover-children">
        {children({ ref: childRef })}
      </div>
      <div style={{ display: 'none' }}>
        {renderContent({ ref: contentRef })}
      </div>
    </>
  );
};

Popover.propTypes = {
  title: PropTypes.string.isRequired,
  trigger: PropTypes.string.isRequired,
  delay: PropTypes.number,
  children: PropTypes.func.isRequired,
  renderContent: PropTypes.func.isRequired,
};

export default Popover;
