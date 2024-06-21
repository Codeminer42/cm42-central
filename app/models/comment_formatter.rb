require "active_support/core_ext/object/blank"
require "active_support/core_ext/string/output_safety"
require "commonmarker"

class CommentFormatter < Struct.new(:comment)
  def self.call comment
    new(comment).call
  end

  def call
    if comment.body.present?
      rendered = Commonmarker.to_html(comment.body, options: {
        extensions: { autolink: true },
        parse: { smart: true }
      })
      rendered.gsub!(/@(#{project.usernames.join("|")})/) do |match|
        %(<b class="red">#{match}</b>)
      end
      rendered.gsub!(/#\d+/) do |match|
        %(<a class="story-link" href="#{project_url}#story-#{match[1..]}">#{match}</a>)
      end
      rendered.html_safe
    end
  end

  private

  def project
    comment.project
  end

  def project_url
    "/projects/#{project.slug}"
  end
end
