class NoAnimations
  def initialize(app, options = {})
    @app = app
  end

  def call(env)
    @status, @headers, @body = @app.call(env)
    return [@status, @headers, @body] unless html?
    response = Rack::Response.new([], @status, @headers)

    @body.each { |fragment| response.write inject(fragment) }
    @body.close if @body.respond_to?(:close)

    response.finish
  end

  private

  def html?
    @headers["Content-Type"] =~ /html/
  end

  def inject(fragment)
    disable_animations = <<-EOF
      <script type="text/javascript">(typeof jQuery !== 'undefined') && (jQuery.fx.off = true);</script>
      <style>
        * {
           -o-transition: none !important;
           -moz-transition: none !important;
           -ms-transition: none !important;
           -webkit-transition: none !important;
           transition: none !important;
           -o-transform: none !important;
           -moz-transform: none !important;
           -ms-transform: none !important;
           -webkit-transform: none !important;
           transform: none !important;
           -webkit-animation: none !important;
           -moz-animation: none !important;
           -o-animation: none !important;
           -ms-animation: none !important;
           animation: none !important;
        }
      </style>
    EOF
    fragment.gsub(%r{</head>}, disable_animations + "</head>")
  end
end
