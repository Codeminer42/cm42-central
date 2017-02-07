import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow, mount } from 'enzyme';

import ProjectSearch from 'components/projects/ProjectSearch';
import ProjectList from 'components/projects/ProjectList';
import ProjectCard from 'components/projects/ProjectCard';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';

const data = {
  projects: [{
    "name": "Foobar",
    "slug": "foobar",
    "pathTo": {},
    "archived_at": null,
    "velocity": 10,
    "volatility": "0%",
    "users_avatar": ["https://secure.gravatar.com/avatar/foobar.png"]
  }],
  user: {
    "user": {
      "id": 1,
      "email": "foo@bar.com",
      "name": "Foo Bar",
      "initials": "fb",
      "username": "foobar"
    }
  }
};

const defaultProps = {
  projects: {
    joined: new ProjectCollection(data.projects),
    unjoined: new ProjectCollection(data.projects)
  },
  user: new User(data.user)
}

describe('<ProjectSearch />', () => {
  beforeEach(() => {
    jasmineEnzyme();
  });

  it('renders two <ProjectList /> components', () => {
    const wrapper = shallow(<ProjectSearch {...defaultProps} />);

    expect(wrapper.contains([
      <ProjectList
        title={ I18n.t('projects.mine') }
        projects={ defaultProps.projects.joined }
        user={ defaultProps.user }
        joined={ true } key="1"
      />,
      <ProjectList
        title={ I18n.t('projects.not_member_of') }
        projects={ defaultProps.projects.unjoined }
        user={ defaultProps.user }
        joined={ false } key="2"
      />
    ])).toBe(true);
  });

  it('should have projects and user props', () => {
    const wrapper = mount(<ProjectSearch {...defaultProps} />);
    expect(wrapper.props()).toEqual({projects: defaultProps.projects, user: defaultProps.user});
  });
});
