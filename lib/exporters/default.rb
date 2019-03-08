# frozen_string_literal: true

module Exporters
  class Default
    attr_reader :collection

    def initialize(collection = [])
      @collection = collection
    end

    def generate
      raise NotImplementedError
    end

    class << self
      def content(collection)
        new(collection).generate
      end

      def filename
        'export.csv'
      end
    end
  end
end
