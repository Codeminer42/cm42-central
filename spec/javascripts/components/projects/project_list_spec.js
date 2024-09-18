import React from 'react';
import { render } from '@testing-library/react';
import ProjectList from 'components/projects/ProjectList';
import ProjectCard from 'components/projects/ProjectCard';
import ProjectCollection from 'collections/project_collection';
import User from 'models/user';

describe('<ProjectList />', () => {
  var user, defaultProps;

  beforeEach(() => {
    user = new User({
      user: {
        id: 1,
        email: 'foo@bar.com',
        name: 'Foo Bar',
        initials: 'fb',
        username: 'foobar',
      },
    });

    defaultProps = {
      title: I18n.t('projects.mine'),
      projects: new ProjectCollection(),
      user: user,
      joined: true,
      key: 1,
    };
  });

  describe('joined', () => {
    describe('with projects', () => {
      beforeEach(() => {
        defaultProps.projects.reset([
          {
            name: 'Foo',
            slug: 'foo',
            path_to: {},
            archived_at: '2015/08/28 16:21:57 -0300',
            velocity: 10,
            volatility: '0%',
            users_avatar: ['https://secure.gravatar.com/avatar/foo.png'],
          },
          {
            name: 'Bar',
            slug: 'bar',
            path_to: {},
            archived_at: '2015/08/28 16:21:57 -0300',
            velocity: 10,
            volatility: '0%',
            users_avatar: ['https://secure.gravatar.com/avatar/bar.png'],
          },
        ]);
      });

      it('renders <ProjectCard /> components', () => {
        const { getByText } = render(<ProjectList {...defaultProps} />);

        expect(
          getByText(defaultProps.projects.models[0].get('name'))
        ).toBeInTheDocument();
        expect(
          getByText(defaultProps.projects.models[1].get('name'))
        ).toBeInTheDocument();
      });

      it('Title should be present', async () => {
        const { getByText } = render(<ProjectList {...defaultProps} />);

        expect(getByText(`${I18n.t('projects.mine')} | 2`)).toBeInTheDocument();
      });
    });

    describe('without projects', () => {
      it('Title should be present', () => {
        const { getByText } = render(<ProjectList {...defaultProps} />);

        expect(getByText(`${I18n.t('projects.mine')} | 0`)).toBeInTheDocument();
      });
    });
  });

  describe('unjoined', () => {
    describe('with projects', () => {
      beforeEach(() => {
        (defaultProps.title = I18n.t('projects.member_of')),
          (defaultProps.joined = false);
        defaultProps.projects.reset([
          {
            id: 1,
            name: 'Foobar',
            slug: 'foobar',
            path_to: {},
            archived_at: '2015/08/28 16:21:57 -0300',
            velocity: 10,
            volatility: '0%',
            users_avatar: ['https://secure.gravatar.com/avatar/foobar.png'],
          },
        ]);
      });

      it('render <ProjectCard /> components', () => {
        const { getByText } = render(<ProjectList {...defaultProps} />);

        expect(
          getByText(defaultProps.projects.models[0].get('name'))
        ).toBeInTheDocument();
      });
    });
    describe('without projects', () => {
      it('Title should be present', () => {
        const { getByText } = render(<ProjectList {...defaultProps} />);
        expect(getByText(`${I18n.t('projects.mine')} | 0`)).toBeInTheDocument();
      });
    });
  });
});
