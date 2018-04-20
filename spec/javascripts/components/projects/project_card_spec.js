/* eslint max-len:"off" */
/* eslint react/jsx-indent:"off" */
/* eslint jsx-a11y/anchor-is-valid:"off" */
import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow, mount } from 'enzyme';

import ProjectCard from 'components/projects/ProjectCard';
import User from 'models/user';
import Project from 'models/project';

const user = new User({ user: { id: 1 } });

function projectFactory(tag_name) {
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
    tag_name,
    tag_bg_color: '#2075F3',
    tag_fore_color: '#FFFFFF',
    users_avatar: ['https://secure.gravatar.com/avatar/foobar.png'],
  };
  return new Project(defaultObj);
}

const defaultProps = {
  project: projectFactory(),
  user,
  joined: true,
  key: 1,
};

const propsWithTag = {
  project: projectFactory('tag-foo'),
  user,
  joined: true,
  key: 1,
};

describe('<ProjectCard />', () => {
  beforeEach(jasmineEnzyme);

  describe('joined', () => {
    it('should have project, user and joined props', () => {
      const wrapper = mount(<ProjectCard {...defaultProps} />);
      expect(wrapper.props()).toEqual({ project: defaultProps.project, user: defaultProps.user, joined: true });
    });

    it('should contain the Project name', () => {
      const wrapper = shallow(<ProjectCard {...defaultProps} />);
      expect(wrapper.find('.card-title')).toHaveText('Foobar');
    });

    describe('#panelHeading', () => {
      describe('.icons', () => {
        it('should have report icon', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a
            href="/projects/foobar/reports"
            className="unstyled-link"
            data-toggle="tooltip"
            data-placement="top"
            data-title={I18n.t('reports')}
          >
            <i className="mi md-20 heading-icon">insert_chart</i>
                                  </a>)).toBe(true);
        });

        it('should have group icon', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a
            href="/projects/foobar/users"
            className="unstyled-link"
            data-toggle="tooltip"
            data-placement="top"
          >
            <i className="mi md-20 heading-icon">group</i>
                                  </a>)).toBe(true);
        });

        it('should have settings icon', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a className="unstyled-link" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="mi md-20 heading-icon">settings</i>
                                  </a>)).toBe(true);
        });
      });

      describe('.card-tag', () => {
        describe('When there is a tag', () => {
          const wrapper = mount(<ProjectCard {...propsWithTag} />);
          it('has the tag name', () => {
            expect(wrapper.find('.card-tag')).toHaveText(defaultProps.project.get('tag_name'));
          });
          it('has the background and foreground defined', () => {
            const card_style = wrapper.find('.card-tag').getNode();
            expect(card_style).toHaveCss({ 'background-color': 'rgb(32, 117, 243)', color: 'rgb(255, 255, 255)' });
          });
        });
        it('does not have the tag', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<small className="card-tag">{ defaultProps.project.get('tag_name') }</small>)).toBe(false);
        });
      });

      describe('.dropdown-menu', () => {
        it('should contain dropdown-menu', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.find('ul.dropdown-menu')).toHaveClassName('dropdown-menu');
        });

        it('should contain settings link', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a
            href="/projects/foobar/edit"
            data-toggle="tooltip"
            data-placement="top"
            data-title={I18n.t('settings')}
          >
            { I18n.t('settings') }
                                  </a>)).toBe(true);
        });

        it('should contain unjoin project link', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a href="/projects/foobar/users/1" data-method="delete">
            { I18n.t('projects.unjoin') }
                                  </a>)).toBe(true);
        });
      });
    });

    describe('#panelBody', () => {
      describe('not archived', () => {
        it('should contain velocity information', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="col-md-6 col-xs-6 counter">
            <span className="counter-description">{ I18n.t('velocity') }</span>
            <span className="counter-value">10</span>
                                  </div>)).toBe(true);
        });

        it('should contain volatility information', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="col-md-6 col-xs-6 counter">
            <span className="counter-description">{ I18n.t('volatility') }</span>
            <span className="counter-value">0%</span>
                                  </div>)).toBe(true);
        });

        it('should contain users avatar', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="col-md-12 members">
            <ul className="member-list">
              <li className="member"><img src="https://secure.gravatar.com/avatar/foobar.png" alt="User avatar" className="identicon" /></li>
            </ul>
                                  </div>)).toBe(true);
        });
      });

      describe('archived', () => {
        it('should not contain unable to join message', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="panel-body">
            <span className="col-md-12 text-center">{ I18n.t('projects.unable_to_join') }</span>
                                  </div>)).toBe(false);
        });
      });
    });

    describe('#cardLink', () => {
      describe('unarchived', () => {
        it('should contain SELECT PROJECT button', () => {
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a href="/projects/foobar" className="card-footer panel-footer">{ I18n.t('projects.select') }</a>)).toBe(true);
        });
      });

      describe('archived', () => {
        it('should contain ARCHIVED AT date', () => {
          defaultProps.project.set('archived_at', '2015/08/28 16:21:57 -0300');
          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<span className="card-footer panel-footer">{I18n.t('archived_at')} {'2015/08/28 16:21:57 -0300'}</span>)).toBe(true);
        });
      });
    });
  });

  describe('unjoined', () => {
    it('should have project, user and joined props', () => {
      defaultProps.joined = false;

      const wrapper = mount(<ProjectCard {...defaultProps} />);
      expect(wrapper.props()).toEqual({ project: defaultProps.project, user: defaultProps.user, joined: false });
    });

    it('should contain the Project name', () => {
      defaultProps.joined = false;

      const wrapper = shallow(<ProjectCard {...defaultProps} />);
      expect(wrapper.contains(<div className="panel-heading">
        <span href="/projects/foobar" className="card-title">Foobar</span>
                              </div>)).toBe(true);
    });

    describe('#panelHeading', () => {
      describe('.icons', () => {
        it('should not have report icon', () => {
          defaultProps.joined = false;

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a
            href="/projects/foobar/reports"
            className="unstyled-link"
            data-toggle="tooltip"
            data-placement="top"
            data-title={I18n.t('reports')}
          >
            <i className="mi md-20 heading-icon">insert_chart</i>
                                  </a>)).toBe(false);
        });
      });

      describe('.dropdown-menu', () => {
        it('should not contain dropdown-menu', () => {
          defaultProps.joined = false;

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.find('ul.dropdown-menu')).not.toHaveClassName('dropdown-menu');
        });
      });
    });

    describe('#panelBody', () => {
      describe('not archived', () => {
        it('should contain "to view more join" message', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', null);

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="panel-body">
            <span className="col-md-12 text-center">{ I18n.t('projects.to_view_more_join') }</span>
                                  </div>)).toBe(true);
        });
      });

      describe('archived', () => {
        it('should contain "unable to join" message', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', '9999/99/99 99:99:99 -9999');

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<div className="panel-body">
            <span className="col-md-12 text-center">{ I18n.t('projects.unable_to_join') }</span>
                                  </div>)).toBe(true);
        });
      });
    });

    describe('#cardLink', () => {
      describe('not archived', () => {
        it('should contain Join Project button', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', null);

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<a href="/projects/foobar/join" className="card-footer panel-footer">{ I18n.t('projects.join') }</a>)).toBe(true);
        });
      });

      describe('archived', () => {
        it('should contain ARCHIVED AT date', () => {
          defaultProps.joined = false;
          defaultProps.project.set('archived_at', '9999/99/99 99:99:99 -9999');

          const wrapper = shallow(<ProjectCard {...defaultProps} />);
          expect(wrapper.contains(<span className="card-footer panel-footer">{I18n.t('archived_at')} {'9999/99/99 99:99:99 -9999'}</span>)).toBe(true);
        });
      });
    });
  });
});
