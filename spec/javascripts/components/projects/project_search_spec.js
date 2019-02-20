import React from 'react';
import { shallow, mount } from 'enzyme';

import ProjectSearch from 'components/projects/ProjectSearch';
import ProjectList from 'components/projects/ProjectList';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';

describe('<ProjectSearch />', () => {
  var defaultProps, projects, user, handleSearch;

  beforeEach(() => {
    user = {
      "user": {
        "id": 1,
        "email": "foo@bar.com",
        "name": "Foo Bar",
        "initials": "fb",
        "username": "foobar"
      }
    };

    projects = [{
      "name": "Foobar",
      "slug": "foobar",
      "path_to": {},
      "archived_at": null,
      "velocity": 10,
      "volatility": "0%",
      "users_avatar": ["https://secure.gravatar.com/avatar/foobar.png"]
    }];

    defaultProps = {
      projects: {
        joined: new ProjectCollection(projects),
        unjoined: new ProjectCollection(projects)
      },
      user: new User(user)
    }
  });

  it('renders two <ProjectList /> components', () => {
    const wrapper = shallow(<ProjectSearch {...defaultProps} />);
    expect(wrapper.contains([
      <ProjectList
        title={I18n.t('projects.mine')}
        projects={defaultProps.projects.joined}
        user={defaultProps.user}
        joined={true}
      />,
      <ProjectList
        title={I18n.t('projects.not_member_of')}
        projects={defaultProps.projects.unjoined}
        user={defaultProps.user}
        joined={false}
      />
    ])).toBe(true);
  });

  it('should select options', () => {
    const wrapper = mount(<ProjectSearch {...defaultProps} />);
    expect(wrapper.contains([
      <option key={'not_archived'} value={'not_archived'}>{I18n.t('not_archived')}</option>,
      <option key={'archived'} value={'archived'}>{I18n.t('archived')}</option>,
      <option key={'all_projects'} value={'all_projects'}>{I18n.t('all_projects')}</option>
    ])).toBe(true);
  });

  it('should change the visibleProjects state', () => {
    const wrapper = mount(<ProjectSearch {...defaultProps} />);
    const select = wrapper.find('select');

    select.getDOMNode().value = 'all_projects';
    select.simulate('change');

    expect(wrapper.state('visibleProjects').joined.projects.length).toBe(1);

    select.getDOMNode().value = 'archived';
    select.simulate('change');

    expect(wrapper.state('visibleProjects').joined.projects.length).toBe(0);

    select.getDOMNode().value = 'not_archived';
    select.simulate('change');

    expect(wrapper.state('visibleProjects').joined.projects.length).toBe(1);
  });
});
