class Notifications < ActionMailer::Base
  def new_story(story, actor)
    @story = story
    @actor = actor

    emails = story.project.users.where.not(id: actor.id).pluck(:email)

    mail({
      to: emails.first,
      bcc: emails[1..],
      subject: subject_for(story),
    }) if emails.any?
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

  def new_note(note, emails)
    @note = note
    @story = note.story

    mail({
      to: emails.first,
      bcc: emails[1..],
      subject: subject_for(@story),
    })
  end

  def story_mention(story, emails)
    @story = story

    mail({
      to: emails.first,
      bcc: emails[1..],
      subject: subject_for(story),
    })
  end

  def archived_team(team)
    @team = team
    emails = @team.users.pluck(:email)

    mail({
      to: emails.first,
      bcc: emails[1..],
      subject: "The team <#{@team.name}> was archived",
    })
  end

  private

  def subject_for story
    "[#{story.project.name}] #{story.title}"
  end
end
