import React from 'react';
import { render } from '@testing-library/react';

import ProjectCard from 'components/projects/ProjectCard';
import User from 'models/user';
import Project from 'models/project';
import { expect } from 'vitest';

const user = new User({ user: { id: 1 } });

const projectFactory = tag_name => {
  const defaultObj = {
    name: 'Foobar',
    slug: 'foobar',
    path_to: {
      project: '/projects/foobar',
      projectReports: '/projects/foobar/reports',
      projectUsers: '/projects/foobar/users',
      projectSettings: '/projects/foobar/edit',
      projectJoin: '/projects/foobar/join',
      projectUnjoin: '/projects/foobar/users/',
    },
    archived_at: null,
    velocity: '10',
    volatility: '0%',
    tag_name: tag_name,
    tag_bg_color: '#2075F3',
    tag_fore_color: '#FFFFFF',
    users_avatar: ['https://secure.gravatar.com/avatar/foobar.png'],
  };
  return new Project(defaultObj);
};

describe('<ProjectCard />', () => {
  let defaultProps;
  let propsWithTag;

  beforeEach(() => {
    defaultProps = {
      project: projectFactory(),
      user: user,
      joined: true,
      key: 1,
    };

    propsWithTag = {
      project: projectFactory('tag-foo'),
      user: user,
      joined: true,
      key: 1,
    };
  });

  describe('joined', () => {
    it('should contain the Project name', () => {
      const { getByText } = render(<ProjectCard {...defaultProps} />);
      expect(getByText('Foobar')).toBeInTheDocument();
    });

    describe('#panelHeading', () => {
      describe('.icons', () => {
        it('should have report icon', () => {
          const { getByTestId } = render(<ProjectCard {...defaultProps} />);
          expect(getByTestId('report-icon-anchor')).toBeInTheDocument();
        });

        it('should have group icon', () => {
          const { getByTestId } = render(<ProjectCard {...defaultProps} />);
          expect(getByTestId('user-icon-anchor')).toBeInTheDocument();
        });

        it('should have settings icon', () => {
          const { getByTestId } = render(<ProjectCard {...defaultProps} />);
          expect(getByTestId('settings-icon-anchor')).toBeInTheDocument();
        });
      });

      describe('.card-tag', () => {
        describe('When there is a tag', () => {
          it('has the tag name', () => {
            const { getByText } = render(<ProjectCard {...propsWithTag} />);

            expect(
              getByText(propsWithTag.project.get('tag_name'))
            ).toBeInTheDocument();
          });

          it('has the background and foreground defined', () => {
            const { getByTestId } = render(<ProjectCard {...propsWithTag} />);
            const component = getByTestId('project-card-tag');

            expect(component.style.backgroundColor).toBe('rgb(32, 117, 243)');
            expect(component.style.color).toBe('rgb(255, 255, 255)');
          });
        });

        it('does not have the tag', () => {
          propsWithTag.project.set('tag_name', null);
          const { queryByTestId } = render(<ProjectCard {...propsWithTag} />);

          expect(queryByTestId('project-card-tag')).not.toBeInTheDocument();
        });
      });

      describe('.dropdown-menu', () => {
        it('should contain dropdown-menu', () => {
          const { getByTestId } = render(<ProjectCard {...defaultProps} />);

          expect(getByTestId('dropdown-menu-container')).toHaveClass(
            'dropdown-menu'
          );
        });

        it('should contain settings link', () => {
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(getByText(I18n.t('settings'))).toBeInTheDocument();
        });

        it('should contain unjoin project link', () => {
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(getByText(I18n.t('projects.unjoin'))).toBeInTheDocument();
        });
      });
    });

    describe('#panelBody', () => {
      describe('not archived', () => {
        it('should contain users avatar', () => {
          const { getByTestId } = render(<ProjectCard {...defaultProps} />);

          expect(getByTestId('user-avatar')).toBeInTheDocument();
        });
      });

      describe('archived', () => {
        it('should not contain unable to join message', () => {
          const { queryByText } = render(<ProjectCard {...defaultProps} />);
          expect(
            queryByText(I18n.t('projects.unable_to_join'))
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('#cardLink', () => {
      describe('unarchived', () => {
        it('should contain SELECT PROJECT button', () => {
          const { getByText } = render(<ProjectCard {...defaultProps} />);
          expect(getByText(I18n.t('projects.select'))).toBeInTheDocument();
        });
      });

      describe('archived', () => {
        it('should contain ARCHIVED AT date', () => {
          defaultProps.project.set('archived_at', '2015/08/28 16:21:57 -0300');
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(
            getByText(`${I18n.t('archived_at')} 2015/08/28 16:21:57 -0300`)
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('unjoined', () => {
    it('should contain the Project name', () => {
      defaultProps.joined = false;

      const { getByText } = render(<ProjectCard {...defaultProps} />);
      expect(getByText('Foobar')).toBeInTheDocument();
    });

    describe('#panelHeading', () => {
      describe('.icons', () => {
        it('should not have report icon', () => {
          defaultProps.joined = false;
          const { queryByTestId } = render(<ProjectCard {...defaultProps} />);

          expect(queryByTestId('report-icon-anchor')).not.toBeInTheDocument();
        });
      });

      describe('.dropdown-menu', () => {
        it('should not contain dropdown-menu', () => {
          defaultProps.joined = false;
          const { queryByTestId } = render(<ProjectCard {...defaultProps} />);

          expect(
            queryByTestId('dropdown-menu-container')
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('#panelBody', () => {
      describe('not archived', () => {
        it('should contain "to view more join" message', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', null);
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(
            getByText(I18n.t('projects.to_view_more_join'))
          ).toBeInTheDocument();
        });
      });

      describe('archived', () => {
        it('should contain "unable to join" message', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', '9999/99/99 99:99:99 -9999');
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(
            getByText(I18n.t('projects.unable_to_join'))
          ).toBeInTheDocument();
        });
      });
    });

    describe('#cardLink', () => {
      describe('not archived', () => {
        it('should contain Join Project button', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', null);
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(getByText(I18n.t('projects.join'))).toBeInTheDocument();
        });
      });

      describe('archived', () => {
        it('should contain ARCHIVED AT date', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', '9999/99/99 99:99:99 -9999');
          const { getByText } = render(<ProjectCard {...defaultProps} />);

          expect(
            getByText(`${I18n.t('archived_at')} 9999/99/99 99:99:99 -9999`)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
