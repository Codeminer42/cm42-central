import React from 'react';
import Column from './ColumnItem';
import Stories from "../stories/Stories";
import Sprints from "../stories/Sprints";

const NormalColumns = ({
  chillyBin,
  backlog,
  done
}) =>
  <span className="Columns">
    <Column title={chillyBin.title}
      renderAction={chillyBin.renderAction}
    >
      <Stories stories={chillyBin.stories} />
    </Column>

    <Column
      title={backlog.title}
      renderAction={backlog.renderAction}
    >
      <Sprints
        sprints={backlog.sprints}
      />
    </Column>

    <Column
      title={done.title}
    >
      <Sprints
        sprints={done.sprints}
        fetchStories={done.fetchStories}
      />
    </Column>
  </span>

export default NormalColumns;
