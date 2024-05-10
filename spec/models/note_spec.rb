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
end
