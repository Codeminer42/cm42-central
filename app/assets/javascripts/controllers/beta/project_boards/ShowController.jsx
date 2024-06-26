import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ProjectBoard from 'components/projects/ProjectBoard';
import store from 'store';

export default () => {
  const appElement = document.querySelector('[data-app]');
  const { projectId } = appElement.dataset;

  render(
    <Provider store={store}>
      <ProjectBoard projectId={projectId} />
    </Provider>,
    appElement
  );
};
