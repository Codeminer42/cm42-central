require 'rails_helper'

describe StoryOperations::Update do
  describe '#call' do
    subject { -> { StoryOperations::Update.call(story: story, story_attrs: story_params, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:create_story_params) do
      { title: 'Story', requested_by: user, accepted_at: nil, story_type: 'feature', state: 'started', estimate: 1 }
    end
    let(:story)       { project.stories.create(create_story_params) }

    context 'with valid story' do
      let(:story_params) do
        { title: 'Updated Story', story_type: 'feature', state: 'started', estimate: 1 }
      end

      it 'updates story' do
        expect(subject.call.success.title).to eq(story_params[:title])
      end

      it 'creates changesets' do
        expect { subject.call }.to change { Changeset.count }.by(1)
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'sends state changed notification' do
        expect(StoryOperations::StateChangeNotification).to receive(:notify_state_changed).with(story)
        subject.call
      end

      it 'sends user notification' do
        expect(StoryOperations::UserNotification).to receive(:notify_users).with(story)
        subject.call
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      context 'when story_type is feature' do
        context 'and estimate is nil' do
          let(:story_params) do
            { story_type: 'feature', state: 'started', estimate: nil }
          end

          it 'changes state to unscheduled' do
            expect(subject.call.success.state).to eq('unscheduled')
          end
        end

        context 'and estimate is not nil' do
          let(:story_params) do
            { story_type: 'feature', state: 'started', estimate: 1 }
          end

          it 'does not change state to unscheduled' do
            expect(subject.call.success.state).to_not eq('unscheduled')
          end
        end
      end

      context 'when project start_date is nil' do
        let(:story_params) do
          { state: 'accepted', accepted_at: Date.current }
        end

        it 'fixes the project start_date' do
          story.project.update_attribute(:start_date, nil)
          expect(subject.call.success.project.start_date).to_not be_nil
        end
      end

      context 'when project start_date is newer than the story accepted_at' do
        let(:story_params) do
          { state: 'accepted', accepted_at: Date.current }
        end

        it 'fixes the project start_date' do
          story.project.update_attribute(:start_date, Date.current + 2.days)
          expect(subject.call.success.project.start_date).to eq(story.accepted_at.to_date)
        end
      end
    end

    context 'with invalid story' do
      let(:story_params) do
        { title: '', story_type: 'feature', state: 'started', estimate: 1 }
      end

      it 'does not save story' do
        expect(subject.call.failure.title).to_not eq(story_params['title'])
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns story with errors' do
        expect(subject.call.failure.errors.full_messages).to eq(['Title can\'t be blank'])
      end

      it 'does not create changesets' do
        expect { subject.call }.to_not change { Changeset.count }
      end

      it 'does not create activity recording' do
        expect { subject.call }.to_not change { Activity.count }
      end

      it 'does not sends state changed notification' do
        expect(StoryOperations::StateChangeNotification).to_not receive(:notify_state_changed).with(story)
        subject.call
      end

      it 'does not send user notification' do
        expect(StoryOperations::UserNotification).to_not receive(:notify_users).with(story)
        subject.call
      end
    end
  end
end
