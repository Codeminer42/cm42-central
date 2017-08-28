require 'rails_helper'

describe Activity, type: :model do
  describe '.by_story' do
    let(:story) { create(:story, :with_project, :with_activity) }

    context 'when the story is found' do
      subject { Activity.by_story(story.id) }

      before { create_list(:story, 3, :with_project, :with_activity) }

      it 'returns the activities where the id matches' do
        expect(subject.map(&:subject_id)).to contain_exactly(story.id)
      end

      it "returns only the 'Story' subject_type" do
        expect(subject.map(&:subject_type)).to contain_exactly('Story')
      end
    end

    context 'when the story is not found' do
      subject { Activity.by_story(99_999) }

      it 'returns an empty collection' do
        is_expected.to be_empty
      end
    end
  end
end
