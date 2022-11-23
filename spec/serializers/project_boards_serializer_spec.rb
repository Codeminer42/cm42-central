require 'rails_helper'

describe ProjectBoardsSerializer do
  let(:stories) { 
    [ 
      { 
        "id" => 1,
        "title" => "A title",
        "description" => "A description",
        "estimate" => 3,
        "story_type" => "feature",
        "state" => "finished",
        "requested_by_name" => "A name",
        "owned_by_initials" => "AN",
        "project_id" => 4,
        "additional_prop" => "A"
      } 
    ] 
  }
  let(:expected_stories) {
    [ 
      { 
        id: 1,
        title: "A title",
        description: "A description",
        estimate: 3,
        story_type: "feature",
        state: "finished",
        requested_by_name: "A name",
        owned_by_initials: "AN",
        project_id: 4
      } 
    ]
  }

  describe '#collapsed_stories' do
    it 'should return shorter version of stories' do
      expect(ProjectBoardsSerializer.collapsed_stories(stories)).to eq(expected_stories)
    end
  end
end
