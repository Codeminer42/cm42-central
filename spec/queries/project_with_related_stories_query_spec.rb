require 'rails_helper'

RSpec.describe ProjectWithRelatedStoriesQuery, type: :queries do

  describe '#call' do
    let(:project_foo)         { create(:project, name: 'Project foo', tag_group: tag_group) }
    let(:project_bar)         { create(:project, name: 'Project bar', tag_group: tag_group) }
    let(:project_baz)         { create(:project, name: 'Project baz') }
    let(:tag_group)           { create(:tag_group) }
    let(:release_story_params)    { { title: 'Test Story', story_type: 'release', state: 'started', accepted_at: nil } }
    let(:normal_story_params)    { { title: 'Test Story', state: 'started', accepted_at: nil } }

    before do
      3.times do
        project_foo.stories.create(release_story_params)
        project_foo.stories.create(normal_story_params)

        project_bar.stories.create(release_story_params)
        project_bar.stories.create(normal_story_params)

        project_baz.stories.create(release_story_params)
      end
    end

    it 'get properly the related stories' do
      related_stories = project_foo.stories + project_bar.stories.where(story_type: 'release')

      result = ProjectWithRelatedStoriesQuery.call(project_foo)
      expect(result.size).to eq related_stories.size
    end
  end
end
