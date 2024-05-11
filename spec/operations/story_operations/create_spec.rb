require 'rails_helper'

describe StoryOperations::Create do
  describe '#call' do
    subject { -> { StoryOperations::Create.call(
      project:,
      story:,
      story_attrs:,
      current_user: user
    ) } }

    let(:membership) { create(:membership) }
    let(:user)        { membership.user }
    let(:other_membership) { create(:membership, project: project) }
    let!(:other_user)  { other_membership.user }
    let(:project)     { membership.project }
    let(:story)       { project.stories.build }
    let(:mailer)      { double(deliver_later: true) }

    before { allow(Notifications).to receive(:new_story).and_return(mailer) }

    context 'with valid story' do
      let(:story_attrs) do
        { title: 'Story', requested_by: user, state: 'unstarted', accepted_at: nil }
      end

      it 'saves story' do
        expect { subject.call }.to change { Story.count }.by(1)
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'sends user notification' do
        expect(Notifications).to receive(:new_story).with(other_user.email, story, user)
        expect(Notifications).to_not receive(:new_story).with(user.email, story, user)
        subject.call
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created story' do
        expect(subject.call.success).to eq(Story.last)
      end

      context 'when estimable_type is feature' do
        context 'and state is started' do
          let(:story_attrs) do
            { title: 'Story', requested_by: user, accepted_at: nil, story_type: 'feature', state: 'started', estimate: 1 }
          end

          it 'keeps story state as started' do
            subject.call
            expect(story.state).to eq('started')
          end
        end

        context 'and state is unscheduled' do
          let(:story_attrs) do
            { title: 'Story', requested_by: user, accepted_at: nil, story_type: 'feature', state: 'unscheduled', estimate: 1 }
          end

          it 'keeps story state as unscheduled' do
            subject.call
            expect(story.state).to eq('unscheduled')
          end
        end
      end

      context 'when story is not estimable' do
        let(:story_attrs) do
          { title: 'Story', requested_by: user, accepted_at: nil, story_type: 'release', state: 'unscheduled', estimate: 1 }
        end

        it 'keeps story state as unscheduled' do
          subject.call
          expect(story.state).to eq('unscheduled')
        end
      end
    end

    context 'with invalid story' do
      let(:story_attrs) do
        { title: '', requested_by: user, state: 'unstarted', accepted_at: nil }
      end

      it 'does not save story' do
        expect { subject.call }.to_not change { Story.count }
      end

      it 'does not create activity recording' do
        expect { subject.call }.to_not change { Activity.count }
      end

      it 'does not send user notification' do
        expect(StoryOperations::UserNotification).to_not receive(:notify_users).with(story)
        subject.call
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns story with errors' do
        expect(subject.call.failure.errors.full_messages).to eq(['Title can\'t be blank'])
      end
    end
  end
end
