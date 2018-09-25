import React from "react";
import Stories from "../stories/Stories";

const Column = ({ title, children }) => (
  <div className="Column">
    <div className="Column__header">
      <h3 className="Column__name">{title}</h3>
      <button type="button" className="Column__btn-close">
        x
      </button>
    </div>
    <div className="Column__body">{children}</div>
  </div>
);

export default Column;
