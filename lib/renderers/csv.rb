# frozen_string_literal: true

module Renderers
  module Csv
    ActionController::Renderers.add :csv do |collection, options|
      exporter, filename, type = Renderers::CsvOptions.new(options).attributes
      send_data(exporter.content(collection), type: type, filename: filename)
    end
  end
end
