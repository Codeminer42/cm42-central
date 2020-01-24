import React from "react";
import SideBarButton from "./SideBarButton";
import PropTypes from "prop-types";
import classname from "classnames";

const SideBar = ({ reverse, visibleColumns, toggleColumn, reverseColumns }) => {
  const buttons = [
    {
      description: I18n.t("revert_columns_tooltip"),
      onClick: reverseColumns,
      "data-id": "reverse-button",
      isVisible: reverse,
      icon: "fas fa-columns"
    },
    {
      description: I18n.t("toggle_column", { column: "chilly bin" }),
      onClick: () => toggleColumn("chillyBin"),
      "data-id": "toggle-chilly-bin",
      isVisible: visibleColumns.chillyBin,
      icon: "fas fa-snowflake"
    },
    {
      description: I18n.t("toggle_column", { column: "backlog" }),
      onClick: () => toggleColumn("backlog"),
      "data-id": "toggle-backlog",
      isVisible: visibleColumns.backlog,
      icon: "fas fa-th-list"
    },
    {
      description: I18n.t("toggle_column", { column: "done" }),
      onClick: () => toggleColumn("done"),
      "data-id": "toggle-done",
      isVisible: visibleColumns.done,
      icon: "fas fa-check-circle"
    }
  ];

  return (
    <div className="SideBar">
      <ul>
        {
          buttons.map(button => {
            const iconStyle = classname(
              "SideBar__icon",
              {
                "SideBar__icon--is-visible": button.isVisible
              },
              button.icon
            );

            return (
              <SideBarButton key={button["data-id"]} {...button}>
                <i className={iconStyle}></i>
              </SideBarButton>
            );
          })
        }
      </ul>
    </div>
  );
};

SideBar.propTypes = {
  reverse: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  reverseColumns: PropTypes.func.isRequired
};

export default SideBar;
