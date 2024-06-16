class ActivityPresenter < SimpleDelegator
  include Rails.application.routes.url_helpers

  attr_reader :activity

  IGNORED_FIELDS = %w[updated_at created_at owned_by_id owned_by_initials requested_by_id].freeze
  STORY_STATES_ENUM = {
    'unscheduled' => 0,
    'unstarted' => 1,
    'started' => 2,
    'finished' => 3,
    'delivered' => 4,
    'accepted' => 5,
    'rejected' => 6
  }.freeze

  def initialize(activity)
    @activity = activity
    super
  end

  def eql?(other)
    other == self || activity.eql?(other)
  end

  def description
    clause = if action == 'destroy'
               "#{subject_destroyed_type} ##{subject_changes['id']}"
             else
               return nil if subject.nil?
               "#{noun} #{predicate}".strip
             end
    "#{user.name} #{past_tense_action} #{clause}"
  end

  def to_partial_path
    "activities/#{activity.action}_#{(activity.subject_type || activity.subject_destroyed_type).downcase}"
  end

  def title
    subject&.title || subject_changes["title"] || "Story #{subject_id}"
  end

  def story_title
    subject&.story&.title
  end

  def body
    subject&.body || subject_changes["body"] || "Comment #{subject_id}"
  end

  def noun
    if story?
      subject&.story_type || subject_changes["story_type"]
    else
      subject_type.downcase
    end
  end

  def past_tense_action
    verb = action
    verb = "delete" if action == "destroy"
    verb + (verb.at(-1) == 'e' ? 'd' : 'ed')
  end

  def project?
    subject_type == "Project"
  end

  def story?
    (subject_type || subject_destroyed_type) == "Story"
  end

  def comment?
    (subject_type || subject_destroyed_type) == "Comment"
  end

  private

  delegate :helpers, to: ApplicationController

  # def noun
  #   case subject_type
  #   when 'Project'
  #     "#{subject_type} '#{helpers.link_to subject.name, project_path(subject)}'"
  #   when 'Story'
  #     path = project_path(subject.try(:project_id)) + '#story-' + subject_id.to_s
  #     "#{subject_type} ##{subject_id} - '#{helpers.link_to subject.title, path}'"
  #   when 'Comment', 'Task'
  #     name = (subject.try(:body) || subject.try(:name)).truncate(40)
  #     path = project_path(subject.story.project_id) + '#story-' + subject.story_id.to_s
  #     "#{subject_type} '#{name}' for Story '#{helpers.link_to subject.story.title, path}'"
  #   end
  # end

  def predicate
    return '' unless action == 'update'
    changes = subject_changes.keys.reject { |key| IGNORED_FIELDS.include?(key) }.map do |key|
      case key
      when 'documents_attributes' then document_changes subject_changes[key]
      when 'position'             then position_changes subject_changes[key]
      when 'state'                then state_changes subject_changes[key]
      when 'description'          then description_changes subject_changes[key]
      else
        general_changes(key, subject_changes[key])
      end
    end.join(', ')
    'changing ' + changes
  end

  def document_changes(changes)
    old_documents     = changes.first || []
    new_documents     = changes.last  || []
    added_documents   = new_documents - old_documents
    deleted_documents = old_documents - new_documents

    tmp_changes = []
    tmp_changes << "by uploading '#{added_documents.join("', '")}'"  unless added_documents.empty?
    tmp_changes << "by deleting '#{deleted_documents.join("', '")}'" unless deleted_documents.empty?
    'documents ' + tmp_changes.join(' and ')
  end

  def position_changes(changes)
    old_position = changes.first || Float::MAX
    new_position = changes.last
    if new_position > old_position
      'priority decreased'
    else
      'priority increased'
    end
  end

  def state_changes(changes)
    old_state = STORY_STATES_ENUM[changes.first || 'unscheduled']
    new_state = STORY_STATES_ENUM[changes.last]
    if old_state < new_state
      "state moved forward to #{changes.last}"
    else
      "state regressed back to #{changes.last} from #{changes.first}"
    end
  end

  def description_changes(changes)
    old_description = changes.first || ''
    new_description = changes.last  || ''
    unless old_description.empty?
      new_description = Differ.diff(new_description, old_description, ' ').format_as(:html)
    end
    "description to '#{new_description}'"
  end

  def general_changes(key, changes)
    if changes.first.blank?
      "#{key} to '#{changes.last}'"
    else
      "#{key} from '#{changes.first}' to '#{changes.last || 'empty'}'"
    end
  end
end
