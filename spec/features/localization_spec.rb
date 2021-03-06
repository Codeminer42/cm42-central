require 'feature_helper'

describe 'localization' do
  before(:each) do
    sign_in user
  end

  after do
    I18n.locale = :en
  end

  let(:user) do
    create :user, :with_team_and_is_admin,
           email: 'user@example.com',
           password: 'password'
  end

  let(:current_user) { user }

  describe 'user profile' do
    it 'lets user change their locale', js: true do
      change_locale_to 'pt-BR'

      current_user.reload
      expect(current_user.locale).to eq('pt-BR')
    end
  end

  def change_locale_to(new_locale)
    visit edit_user_registration_path

    select new_locale, from: 'Locale'
    fill_in 'Current password', with: 'password'

    click_on 'Update'
  end

  describe 'application' do
    it 'sets the locale based on the user locale', js: true do
      change_locale_to 'es'

      visit root_path

      expect(page).to have_selector('.navbar', text: 'Nuevo Proyecto')
    end
  end
end
