require 'rails_helper'

describe Exporters::Stories do
  describe '.content' do
    let(:user) { build(:user) }
    let(:project) { build(:project, users: [user]) }

    let(:csv) do
      [
        csv_headers.to_csv,
        stories.map { |story| story.to_csv(csv_extra_columns) }.map(&:to_csv)
      ].flatten.join
    end

    subject { described_class.content(stories) }

    context 'when stories is empty' do
      let(:stories) { [] }

      it { is_expected.to eq Story.csv_headers.to_csv }
    end

    context 'when stories has not notes nor documents nor tasks' do
      let(:stories) { build_list(:story, 3, :done, project: project, requested_by: user) }

      let(:csv_headers) { Story.csv_headers }
      let(:csv_extra_columns) { { notes: 0, documents: 0, tasks: 0 } }

      it { is_expected.to eq(csv) }
    end

    context 'when only one story has notes' do
      let(:csv_headers) { Story.csv_headers << 'Note' }
      let(:csv_extra_columns) { { notes: 1, documents: 0, tasks: 0 } }

      let(:stories) { create_list(:story, 1, :active, project: project, requested_by: user) }

      before { create(:note, story: stories.first) }

      it { is_expected.to eq csv }
    end

    context 'when more than one story has notes' do
      let(:csv_headers) { Story.csv_headers.concat Array.new(2, 'Note') }
      let(:csv_extra_columns) { { notes: 2, documents: 0, tasks: 0 } }

      let(:stories) { create_list(:story, 1, :active, project: project, requested_by: user) }

      before { create_list(:note, 2, story: stories.first) }

      it { is_expected.to eq csv }
    end

    context 'when only one story has documents' do
      let(:csv_headers) { Story.csv_headers << 'Document' }
      let(:csv_extra_columns) { { notes: 0, documents: 1, tasks: 0 } }

      let(:stories) { create_list(:story, 3, :done, project: project, requested_by: user) }
      let(:story) { stories.first }

      before do
        Attachinary::File.skip_callback(:create, :after, :remove_temporary_tag)

        create(:attachinary_file, :story, attachinariable_id: story.id)
      end

      after do
        Attachinary::File.set_callback(:create, :after, :remove_temporary_tag)
      end

      it { is_expected.to eq csv }
    end

    context 'when more than one story has documents' do
      let(:csv_headers) { Story.csv_headers.concat Array.new(2, 'Document') }
      let(:csv_extra_columns) { { notes: 0, documents: 2, tasks: 0 } }

      let(:stories) { create_list(:story, 3, :done, project: project, requested_by: user) }
      let(:story) { stories.first }

      before do
        Attachinary::File.skip_callback(:create, :after, :remove_temporary_tag)

        create_list(:attachinary_file, 2, :story, attachinariable_id: story.id)
      end

      after do
        Attachinary::File.set_callback(:create, :after, :remove_temporary_tag)
      end

      it { is_expected.to eq csv }
    end

    context 'when only one story has tasks' do
      let(:csv_headers) { Story.csv_headers.concat(['Task', 'Task Status']) }
      let(:csv_extra_columns) { { notes: 0, documents: 0, tasks: 1 } }

      let(:stories) { create_list(:story, 1, :active, project: project, requested_by: user) }

      before { create(:task, story: stories.first) }

      it { is_expected.to eq csv }
    end

    context 'when more than one story has tasks' do
      let(:csv_headers) do
        Story.csv_headers.concat(
          Array.new(2, ['Task', 'Task Status']).flatten
        )
      end
      let(:csv_extra_columns) { { notes: 0, documents: 0, tasks: 2 } }

      let(:stories) { create_list(:story, 1, :active, project: project, requested_by: user) }

      before { create_list(:task, 2, story: stories.first) }

      it { is_expected.to eq csv }
    end
  end
end
