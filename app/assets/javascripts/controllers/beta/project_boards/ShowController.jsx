import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ProjectBoard from 'components/projects/ProjectBoard';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import store from 'store';

export default () => {
  const appElement = document.querySelector('[data-app]');
  const { projectId } = appElement.dataset;
  const root = createRoot(appElement);

  root.render(
    <Provider store={store}>
      <PrimeReactProvider>
        <ProjectBoard projectId={projectId} />
      </PrimeReactProvider>
    </Provider>
  );
};
