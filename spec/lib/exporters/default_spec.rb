require 'rails_helper'

describe Exporters::Default do
  it { is_expected.to respond_to(:collection) }

  describe '.filename' do
    subject { described_class.filename }

    it { is_expected.to eq 'export.csv' }
  end

  describe '.content' do
    it { expect { described_class.content([]) }.to raise_error NotImplementedError }
  end
end
