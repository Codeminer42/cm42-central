module GitlabApi
  class Client
    attr_accessor :response

    def initialize(api_url, private_token, success_response_code)
      @api_url = api_url
      @private_token = private_token
      @success_response_code = success_response_code
    end

    def self.perform(*attrs)
      new(*attrs).perform
    end

    def connection
      @connection ||= Faraday.new(url: api_url) do |faraday|
        faraday.headers['Content-Type'] = 'application/json'
        faraday.headers['Accept'] = 'application/json'
        faraday.headers['Private-Token'] = private_token
        faraday.adapter Faraday.default_adapter
      end
    end

    def get(path)
      self.response = connection.get(path)
      self
    end

    def post(&block)
      self.response = connection.post(&block)
      self
    end

    def data
      @data ||= JSON.parse(response&.body)
    end

    def success?
      response.status == success_response_code
    end

    def error_message
      return if success?

      data['message'] || data['error']
    end

    private

    attr_reader :api_url, :private_token, :success_response_code
  end
end
