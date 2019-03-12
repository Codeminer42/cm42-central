import React from 'react';
import { shallow, mount } from 'enzyme';
import ProjectList from 'components/projects/ProjectList';
import ProjectCard from 'components/projects/ProjectCard';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';

describe('<ProjectList />', () => {
  var user, defaultProps;

  beforeEach(() => {
    user = new User({
      "user": {
        "id": 1,
        "email": "foo@bar.com",
        "name": "Foo Bar",
        "initials": "fb",
        "username": "foobar"
      }
    });

    defaultProps = {
      title: I18n.t('projects.mine'),
      projects: new ProjectCollection(),
      user: user,
      joined: true,
      key: 1
    };
  });

  describe('joined', () => {
    describe('with projects', () => {
      beforeEach(() => {
        defaultProps.projects.reset([{
          "name": "Foo",
          "slug": "foo",
          "path_to": {},
          "archived_at": "2015/08/28 16:21:57 -0300",
          "velocity": 10,
          "volatility": "0%",
          "users_avatar": ["https://secure.gravatar.com/avatar/foo.png"]
        },{
          "name": "Bar",
          "slug": "bar",
          "path_to": {},
          "archived_at": "2015/08/28 16:21:57 -0300",
          "velocity": 10,
          "volatility": "0%",
          "users_avatar": ["https://secure.gravatar.com/avatar/bar.png"]
        }]);
      });

      it('renders <ProjectCard /> components', () => {
        const wrapper = shallow(<ProjectList {...defaultProps} />);
        expect(wrapper.contains([
          <ProjectCard project={defaultProps.projects.at(0)} user={user} joined={true} />,
          <ProjectCard project={defaultProps.projects.at(1)} user={user} joined={true} />
        ])).toBe(true);
      });

      it('Title should be present', () => {
        const wrapper = shallow(<ProjectList {...defaultProps} />);
        expect(wrapper.contains(
          <div className="col-md-12 project-list-title">
            <h4><i className="mi md-20 heading-icon">view_module</i> { I18n.t('projects.mine') } | { 2 }</h4>
          </div>
        )).toBe(true);
      });
    });

    describe('without projects', () => {
      it('Title should be present', () => {
        const wrapper = shallow(<ProjectList {...defaultProps} />);
        expect(wrapper.contains(
          <div className="col-md-12 project-list-title">
            <h4><i className="mi md-20 heading-icon">view_module</i> {I18n.t('projects.mine')} | {0}</h4>
          </div>
        )).toBe(true);
      });
    });
  });

  describe('unjoined', () => {
    describe('with projects', () => {
      beforeEach(() => {
        defaultProps.title = I18n.t('projects.member_of'),
        defaultProps.joined = false;
        defaultProps.projects.reset([{
          "id": 1,
          "name": "Foobar",
          "slug": "foobar",
          "path_to": {},
          "archived_at": "2015/08/28 16:21:57 -0300",
          "velocity": 10,
          "volatility": "0%",
          "users_avatar": ["https://secure.gravatar.com/avatar/foobar.png"]
        }]);
      });

      it('render <ProjectCard /> components', () => {
        const wrapper = shallow(<ProjectList {...defaultProps} />);
        expect(wrapper.contains([
          <ProjectCard key={1} project={defaultProps.projects.at(0)} user={user} joined={false} />
        ])).toBe(true);
      });
    });
    describe('without projects', () => {
      it('Title should be present', () => {
        const wrapper = shallow(<ProjectList {...defaultProps} />);
        expect(wrapper.contains(
          <div className="col-md-12 project-list-title">
            <h4><i className="mi md-20 heading-icon">view_module</i> {I18n.t('projects.mine')} | {0}</h4>
          </div>
        )).toBe(true);
      });
    });
  });
});
