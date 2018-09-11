require 'feature_helper'

describe 'Logins' do
  let!(:user) do
    create :user, :with_team_and_is_admin,
           email: 'user@example.com',
           password: 'password',
           name: 'Test User',
           locale: 'en',
           time_zone: 'Brasilia'
  end

  describe 'disable registration' do
    before do
      Configuration.for('fulcrum') do
        disable_registration true
      end
    end

    after do
      Configuration.for('fulcrum') do
        disable_registration false
      end
    end

    it 'removes the sign up link' do
      visit root_path
      expect(page).to have_selector('span', text: 'Log in')

      expect(page).not_to have_selector('a', text: 'Sign up')
    end
  end

  describe 'successful login' do
    context 'when user has one team' do
      it 'logs in the user' do
        visit root_path
        fill_in 'Email',    with: 'user@example.com'
        fill_in 'Password', with: 'password'
        click_button 'Sign in'

        expect(page).to have_selector('.user-dropdown', text: 'Test User')
      end
    end

    context 'when user has multiples teams' do
      let(:another_team) { create :team }

      before { user.teams << another_team }

      it 'logs in the user' do
        visit root_path
        fill_in 'Email',    with: 'user@example.com'
        fill_in 'Password', with: 'password'
        click_button 'Sign in'

        expect(page).to have_selector('span', text: I18n.t('teams.switch')) &
                        have_selector('.user-dropdown', text: 'Test User')
      end
    end

    context "when user hasn't any teams" do
      before { user.teams.destroy(user.teams.first.id) }

      it 'logs in the user' do
        visit root_path
        fill_in 'Email', with: 'user@example.com'
        fill_in 'Password', with: 'password'

        click_button 'Sign in'

        expect(page)
          .to have_selector('span', text: I18n.t('teams.switch')) &
              have_selector('.user-dropdown', text: 'Test User') &
              have_selector('.simple-alert', text: "Oops! You're not enrolled to a team yet.")
      end
    end

    describe '2 Factor Auth' do
      context "when account wasn't enabled yet" do
        before { user.update authy_enabled: true }

        it 'redirects to enable authy page', js: true do
          visit root_path
          expect(page).to have_selector('span', text: 'Log in')

          fill_in 'Email',     with: 'user@example.com'
          fill_in 'Password',  with: 'password'
          click_button 'Sign in'
          expect(page).to have_selector('h2', text: I18n.t('authy_register_title', scope: 'devise'))
        end
      end

      context 'when account was already enabled' do
        before do
          user.update authy_enabled: true, authy_id: '12345', last_sign_in_with_authy: Time.current
        end

        it 'redirects to verify token page', js: true do
          visit root_path
          expect(page).to have_selector('span', text: 'Log in')

          fill_in 'Email',     with: 'user@example.com'
          fill_in 'Password',  with: 'password'
          click_button 'Sign in'

          expect(page)
            .to have_selector('legend', text: I18n.t('submit_token_title', scope: 'devise'))
        end
      end
    end
  end

  describe 'successful logout', js: true do
    before do
      sign_in user
    end

    it 'logs out the user' do
      visit root_path
      trigger '.user-dropdown', 'click'
      click_on 'Log out'

      expect(page).to have_selector('span', text: 'Log in')
    end
  end
end
