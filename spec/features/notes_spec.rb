require 'feature_helper'

xdescribe 'Notes' do
  before(:each) do
    sign_in user
  end

  let(:user)    { create :user, email: 'user@example.com', password: 'password' }
  let(:project) { create(:project, name: 'Test Project', users: [user]) }

  let!(:story) do
    create :story,  title: 'Test Story',
                    state: 'started',
                    project: project,
                    requested_by: user
  end

  it 'adds a note to a story', js: true do
    visit project_path(project)

    within('#in_progress .story') do
      find('.story-title').click
      fill_in 'note', with: 'Adding a new note'
      click_on 'Add note'
    end

    wait_spinner
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

    wait_spinner
    expect(find('#in_progress .story')).not_to have_content('Delete me please')
  end
end
