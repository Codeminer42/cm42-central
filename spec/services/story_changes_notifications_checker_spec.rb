require 'rails_helper'

describe StoryChangesNotificationsChecker do
  let(:user) { double :user }
  let(:responsible) { double :responsible, email_delivery?: true }

  let(:story) do
    double(
      :story,
      state_changed?: true,
      suppress_notifications: false,
      acting_user: user,
      state: 'started',
      requested_by: responsible
    )
  end

  subject { described_class.new(story) }

  describe '#can_notify?' do
    context 'when state has changed' do
      it 'should notify' do
        expect(subject.can_notify?).to be true
      end
    end

    context 'when state has not changed' do
      it 'should not notify' do
        allow(story).to receive(:state_changed?).and_return(false)
        expect(subject.can_notify?).to be false
      end
    end

    context 'when notifications are disabled' do
      it 'should not notify' do
        allow(story).to receive(:suppress_notifications).and_return(true)
        expect(subject.can_notify?).to be false
      end
    end

    context 'when changes were not did by an user' do
      it 'should not notify' do
        allow(story).to receive(:acting_user).and_return(nil)
        expect(subject.can_notify?).to be false
      end
    end

    context 'when story has no responsible' do
      it 'should not notify' do
        allow(story).to receive(:requested_by).and_return(nil)
        expect(subject.can_notify?).to be false
      end
    end

    context 'when story has changed by its responsible' do
      it 'should not notify' do
        allow(story).to receive(:acting_user).and_return(story.requested_by)
        expect(subject.can_notify?).to be false
      end
    end

    context 'when responsible has email notification disabled' do
      it 'should not notify' do
        allow(responsible).to receive(:email_delivery?).and_return(false)
        expect(subject.can_notify?).to be false
      end
    end
  end
end
