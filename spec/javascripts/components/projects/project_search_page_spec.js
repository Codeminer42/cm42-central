import React from 'react';
import { render } from '@testing-library/react';

import ProjectSearchPage from 'components/projects/ProjectSearchPage';

describe('<ProjectSearchPage />', () => {
  const currentUser = {
    id: 1,
    email: 'foo@bar.com',
    name: 'Foo Bar',
    initials: 'fb',
    username: 'foobar',
  };

  const projects = [
    {
      name: 'Foobar',
      slug: 'foobar',
      path_to: {},
      archived_at: null,
      velocity: 10,
      volatility: '0%',
      users_avatar: ['https://secure.gravatar.com/avatar/foobar.png'],
    },
  ];

  it('renders the existing project search component from plain Rails props', () => {
    const { getByText } = render(
      <ProjectSearchPage
        currentUser={currentUser}
        projectsJoined={projects}
        projectsUnjoined={projects}
      />
    );

    expect(getByText(`${I18n.t('projects.mine')} | 1`)).toBeInTheDocument();
    expect(
      getByText(`${I18n.t('projects.not_member_of')} | 1`)
    ).toBeInTheDocument();
  });
});
