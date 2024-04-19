require 'rails_helper'

describe Activity, type: :model do
  context 'invalid params' do
    it 'must raise validation errors' do
      activity = Activity.new
      activity.valid?
      expect(activity.errors[:project].size).to eq(1)
      expect(activity.errors[:user].size).to eq(1)
      expect(activity.errors[:subject].size).to eq(1)
      expect(activity.errors[:action].size).to eq(2)
    end
  end

  context 'valid params' do
    let(:story) { create(:story, :with_project) }
    let(:activity) { build(:activity, action: 'update', subject: story) }

    it 'should save without parsing changes' do
      activity.action = 'create'
      expect(activity.save).to be_truthy
    end

    it 'should fetch the changes from the model' do
      first_update = story.updated_at
      story.title = 'new story title'
      story.estimate = 2
      story.state = 'finished'

      story.save
      activity.save

      expect(activity.subject.saved_changes).to eq(
        'title' => ['Test story', 'new story title'],
        'estimate' => [nil, 2],
        'state' => %w[unstarted finished],
        # 'updated_at' => [first_update, story.updated_at]
      )
    end
  end

  context 'update with no changes' do
    subject { build(:activity, action: 'update', subject: story) }

    let!(:story) { create(:story, :with_project) }

    before do
      story.save
      subject.validate
    end

    it { is_expected.to be_invalid }
    it { expect(subject.errors[:subject].count).to be(1) }
    it { expect(subject.errors[:subject].to_sentence).to eq("Record didn't change") }
  end

  context '#grouped_activities' do
    let(:user) { create :user }
    let(:project) { create :project, users: [user] }
    let(:story1) { create :story, project: project, requested_by: user }
    let(:story2) { create :story, project: project, requested_by: user }
    let(:yesterday) { Time.zone.yesterday }
    let(:today) { Time.zone.now }

    before do
      Timecop.freeze(Time.utc(2016, 10, 5, 12, 0, 0))
      Activity.destroy_all
      create :activity, subject: story1, subject_changes: { estimate: [0, 1] }
      create :activity, subject: story1, subject_changes: { estimate: [1, 2] }
      create :activity, subject: story1, subject_changes: { description: %w[Foo Hello] }
      ref = create :activity, subject: story1, subject_changes: { description: %w[Foo Hello] }
      Activity.update_all(created_at: yesterday, updated_at: yesterday)
      create :activity, subject: story2, subject_changes: {
        description: ['Hello WORLD', 'Hello World']
      }
      create :activity, subject: story2, subject_changes: { description: ['Hello World', 'Hello'] }
      Activity.where('id > ?', ref.id).update_all(created_at: today, updated_at: today)
    end

    after do
      Timecop.return
    end

    it 'should return a proper grouped list of merged activities' do
      grouped = Activity.grouped_activities(Project.all, 2.days.ago)
      expect(grouped.first.first).to eq(yesterday.beginning_of_day)
      expect(grouped.last.first).to eq(today.beginning_of_day)

      expect(grouped.first.last.last.last.last.last.first.subject_changes)
        .to eq(estimate: [0, 2], description: %w[Foo Hello])
      expect(grouped.last.last.last.last.last.last.first.subject_changes)
        .to eq(description: ['Hello WORLD', 'Hello'])
    end
  end

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
