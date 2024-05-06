class PivotalProject < ActiveRecord::Base
  has_one :project, foreign_key: :pivotal_id

  def self.refresh
    PivotalAPI::Projects.retrieve.map do |api_project|
      response = PivotalAPI::Client.get("/projects/#{api_project.id}/memberships")
      json_memberships = JSON.parse(response, symbolize_names: true)
      users_attributes = json_memberships.map do |json_membership|
        json_membership[:person]
      end
      where(id: api_project.id).first_or_create!.update!({
        name: api_project.name,
        users_attributes: users_attributes,
      })
    end
  end

  serialize :users_attributes, type: Array, coder: JSON
  def users
    users_attributes.map do |attributes|
      User.new(attributes)
    end
  end

  class User
    include ActiveModel::Model
    include Gravtastic
    gravtastic default: 'identicon'

    attr_accessor :id, :name, :initials, :email, :username, :kind
  end

  def import!
    ImportProjectJob.perform_later(id)
  end

  def imported_members
    project&.users || []
  end

  def imported_labels
    []
  end

  def imported_stories
    project&.stories || []
  end

  def tasks_attributes
    stories_attributes.flat_map do |attrs|
      attrs["tasks"]
    end
  end

  def imported_tasks
    return [] unless project
    project.stories.includes(:tasks).flat_map(&:tasks)
  end

  def comments_attributes
    stories_attributes.flat_map do |attrs|
      attrs["comments"]
    end
  end

  def imported_comments
    project&.notes || []
  end

  def attachments_attributes
    stories_attributes.flat_map do |attrs|
      attrs["comments"].flat_map do |comment_attrs|
        comment_attrs["attachments"].map do |attachment_attrs|
          attachment_attrs.merge({
            "comment_id" => comment_attrs["id"],
          })
        end
      end
    end
  end

  def imported_attachments
    project&.attachments_attachments || []
  end

  def imported_activities
    project&.activities || []
  end

  serialize :project_attributes, type: Hash, coder: JSON
  serialize :memberships_attributes, type: Array, coder: JSON
  serialize :labels_attributes, type: Array, coder: JSON
  serialize :stories_attributes, type: Array, coder: JSON
  serialize :activities_attributes, type: Array, coder: JSON
end
