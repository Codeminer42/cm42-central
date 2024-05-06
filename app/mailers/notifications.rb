class Notifications < ActionMailer::Base
  def new_story(email, story, actor)
    @story = story
    @actor = actor

    mail({
      to: email,
      subject: subject_for(story),
    })
  end

  def story_changed(story, actor)
    @story = story
    @actor = actor

    to_map = {
      started: story.requested_by.email,
      delivered: story.requested_by.email,
      accepted: story.owned_by.email,
      rejected: story.owned_by.email,
    }

    if to = to_map[story.state.to_sym]
      mail({
        to: to,
        template_name: story.state,
        subject: subject_for(story),
      })
    end
  end

  def new_story_owner(story, actor)
    @story = story
    @actor = actor

    mail({
      to: story.owned_by.email,
      subject: subject_for(story),
    })
  end

  def new_note(email, note)
    @note = note
    @story = note.story

    mail({
      to: email,
      subject: subject_for(@story),
    })
  end

  def story_mention(email, story)
    @story = story

    mail({
      to: email,
      subject: subject_for(story),
    })
  end

  private

  def subject_for story
    "[#{story.project.name}] #{story.title}"
  end
end
