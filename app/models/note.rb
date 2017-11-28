class Note < ApplicationRecord
  belongs_to :user
  belongs_to :story

  before_save :cache_user_name
  before_destroy { |record| raise ActiveRecord::ReadOnlyRecord if record.readonly? }

  validates :note, presence: true

  delegate :project, to: :story

  # Defines the attributes and methods that are included when calling to_json
  def as_json(_options = {})
    super(methods: ['errors'])
  end

  def to_s
    user_name = user ? user.name : I18n.t('author unknown')
    created_date = I18n.l created_at, format: :note_date

    "#{note} (#{user_name} - #{created_date})"
  end

  delegate :readonly?, to: :story

  private

  def cache_user_name
    self.user_name = user.name if user.present?
  end
end
