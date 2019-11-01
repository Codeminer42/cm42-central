require 'rails_helper'

describe StoryOperations::StateEnsurement do
  let(:state_ensurement) { Class.new { extend StoryOperations::StateEnsurement } }

  describe '#should_be_unscheduled?' do
    subject { state_ensurement.should_be_unscheduled?(params) }

    context 'when is estimated and can be estimated' do
      let(:params) { { estimate: 1, type: 'feature' } }

      it { is_expected.to be_falsy }
    end

    context 'when is estimated and can not be estimated' do
      let(:params) { { estimate: 1, type: 'bug' } }

      it { is_expected.to be_falsy }
    end

    context 'when is not estimated and can be estimated' do
      let(:params) { { estimate: nil, type: 'feature' } }

      it { is_expected.to be_truthy }
    end
  end
end
