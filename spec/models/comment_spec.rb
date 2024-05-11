require 'rails_helper'

describe Comment do
  let(:project) { mock_model(Project, suppress_notifications: true) }
  let(:user)    { mock_model(User) }
  let(:story)   { mock_model(Story, project: project) }

  subject { build :comment, story: story, user: user }

  describe 'validations' do
    describe '#name' do
      before { subject.body = '' }
      it 'should have an error on comment' do
        subject.valid?
        expect(subject.errors[:body].size).to eq(1)
      end
    end
  end
end
