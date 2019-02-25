require 'feature_helper'

describe 'Notes' do
  before(:each) do
    # FIXME: - Having to set this really high for the 'adds a note to a story
    # spec'.  Need to work on making it more responsive.
    Capybara.default_max_wait_time = 10
    sign_in user
  end

  let(:user)    { create :user, :with_team, email: 'user@example.com', password: 'password' }
  let(:project) { create(:project, name: 'Test Project', users: [user], teams: [user.teams.first]) }

  let!(:story) do
    create :story,  title: 'Test Story',
                    state: 'started',
                    project: project,
                    requested_by: user
  end

  describe 'full story life cycle' do
    it 'adds a note to a story', js: true do
      visit project_path(project)

      within('#in_progress .story') do
        find('.story-title').click
        fill_in 'note', with: 'Adding a new note'
        click_on 'Add note'
      end

      wait_for_ajax
      expect(find('#in_progress .story .notelist .note')).to have_content('Adding a new note')
    end

    it 'deletes a note from a story', js: true do
      create :note, user: user,
                    story: story,
                    note: 'Delete me please'

      visit project_path(project)

      within('#in_progress .story') do
        find('.story-title').click
        within('.notelist') do
          find('.delete-btn').click
        end
      end

      wait_for_ajax
      expect(find('#in_progress .story')).not_to have_content('Delete me please')
    end
  end

  describe 'on a disabled story' do
    it 'does not render a form', js: true do
      create :story, state: 'accepted', project: project, requested_by: user
      visit project_path(project)

      within('#in_progress .story.accepted') do
        find('.story-title').click
      end

      expect(page).not_to have_css('.note_form ')
    end
  end
end
