# frozen_string_literal: true

module Renderers
  class CsvOptions
    def initialize(options = {})
      @options = options
    end

    def exporter
      @exporter ||= options[:exporter] || ::Exporters::Default
    end

    def filename
      @filename ||= options[:filename] || exporter.filename
    end

    def type
      Mime[:csv]
    end

    def attributes
      [exporter, filename, type]
    end

    private

    attr_reader :options
  end
end
