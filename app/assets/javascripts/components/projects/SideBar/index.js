import React from 'react';
import SideBarButton from './SideBarButton';
import PropTypes from 'prop-types';
import SideBarButtonShape from '../../shapes/sideBarButton';
import classname from 'classnames';

const SideBar = ({
  buttons
}) =>
  <div className="SideBar">
    <ul>
      {
        buttons.map(button => {
            const iconStyle = classname(
              'SideBar__icon',
              {
                'SideBar__icon--is-visible': button.isVisible
              },
              button.icon
            );

            return (
              <SideBarButton
                key={button['data-id']}
                {...button}
              >
                <i className={iconStyle}></i>
              </SideBarButton>
            )
          }
        )
      }
    </ul>
  </div>

SideBar.propTypes = {
  buttons: PropTypes.arrayOf(SideBarButtonShape).isRequired
}

export default SideBar;
