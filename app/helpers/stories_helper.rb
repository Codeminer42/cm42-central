module StoriesHelper
  def story_url story
    project_url(story.project, anchor: story_anchor(story))
  end

  def story_anchor story
    dom_id(story).sub("_","-")
  end

  def state_transition_button(story, state)
    path = send("#{state}_project_story_path", story.project, story)
    button_to(state, path, method: :put, class: state)
  end

  def icon_text story
    {
      "feature" => %(<i class="mi md-star md-16">star</i>),
      "chore" => %(<i class="mi md-dark md-16">settings</i>),
      "bug" => %(<i class="mi md-bug md-16">bug_report</i>),
      "release" => %(<i class="mi md-release md-16">bookmark</i>),
    }.fetch(story.story_type).html_safe
  end

  def comment_format comment, usernames
    if comment.body.present?
      rendered = Commonmarker.to_html(comment.body, options: {
        extensions: { autolink: true },
        parse: { smart: true }
      })
      rendered.gsub!(/@(#{usernames.join("|")})/) do |match|
        %(<b class="red">#{match}</b>)
      end
      rendered.html_safe
    end
  end
end
