import React from 'react';
import {
  fireEvent,
  getAllByTestId,
  render,
  waitFor,
} from '@testing-library/react';

import ProjectSearch from 'components/projects/ProjectSearch';
import ProjectList from 'components/projects/ProjectList';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';

describe('<ProjectSearch />', () => {
  var defaultProps, projects, user, handleSearch;

  beforeEach(() => {
    user = {
      user: {
        id: 1,
        email: 'foo@bar.com',
        name: 'Foo Bar',
        initials: 'fb',
        username: 'foobar',
      },
    };

    projects = [
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

    defaultProps = {
      projects: {
        joined: new ProjectCollection(projects),
        unjoined: new ProjectCollection(projects),
      },
      user: new User(user),
    };
  });

  it('renders two <ProjectList /> components', async () => {
    const { getByText } = render(<ProjectSearch {...defaultProps} />);

    expect(getByText(`${I18n.t('projects.mine')} | 1`)).toBeInTheDocument();
    expect(
      getByText(`${I18n.t('projects.not_member_of')} | 1`)
    ).toBeInTheDocument();
  });

  it('should select options', () => {
    const { getByText } = render(<ProjectSearch {...defaultProps} />);

    expect(getByText(I18n.t('not_archived'))).toBeInTheDocument();
    expect(getByText(I18n.t('archived'))).toBeInTheDocument();
    expect(getByText(I18n.t('all_projects'))).toBeInTheDocument();
  });

  it('should change the visibleProjects state', async () => {
    let visibleProjects;
    const { getByTestId, queryAllByTestId } = render(
      <ProjectSearch {...defaultProps} />
    );
    const select = getByTestId('select-project-filter');

    visibleProjects = queryAllByTestId('view-module-title');
    expect(visibleProjects.length).toBe(2);

    fireEvent.change(select, { target: { value: 'all_projects' } });

    visibleProjects = queryAllByTestId('view-module-title');
    expect(visibleProjects.length).toBe(2);

    fireEvent.change(select, { target: { value: 'archived' } });

    visibleProjects = queryAllByTestId('view-module-title');
    expect(visibleProjects.length).toBe(0);

    fireEvent.change(select, { target: { value: 'not_archived' } });

    visibleProjects = queryAllByTestId('view-module-title');
    expect(visibleProjects.length).toBe(2);
  });
});
