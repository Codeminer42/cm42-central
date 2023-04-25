require 'rails_helper'

describe StoryOperations::Create do
  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let!(:membership) { create(:membership) }
  let(:user)        { membership.user }
  let(:project)     { membership.project }
  let(:story)       { project.stories.build(story_params) }

  subject { -> { StoryOperations::Create.new.call(story: story, current_user: user) } }

  context 'with valid params' do
    it { expect { subject.call }.to change { Story.count } }
    it { expect { subject.call }.to change { Changeset.count } }
    it { expect(subject.call.value!).to be_eql Story.last }

    Story::ESTIMABLE_TYPES.each do |story_type|
      context "a #{story_type} story" do
        it 'keeps the story state unscheduled' do
          story.attributes = { state: 'unscheduled', story_type: story_type, estimate: 1 }
          subject.call
          expect(story.state).to eq('unscheduled')
        end
      end

      context "a started #{story_type} story" do
        it 'sets the story state as started' do
          story.attributes = { state: 'started', story_type: story_type, estimate: 1 }
          subject.call
          expect(story.state).to eq('started')
        end
      end
    end

    context 'a non estimable story' do
      it 'keeps the story state as unscheduled' do
        story.attributes = { state: 'unscheduled', story_type: 'release' }
        subject.call
        expect(story.state).to eq('unscheduled')
      end
    end
  end

  context 'with invalid params' do
    before { story.title = '' }

    it { is_expected.to_not change { Story.count } }
    it { expect(subject.call.success?).to be_falsy }
    it { expect(Notifications).to_not receive(:story_mention) }
  end

  context '::UserNotification' do
    let(:mailer) { double('mailer') }
    let(:username_user) do
      project.users.create(
        build(:unconfirmed_user, username: 'username').attributes
      )
    end
    let(:story) do
      project.stories.create(
        story_params.merge(description: 'Foo @username')
      )
    end

    it 'also sends notification for the found username' do
      expect(Notifications).to receive(:story_mention)
        .with(story, [username_user.email]).and_return(mailer)
      expect(mailer).to receive(:deliver_later)

      subject.call
    end
  end

  context '::PusherNotification' do
    it 'notifies the pusher that the board has changes' do
      expect(PusherNotificationWorker).to receive(:perform_async)

      subject.call
    end
  end
end
