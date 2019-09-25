require 'feature_helper'

describe 'Stories' do
  before(:each) do
    sign_in user
  end

  let(:user) { create :user, :with_team, email: 'user@example.com', password: 'password' }
  let!(:project) do
    create(:project, name: 'Test Project', users: [user], teams: [user.teams.first])
  end

  describe 'full story life cycle' do
    context 'when the user is guest' do
      let!(:story) do
        create(:story, title: 'Test Story', project: project, requested_by: user, estimate: 2)
      end

      before do
        user.update_column(:role, 'guest')
        visit project_path(project)
        wait_spinner
        wait_page_load
      end

      it 'cannot see the add story button', js: true do
        expect(page).to_not have_button 'Add story'
      end

      it 'attributes are disabled', js: true do
        expect(page).to have_button('start', disabled: true)

        find('.story-title').click
        expect(page).to have_field('title', with: story.title, disabled: true)
        expect(page).to have_select('story_type', selected: 'feature', disabled: true)
        expect(page).to have_button('Save', disabled: true)
        expect(page).to have_button('Delete', disabled: true)
        expect(page).to have_button('Cancel', disabled: false)
      end
    end

    context 'when the user save a story' do
      let!(:story) { create(:story, title: 'Story', project: project, requested_by: user) }

      before do
        visit project_path(project)
        wait_spinner
        wait_page_load
      end

      it 'highlights story on click to save', js: true do
        story_element(story).click
        expect(story_element(story)).to match_css('.editing')
        click_on 'Save'
        expect(page).not_to have_css('.editing')
        expect(story_element(story)[:style]).to match(/background-color/)
      end
    end

    context 'when the user drags a story' do
      let!(:story) { create(:story, title: 'Story', project: project, requested_by: user) }

      before do
        visit project_path(project)
        wait_spinner
        wait_page_load
      end

      it 'drags a story to other column with the mouse in card', js: true do
        source = story_element(story)
        source.drag_to(chilly_bin_column)

        expect(chilly_bin_column).to have_css("div#{story_selector(story)}")
        expect(in_progress_column).not_to have_css("div#{story_selector(story)}")
      end


      it 'drags a story to other column with the mouse in estimates items', js: true do
        source = story_element(story).find('.estimates')
        source.drag_to(chilly_bin_column)

        expect(chilly_bin_column).to have_css("div#{story_selector(story)}")
        expect(in_progress_column).not_to have_css("div#{story_selector(story)}")
      end


      it 'drags a story to other column with the mouse in story icons', js: true do
        source = story_element(story).find('.story-icons')
        source.drag_to(chilly_bin_column)

        expect(chilly_bin_column).to have_css("div#{story_selector(story)}")
        expect(in_progress_column).not_to have_css("div#{story_selector(story)}")
      end


      it 'drags a story to other column with the mouse in story title', js: true do
        source = story_element(story).find('.story-title')
        source.drag_to(chilly_bin_column)

        expect(chilly_bin_column).to have_css("div#{story_selector(story)}")
        expect(in_progress_column).not_to have_css("div#{story_selector(story)}")
      end
    end

    it 'steps through the full story life cycle', js: true do
      visit project_path(project)
      wait_spinner

      wait_page_load
      click_on 'Add story'

      within(chilly_bin_column) do
        fill_in 'title', with: 'New story'
        click_on 'Save'
      end

      # Estimate the story
      within(chilly_bin_column.find('.story')) do
        find('#estimate-1').click
      end

      within(in_progress_column.find('.story')) do
        click_on 'start'
      end

      sleep 0.5
      within('#in_progress .story') do
        click_on 'finish'
        sleep 0.5
        click_on 'deliver'
        sleep 0.5
        accept_confirm do
          click_on 'accept'
        end
      end

      expect(find('#in_progress .story.accepted .story-title')).to have_content('New story')
    end
  end

  describe 'story history' do
    before do
      create(:story, title: 'Test Story', project: project, requested_by: user)
      visit project_path(project)
      wait_spinner
      wait_page_load

      find('.story-title').click
      find('.toggle-history').click
    end

    it 'turns history visible', js: true do
      expect(page).to have_css('#history')
    end

    it 'updates history column title', js: true do
      title = find('.history_column > .column_header > .toggle-title')
      expect(title).to have_text("History Of 'Test Story'")
    end
  end

  describe 'release story' do
    context 'when creating a release story' do
      it 'renders only the fields related to a story of type release', js: true do
        visit project_path(project)
        wait_spinner

        wait_page_load
        click_on 'Add story'
        within(chilly_bin_column) do
          select 'release', from: 'story_type'

          expect(page).not_to have_selector('estimate')
          expect(page).not_to have_selector('state')
          expect(page).not_to have_selector('requested_by_id')
          expect(page).not_to have_selector('owned_by_id')
          expect(page).not_to have_content('Labels')
          expect(page).not_to have_css('.attachinary-input')
          expect(page).to have_css('.release_date')
          expect(page).to have_css('.story-description')
        end
      end
    end

    context 'when editing a release story' do
      let(:formated_date) { (Date.today - 10.days).strftime('%m/%d/%Y') }
      let!(:story) do
        create(:story, title: 'Release Story', story_type: 'release', project: project,
                       release_date: formated_date, requested_by: user,
                       description: 'Release description')
      end

      it 'shows only the fields related to a story of type release', js: true do
        visit project_path(project)
        wait_spinner

        wait_page_load
        story_element(story).click
        expect(page).to have_field('title', with: story.title)
        expect(page).to have_select('story_type', selected: 'release')
        expect(page).to have_field('release_date', with: formated_date)
        expect(page).to have_content('Release description')
      end

      it 'highlights the release when the it\'s projected completion is delayed', js: true do
        visit project_path(project)
        wait_spinner

        wait_page_load
        expect(page).to have_css('.backlogged-release')
      end

      it 'has a title when the release it\'s projected completion is delayed', js: true do
        visit project_path(project)
        wait_spinner

        wait_page_load
        expect(story_element(story)[:title])
          .to match(I18n.t('story.warnings.backlogged_release'))
      end
    end
  end

  describe 'story links' do
    let!(:story) { create(:story, title: 'Story', project: project, requested_by: user) }
    let!(:target_story) do
      create(:story, state: 'unscheduled', estimate: 1, project: project, requested_by: user)
    end

    before do
      story.description = "Story ##{target_story.id}"
      story.save!
    end

    it 'injects the state actions buttons into the collapsed story', js: true do
      unstarted = create(:story, state: 'unstarted', estimate: 1, project: project, requested_by: user)
      started = create(:story, state: 'started', estimate: 1, project: project, requested_by: user)
      finished = create(:story, state: 'finished', estimate: 1, project: project, requested_by: user)
      delivered = create(:story, state: 'delivered', estimate: 1, project: project, requested_by: user)
      rejected = create(:story, state: 'rejected', estimate: 1, project: project, requested_by: user)

      visit project_path(project)
      wait_spinner
      wait_page_load

      within("#story-#{unstarted.id}") do expect(page).to have_css('input.start')  end
      within("#story-#{started.id}") do expect(page).to have_css('input.finish') end
      within("#story-#{finished.id}") do expect(page).to have_css('input.deliver') end
      within("#story-#{delivered.id}") do
        expect(page).to have_css('input.accept')
        expect(page).to have_css('input.reject')
      end
      within("#story-#{rejected.id}") do expect(page).to have_css('input.restart') end

    end

    it 'unscheduled story link', js: true do
      visit project_path(project)
      wait_spinner
      wait_page_load

      story_element(story).click
      expect(story_element(story).find("#story-link-#{target_story.id}"))
        .to have_content("##{target_story.id}")
    end

    %w[unstarted started finished delivered accepted rejected].each do |state|
      it "#{state} story link", js: true do
        visit project_path(project)
        wait_spinner
        wait_page_load

        find("#story-#{target_story.id}").click
        within("#story-#{target_story.id}") do
          find('select[name="state"]').find("option[value='#{state}']").select_option
          click_on 'Save'
        end

        story_element(story).click
        expect(page).to have_css(".story-link-icon.#{state}")
      end
    end

  end

  describe 'clone a story' do
    let(:story) do
      create(:story, title: 'Clone Me', project: project,
                     requested_by: user)
    end

    before do
      story
      visit project_path(project)
      wait_spinner
    end

    it 'clones the story to the chilly bin', js: true do
      find('.story-title').click
      find('.clone-story').click

      expect(chilly_bin_column).to have_content('Clone Me')
    end
  end

  describe 'delete a story' do
    let(:story) do
      create(:story, title: 'Delete Me', project: project,
                     requested_by: user)
    end

    before do
      story
    end

    it 'deletes the story', js: true do
      visit project_path(project)
      wait_spinner

      within(story_selector(story)) do
        find('.story-title').click
        accept_confirm do
          click_on 'Delete'
        end
      end

      expect(page).not_to have_css(story_selector(story))
    end
  end

  describe 'search a story' do
    let(:story) do
      create(:story, title: 'Search for me', project: project,
                     requested_by: user, story_type: 'feature')
    end

    before do
      story
      visit project_path(project)
      wait_spinner

      within('#form_search') do
        fill_in 'q', with: 'Search'
      end
    end

    it 'renders the search tooltip', js: true do
      find('.drop-target').hover

      expect(page).to have_css('.tooltip-content')
    end

    it 'finds the story', js: true do
      # should not have any search results by default
      expect(page).not_to have_css('.searchResult')

      page.execute_script("$('#form_search').submit()")
      # should return at least one story in the result column
      expect(page).to have_css('.searchResult')
      within(story_selector(story)) do
        find('.story-title').click
        accept_confirm do
          click_on 'Delete'
        end
      end

      # when the story is delete in the results column it should also disappear from other columns
      expect(page).not_to have_css(story_search_result_selector(story))
      expect(page).not_to have_css(story_selector(story))
    end

    context 'when search for past iteration story' do
      let(:project) do
        create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
      end
      let(:done_story) do
        create(:story, :done, title: 'Past iteration', project: project, requested_by: user)
      end

      before do
        done_story
        visit project_path(project)
        wait_spinner

        within('#form_search') do
          fill_in 'q', with: 'iteration'
        end

        page.execute_script("$('#form_search').submit()")
      end

      it 'does not show the locate button', js: true do
        story_element = find(story_search_result_selector(done_story))
        expect(story_element[:class]).to include('searchResult')
        expect(story_element).not_to have_css('#locate')
      end

      it 'does not show the control buttons', js: true do
        story_element = find(story_search_result_selector(done_story))
        story_element.click
        expect(story_element).not_to have_css('.submit')
        expect(story_element).not_to have_css('.destroy')
      end
    end

    it 'finds the story using a contextual search query', js: true do
      page.execute_script("$('#form_search').val('')")

      within('#form_search') do
        fill_in 'q', with: "title: Search, type: feature"
      end

      page.execute_script("$('#form_search').submit()")

      expect(page).to have_css('.searchResult')
    end

    it 'highlights the story on click the locate button', js: true do
      page.execute_script("$('#form_search').submit()")

      within('#search_results') do
        find('#locate').click
      end

      expect(story_element(story)[:style]).to match(/background-color/)
    end

    it 'drags the story to other columns', js: true do
      within('#in_progress .story') do
        find('#estimate-1').click
        click_on 'start'
      end

      page.execute_script("$('#form_search').submit()")

      result_story = find('.searchResult')
      target = chilly_bin_column
      result_story.drag_to(target)

      expect(page).to_not have_css('.searchResult')
      expect(chilly_bin_column).to have_content('Search for me')
    end
  end

  describe 'show and hide columns' do
    before do
      project
      Capybara.ignore_hidden_elements = true
    end

    it 'hides and shows the columns', js: true do
      visit project_path(project)
      wait_spinner

      columns = {
        'done'        => 'Done',
        'in_progress' => 'Current Sprint',
        'backlog'     => 'Backlog',
        'chilly_bin'  => 'Chilly Bin'
      }

      find('#sidebar-toggle').click

      columns.each do |column, button_text|
        selector = "table.stories td.#{column}_column"
        expect(page).to have_css(selector)

        # Hide the column
        within('#column-toggles') do
          click_on button_text
        end
        expect(page).not_to have_css(selector)

        # Show the column
        within('#column-toggles') do
          click_on button_text
        end
        expect(page).to have_css(selector)

        # Hide the column with the 'close' button in the column header
        within("#{selector} .column_header") do
          click_link 'Close'
        end

        expect(page).not_to have_css(selector)
      end
    end

    it 'starts with hidden search results column', js: true do
      visit project_path(project)
      wait_spinner

      selector = 'table.stories td.search_results_column'
      expect(page).not_to have_css(selector)

      find('#sidebar-toggle').click

      # Show the column
      within('#column-toggles') do
        click_on 'Search Results'
      end
      expect(page).to have_css(selector)

      # close the sidebar
      find('#sidebar-toggle').click

      # Hide the column with the 'close' button in the column header
      within("#{selector} .column_header") do
        click_link 'Close'
      end
      expect(page).not_to have_css(selector)
    end
  end

  describe 'filter by label' do
    let!(:story) do
      create(:story, title: 'Task 1', project: project,
                     requested_by: user, labels: 'epic1')
    end
    let!(:story2) do
      create(:story, title: 'Task 2', project: project,
                     requested_by: user, labels: 'epic1')
    end
    let!(:story3) do
      create(:story, title: 'Task 3', project: project,
                     requested_by: user, labels: 'epic2')
    end

    it 'show epic by label', js: true do
      visit project_path(project)
      wait_spinner
      wait_page_load

      expect(page).not_to have_css('.epic_column')
      expect(page).to have_content 'Task 1'
      expect(page).to have_content 'Task 2'
      expect(page).to have_content 'Task 3'

      first(:link, 'epic1').click

      within '.epic_column' do
        expect(page).to have_content 'Task 1'
        expect(page).to have_content 'Task 2'
        expect(page).to_not have_content 'Task 3'
      end

      first(:link, 'epic2').click

      within '.epic_column' do
        expect(page).to_not have_content 'Task 1'
        expect(page).to_not have_content 'Task 2'
        expect(page).to have_content 'Task 3'
      end
    end

    it 'drags the story to chilly bin', js: true do
      visit project_path(project)
      wait_spinner
      wait_page_load

      first(:link, 'epic2').click

      resultStory = find(story_search_result_selector(story3))
      target = chilly_bin_column
      resultStory.drag_to(target)

      within(chilly_bin_column) do
        expect(page).to have_content 'Task 3'
      end
    end
  end

  describe 'estimate a story' do
    let!(:story) do
      create(:story, title: 'Task 1', project: project,
                     requested_by: user, labels: 'epic1')
    end

    it 'shows the buttons to estimate a story', js: true do
      visit project_path(project)
      wait_spinner
      wait_page_load

      within '.estimates' do
        expect(page).to have_content '1'
        expect(page).to have_content '2'
        expect(page).to have_content '3'
        expect(page).to have_content '5'
        expect(page).to have_content '8'
      end
    end
  end
end
