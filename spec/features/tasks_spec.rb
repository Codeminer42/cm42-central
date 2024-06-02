require 'feature_helper'

xdescribe 'Tasks' do
  before(:each) do
    sign_in user
  end

  let(:user)      { create(:user) }
  let(:project)   { create(:project, enable_tasks: true, users: [user]) }
  let!(:story)    { create(:story, project: project, requested_by: user) }

  describe 'full story life cycle' do
    it 'adds a task to a story', js: true do
      visit project_path(project)

      within('#todo .story') do
        find('.story-title').click
        fill_in 'task', with: 'Adding a new task'
        click_on 'Add task'
      end

      task_element = find('#todo .story .tasklist .task')
      expect(task_element).to have_content('Adding a new task')
    end

    it 'deletes a task from a story', js: true do
      create(:task, story: story, name: 'Delete me please')

      visit project_path(project)

      within('#todo .story') do
        find('.story-title').click
        within('.tasklist') do
          find('.delete-btn').click
        end
      end

      expect(find('#todo .story')).not_to have_content('Delete me please')
    end
  end

  describe 'on a disabled story' do
    it 'does not render a form', js: true do
      create(:story, state: 'accepted', project: project, requested_by: user)

      visit project_path(project)

      within('#todo .story.accepted') do
        find('.story-title').click
      end

      expect(page).not_to have_css('.task_form ')
    end
  end
end
