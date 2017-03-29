class ProjectPresenter < SimpleDelegator
  include Rails.application.routes.url_helpers
  include ActionView::Helpers::NumberHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TextHelper
  include UsersHelper

  def truncate_name
    truncate(name, length: 18)
  end

  def tag_fore_color
    bg_color = tag_group&.bg_color
    bg_color && RGBUtils::SimpleContrastColorResolver.for(bg_color)
  end

  def velocity
    iteration_service(since: 1.month.ago).velocity
  end

  def volatility
    number_to_percentage(iteration_service(since: 1.month.ago).volatility * 100.0, precision: 0)
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
    collection.map { |item| self.new(item) }
  end
end
