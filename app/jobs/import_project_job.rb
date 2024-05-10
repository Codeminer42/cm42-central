class ImportProjectJob < ActiveJob::Base
  def perform(pivotal_project_id)
    @pivotal_project = PivotalProject.find(pivotal_project_id)
    @base_url = "/projects/#{pivotal_project_id}"
    @project = @pivotal_project.project || @pivotal_project.build_project
    @attachments = RestClient::Resource.new("https://www.pivotaltracker.com", headers: { "X-TrackerToken" => Rails.application.credentials.pivotal_tracker_api_token })

    sync_data

    # Do not send any email notifications during the import process
    @project.suppress_notifications = true

    import_project
    import_members
    import_stories
    import_tasks
    import_comments
    import_attachments
    import_activities

    @project.touch
  end

  private

  attr_reader :pivotal_project, :project, :base_url, :attachments

  def sync_data
    response = PivotalAPI::Client.get(base_url)

    project_attributes = fetch(base_url, paginate: false)
    memberships_attributes = fetch(base_url + "/memberships", paginate: false)
    labels_attributes = fetch(base_url + "/labels", paginate: false)
    stories_attributes = fetch(base_url + "/stories?fields=:default,description,blockers,tasks,comments(:default,attachments,reactions)")
    activities_attributes = fetch(base_url + "/activity")

    pivotal_project.update!({
      project_attributes:,
      memberships_attributes:,
      labels_attributes:,
      stories_attributes:,
      activities_attributes:,
    })
  end

  def import_project
    attrs = pivotal_project.project_attributes
    project.update!({
      name: attrs.fetch("name"),
      point_scale: "pivotal",
      start_date: attrs.fetch("start_time"),
      created_at: attrs.fetch("created_at"),
    })
  end

  def import_members
    pivotal_project.memberships_attributes.each do |attrs|
      person = attrs.fetch("person")
      user = User.where(email: person.fetch("email")).first_or_initialize

      # handle confirmation manually later
      def user.confirmation_required? = false
      def user.send_confirmation_notification? = false

      user.update!({
        pivotal_id: person.fetch("id"),
        name: person.fetch("name"),
        initials: person.fetch("initials"),
        username: person.fetch("username"),
      })
      project.users << user unless project.users.include?(user)
    end
  end

  def import_stories
    pivotal_project.stories_attributes.each do |attrs|
      story = Story.where(pivotal_id: attrs.fetch("id")).first_or_initialize

      owners = attrs.fetch("owner_ids").map do |pivotal_id|
        project.users.find_by(pivotal_id: pivotal_id)
      end

      labels = attrs.fetch("labels").map do |label|
        label.fetch("name")
      end

      story.update!({
        project: project,
        title: attrs.fetch("name"),
        description: attrs["description"],
        estimate: attrs["estimate"],
        state: attrs.fetch("current_state"),
        story_type: attrs.fetch("story_type"),
        requested_by: project.users.find_by(pivotal_id: attrs.fetch("requested_by_id")),
        owned_by: owners[0],
        labels: labels.join(", "),
        blockers: attrs.fetch("blockers"),
        created_at: attrs.fetch("created_at"),
        updated_at: attrs.fetch("updated_at"),
        accepted_at: attrs["accepted_at"],
        started_at: attrs["started_at"],
        delivered_at: attrs["delivered_at"],
      })
    end
  end

  def import_tasks
    pivotal_project.tasks_attributes.each do |attrs|
      task = Task.where(pivotal_id: attrs.fetch("id")).first_or_initialize
      story = project.stories.find_by!(pivotal_id: attrs.fetch("story_id"))
      task.update!({
        story:,
        name: attrs.fetch("description"),
        done: attrs.fetch("complete"),
        position: attrs.fetch("position"),
        created_at: attrs.fetch("created_at"),
      })
    end
  end

  def import_comments
    pivotal_project.comments_attributes.each do |attrs|
      note = Note.where(pivotal_id: attrs.fetch("id")).first_or_initialize
      user = project.users.find_by(pivotal_id: attrs.fetch("person_id"))
      story = project.stories.find_by!(pivotal_id: attrs.fetch("story_id"))
      note.attributes = {
        note: attrs["text"],
        user:,
        story:,
        reactions: attrs.fetch("reactions"),
        created_at: attrs.fetch("created_at"),
      }
      note.save(validate: false) # allow note to be blank in case of attachments
    end
  end

  def import_attachments
    pivotal_project.attachments_attributes.each do |attrs|
      note = Note.find_by!(pivotal_id: attrs.fetch("comment_id"))
      attachment = ActiveStorage::Attachment.find_by({
        name: "attachments",
        record: note,
        pivotal_id: attrs.fetch("id"),
      })
      next if attachment

      response = attachments[attrs["download_url"]].get

      attachment = note.attachments.attach(
        io: StringIO.new(response.body),
        filename: attrs.fetch("filename"),
        content_type: attrs.fetch("content_type"),
      )
      note.save(validate: false)
      note.attachments_attachments.last.update!({
        created_at: attrs.fetch("created_at"),
        pivotal_id: attrs.fetch("id"),
      })
    end
  end

  def import_activities
    pivotal_project.activities_attributes.each do |attrs|
      activity = Activity.where(pivotal_id: attrs.fetch("guid")).first_or_initialize
      user = User.find_by(pivotal_id: attrs.fetch("performed_by").fetch("id"))

      primary_resource = attrs.fetch("primary_resources")[0]
      subject_class_name = primary_resource.fetch("kind").classify
      subject_class = subject_class_name.constantize rescue nil
      if subject_class.nil?
        # puts "Can't find class #{subject_class_name}"
        next
      end

      subject = subject_class.find_by(pivotal_id: primary_resource.fetch("id"))
      if subject.nil?
        # puts "Can't find Story with id #{primary_resource.fetch("id")}"
        next
      end

      changes = attrs.fetch("changes").first
      keys = changes.fetch("new_values").keys
      subject_changes = keys.inject({}) do |hash, key|
        hash.merge key => [
          changes.fetch("original_values", {})[key],
          changes.fetch("new_values")[key],
        ]
      end

      action = case attrs.fetch("highlight")
        when "created" then "create"
        when "destroyed" then "destroy"
        else "update"
      end

      activity.update!({
        project:,
        user:,
        subject:,
        subject_changes:,
        # subject_destroyed_type:,
        action:,
        created_at: attrs.fetch("occurred_at"),
      })
    end
  end

  private

  def fetch url, paginate: true, offset: 0
    return JSON.parse(PivotalAPI::Client.get(url)) if !paginate

    parameterized_url = url
    parameterized_url += url.include?("?") ? "&" : "?"
    parameterized_url += "envelope=true"
    parameterized_url += "&offset=#{offset}"

    response = PivotalAPI::Client.get(parameterized_url)
    json = JSON.parse(response.body)

    total, offset, limit, returned = *json["pagination"].values_at(*%w[total offset limit returned])

    if total > limit && returned == limit
      json["data"] + fetch(url, offset: offset + limit)
    else
      json["data"]
    end
  end
end


