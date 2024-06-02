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

  it 'adds a comment to a story', js: true do
    visit project_path(project)

    within('#todo .story') do
      find('.story-title').click
      fill_in 'comment', with: 'Adding a new comment'
      click_on 'Add comment'
    end

    wait_spinner
    expect(find('#todo .story .commentlist .comment')).to have_content('Adding a new comment')
  end

  it 'deletes a comment from a story', js: true do
    create :comment, user: user, story: story, body: 'Delete me please'

    visit project_path(project)

    within('#todo .story') do
      find('.story-title').click
      within('.commentlist') do
        find('.delete-btn').click
      end
    end

    wait_spinner
    expect(find('#todo .story')).not_to have_content('Delete me please')
  end
end
