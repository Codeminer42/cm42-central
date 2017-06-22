class Admin::UserPresenter < SimpleDelegator
  include Rails.application.routes.url_helpers
  include ActionView::Helpers
  include ActionView::Helpers::TranslationHelper
  include ActionView::Context

  TRANSLATION_SCOPE = 'admin.users.index'.freeze

  def initialize(user)
    @user = user
    super(@user)
  end

  def toggle_admin_button(is_admin)
    is_admin ? admin_button : user_button
  end

  def admin_button
    html_button(btn_text: t('users.admin_off'),
                btn_class: 'btn-warning',
                is_admin: false,
                confirm_message: t('are you sure you want to remove administration rights from this user', scope: TRANSLATION_SCOPE))
  end

  def user_button
    html_button(btn_text: t('users.admin_on'),
                btn_class: 'btn-primary',
                is_admin: true,
                confirm_message: t('are you sure you want to give administration rights to this user', scope: TRANSLATION_SCOPE))
  end

  def html_button(btn_text:, is_admin:, btn_class:, confirm_message:)
    link_to btn_text, enrollment_admin_user_path(@user, is_admin: is_admin),
            class: "btn btn-sm btn-square #{btn_class}",
            data: { confirm: confirm_message },
            method: :patch
  end
end
