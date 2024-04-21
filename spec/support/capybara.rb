require 'capybara/rspec'
require 'capybara-screenshot/rspec' unless ENV["CI"]
require "capybara/cuprite"

Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(app, {
    window_size: [1200, 2048],
    timeout: 20,
    js_errors: true,
    inspector: !ENV["CI"],
    logger: FerrumLogger.new,
    # headless: false,
  })
end

class FerrumLogger
  def puts(log_str)
    _log_symbol, _log_time, log_body_str = log_str.strip.split(' ', 3)

    return if log_body_str.nil?

    log_body = JSON.parse(log_body_str)

    case log_body['method']
    when 'Runtime.consoleAPICalled'
      log_body['params']['args'].each do |arg|
        case arg['type']
        when 'string'
          Kernel.puts arg['value']
        when 'object'
          Kernel.puts arg['preview']['properties'].map { |x| [x["name"], x["value"]] }.to_h
        end

      end

    when 'Runtime.exceptionThrown'
      # noop, this is already logged because we have "js_errors: true" in cuprite.

    when 'Log.entryAdded'
      Kernel.puts "#{log_body['params']['entry']['url']} - #{log_body['params']['entry']['text']}"
    end
  end
end

Capybara.server = :puma, { Silent: true }
Capybara.default_driver = :cuprite
Capybara.javascript_driver = :cuprite

Capybara.default_normalize_ws = true
# FIXME push upstream
Capybara::Node::Element.prepend Module.new {
  def text type = nil, normalize_ws: nil
    normalize_ws = true if Capybara.default_normalize_ws = true
    super
  end
}
