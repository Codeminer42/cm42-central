require 'rails_helper'

describe Note do
  let(:project) { mock_model(Project, suppress_notifications: true) }
  let(:user)    { mock_model(User) }
  let(:story)   { mock_model(Story, project: project) }

  subject { build :note, story: story, user: user }

  describe 'validations' do
    describe '#name' do
      before { subject.note = '' }
      it 'should have an error on note' do
        subject.valid?
        expect(subject.errors[:note].size).to eq(1)
      end
    end
  end

  describe '#as_json' do
    it 'returns the right keys' do
      expect(subject.as_json.keys.sort)
        .to eq(%w[created_at errors id note story_id updated_at user_id user_name])
    end
  end

  describe '#to_csv' do
    context 'When Note has a user' do
      let(:note) do
        build_stubbed(
          :note,
          user: user,
          note: 'Test note',
          created_at: 'Nov 3, 2011'
        )
      end

      before { allow(user).to receive_messages(name: 'user') }

      subject { note.to_csv }
      it { is_expected.to eq('Test note (user - Nov 03, 2011)') }
    end

    context 'When Note does not have a user' do
      let(:user_name) { I18n.t('author unknown') }
      let(:note) do
        build_stubbed(:note, :without_user, note: 'Test note', created_at: 'Nov 3, 2011')
      end

      subject { note.to_csv }
      it { is_expected.to eq("Test note (#{user_name} - Nov 03, 2011)") }
    end

  end
end
