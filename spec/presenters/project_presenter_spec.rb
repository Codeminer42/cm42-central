require 'rails_helper'

describe ProjectPresenter do
  let(:user) { create :user, email: 'foobar@example.com' }

  before { create :project, name: 'Test Project Foobar', users: [user] }

  let(:projects) { ProjectPresenter.from_collection(Project.all) }
  let(:project) { projects.first }

  describe '#truncate_name' do
    it { expect(project.truncate_name.length).to eq(18) }
  end

  describe '#velocity' do
    it { expect(project.velocity).to eq(10) }
  end

  describe '#volatility' do
    it { expect(project.volatility).to eq('0%') }
  end

  describe '#users_avatar' do
    it 'should return the right users avatar' do
      expect(project.users_avatar(4)).to eq(
        ['https://secure.gravatar.com/avatar/0d4907cea9d97688aa7a5e722d742f71.png?d=identicon&r=PG']
      )
    end
  end

  describe '#archived_at' do
    it 'should render a formated date' do
      project.archived_at = '2000-01-01 00:00:00'
      expect(project.archived_date).to eq('Jan 01, 2000')
    end
  end

  describe '#path_to' do
    it 'should return all paths' do
      expect(project.path_to).to eq(project: '/projects/test-project-foobar',
                                    projectReports: '/projects/test-project-foobar/reports',
                                    projectUsers: '/projects/test-project-foobar/users',
                                    projectSettings: '/projects/test-project-foobar/edit',
                                    projectJoin: '/projects/test-project-foobar/join',
                                    projectUnjoin: '/projects/test-project-foobar/users/')
    end
  end
end
