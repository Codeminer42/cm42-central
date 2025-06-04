import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ProjectBoard from 'components/projects/ProjectBoard';
import store from 'store';

export default () => {
  const appElement = document.querySelector('[data-app]');
  const { projectId } = appElement.dataset;

  const container = document.querySelector('[data-app]');
  const showControllerRoot = createRoot(container);

  showControllerRoot.render(
    <Provider store={store}>
      <ProjectBoard projectId={projectId} />
    </Provider>
  );
};
