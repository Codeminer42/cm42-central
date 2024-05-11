class ProjectPresenter < SimpleDelegator
  include Rails.application.routes.url_helpers
  include ActionView::Helpers::NumberHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TextHelper
  include UsersHelper

  def truncate_name
    truncate(name, length: 18)
  end

  def users_avatar(amount)
    users.first(amount).map do |user|
      Rails.cache.fetch "user/#{user.email}/avatar", expires_in: 1.hour do
        avatar_url(user)
      end
    end
  end

  def archived_date
    I18n.l(archived_at, format: :note_date) if archived_at
  end

  def path_to
    {
      project: "/projects/#{slug}",
      projectReports: "/projects/#{slug}/reports",
      projectUsers: "/projects/#{slug}/users",
      projectSettings: "/projects/#{slug}/edit",
      projectJoin: "/projects/#{slug}/join",
      projectUnjoin: "/projects/#{slug}/users/"
    }
  end

  def self.from_collection(collection)
    collection.map { |item| new(item) }
  end
end
