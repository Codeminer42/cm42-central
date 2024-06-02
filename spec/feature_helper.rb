require 'rails_helper'

RSpec.configure do |config|
  config.around(:each) do |ex|
    if ENV["CI"]
      ex.run_with_retry retry: 3
    else
      ex.run
    end
  end

  config.retry_callback = proc do |ex|
    # run some additional clean up task
    Capybara.reset!
  end

  # All exceptions will trigger a retry
  config.exceptions_to_retry = []

  config.include Warden::Test::Helpers

  def story_selector(story)
    "#story-#{story.id}"
  end

  def story_search_result_selector(story)
    "#story-search-result-#{story.id}"
  end

  def icebox_column
    page.find('#icebox')
  end

  def backlog_column
    page.find('#backlog')
  end

  def todo_column
    page.find('#todo')
  end

  def done_column
    page.find('#done')
  end

  def story_element(story, parent: page)
    parent.find(story_selector(story))
  end
end
