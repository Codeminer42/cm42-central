require 'rails_helper'

zeitwerk_original_require "renderers/csv_options"
describe Renderers::CSVOptions do
  let(:exporter) do
    Class.new(Exporters::Default) do
      def self.filename
        'filename.csv'
      end
    end
  end

  describe '#exporter' do
    subject { described_class.new(options).exporter }

    context 'when there is no "exporter" in options' do
      let(:options) { {} }

      it { is_expected.to eq Exporters::Default }
    end

    context 'when there is a custom "exporter" in options' do
      let(:options) { { exporter: exporter } }

      it { is_expected.to eq exporter }
    end
  end

  describe '#filename' do
    subject { described_class.new(options).filename }

    context 'when "filename" is present in options' do
      let(:options) { { filename: 'abc.csv' } }

      it { is_expected.to eq 'abc.csv' }
    end

    context 'when there is no "filename" in options' do
      context 'and there is no exporter' do
        let(:options) { { } }

        it 'fallbacks to Exporters::Default.filename' do
          is_expected.to eq 'export.csv'
        end
      end

      context 'and there is a custom exporter' do
        let(:options) { { exporter: exporter } }

        it { is_expected.to eq 'filename.csv' }
      end
    end
  end

  describe '#type' do
    subject { described_class.new.type }

    it { is_expected.to eq Mime[:csv] }
  end

  describe '#attributes' do
    subject { described_class.new(options).attributes }

    context 'when options is blank' do
      let(:options) { {} }

      it { is_expected.to eq [Exporters::Default, 'export.csv', Mime[:csv]] }
    end

    context 'when both "exporter" and "filename" are present' do
      let(:options) { { exporter: exporter, filename: 'testing.csv' } }

      it { is_expected.to eq [exporter, 'testing.csv', Mime[:csv]] }
    end
  end
end
