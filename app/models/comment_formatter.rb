require "active_support/core_ext/object/blank"
require "active_support/core_ext/string/output_safety"
require "commonmarker"

class CommentFormatter < Struct.new(:comment, :project)
  def self.call comment, project
    new(comment, project).call
  end

  def call
    if comment.body.present?
      rendered = Commonmarker.to_html(comment.body, options: {
        extensions: { autolink: true },
        parse: { smart: true },
        render: { escape: true },
      })
      rendered.gsub!(/@(#{project.usernames.join("|")})/) do |match|
        %(<b class="red">#{match}</b>)
      end
      rendered.gsub! %r{<a href="(https?://tracker\.[^/]+#{project_url}#story-(#{project.story_ids.join("|")}))">[^<]+</a>} do |match|
        story = project.stories.find($2)
        %(<a class="story-link" href="#{$1}" data-turbo="false">##{$2}: #{story.title}</a>)
      end
      rendered.html_safe
    end
  end

  private

  def project_url
    "/projects/#{project.slug}"
  end
end
