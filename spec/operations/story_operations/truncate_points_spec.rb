require 'rails_helper'

describe StoryOperations::TruncatePoints do
  describe '#call' do
    subject { -> { StoryOperations::TruncatePoints.call(project: project) } }

    let(:membership)  { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let!(:story_1)    { create(:story, estimate: 1, project: project, requested_by: user) }
    let!(:story_2)    { create(:story, estimate: 2, project: project, requested_by: user) }
    let!(:story_3)    { create(:story, estimate: 3, project: project, requested_by: user) }

    context 'with all stories within project point scale' do
      before { project.update!(point_scale: 'fibonacci') }

      it 'makes no changes' do
        expect { subject.call }.to_not change { Story.order(:id).pluck(:estimate) }
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end

    context 'with some stories above project point scale' do
      before do
        story_3.update!(estimate: 8)
        project.update!(point_scale: 'linear')
      end

      it 'makes changes' do
        expect { subject.call }
          .to change { Story.order(:id).pluck(:estimate) }
          .from([1,2,8])
          .to([1,2,5])
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end

    context 'with project point scale being disabled' do
      before do
        project.update!(point_scale: 'none')
      end

      it 'makes changes' do
        expect { subject.call }
          .to change { Story.order(:id).pluck(:estimate) }
          .from([1,2,3])
          .to([nil,nil,nil])
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end
  end
end

