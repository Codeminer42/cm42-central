# frozen_string_literal: true

module Exporters
  class Stories < Default
    EXTRA_COLUMNS = {
      note: 'Note', document: 'Document', task: ['Task', 'Task Status']
    }.freeze

    alias stories collection

    def generate
      columns = {
        notes: note_columns_size, documents: document_columns_size, tasks: task_columns_size
      }

      CSV.generate do |csv|
        csv << headers

        stories.each do |story|
          csv << story.to_csv(columns)
        end
      end
    end

    private

    def headers
      notes_columns = Array.new(note_columns_size, EXTRA_COLUMNS[:note])
      documents_columns = Array.new(document_columns_size, EXTRA_COLUMNS[:document])
      tasks_columns = Array.new(task_columns_size, EXTRA_COLUMNS[:task]).flatten

      @headers ||= Story.csv_headers + [
        notes_columns, documents_columns, tasks_columns
      ].flatten
    end

    def note_columns_size
      @note_columns_size ||= stories.map { |story| story.notes.size }.max || 0
    end

    def document_columns_size
      @document_columns_size ||= stories.map { |story| story.documents.size }.max || 0
    end

    def task_columns_size
      @task_columns_size ||= stories.map { |story| story.tasks.size }.max || 0
    end
  end
end
