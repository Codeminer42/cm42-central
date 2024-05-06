require 'feature_helper'

describe 'Logins' do
  let!(:user) do
    create :user, :admin,
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

  describe 'successful login', js: true do
    context 'when user has one project' do
      before { user.projects << create(:project) }

      it 'logs in the user' do
        visit root_path
        fill_in 'Email',    with: 'user@example.com'
        fill_in 'Password', with: 'password'
        click_button 'Log in'

        expect(page).to_not have_selector('.projects-dropdown', text: "Project")
        expect(page).to have_selector('.user-dropdown', text: 'Test User')
      end
    end

    context 'when user has multiples projects' do
      before do
        user.projects << create(:project)
        user.projects << create(:project)
      end

      it 'logs in the user' do
        visit root_path
        fill_in 'Email',    with: 'user@example.com'
        fill_in 'Password', with: 'password'
        click_button 'Log in'

        expect(page).to have_selector('.projects-dropdown', text: "Project") &
                        have_selector('.user-dropdown', text: 'Test User')
      end
    end

    context "when user hasn't any projects" do
      it 'logs in the user' do
        visit root_path
        fill_in 'Email', with: 'user@example.com'
        fill_in 'Password', with: 'password'

        click_button 'Log in'

        expect(page).to_not have_selector('.projects-dropdown', text: "Project")
        expect(page)
          .to have_selector('.user-dropdown', text: 'Test User') &
              have_selector('.simple-alert', text: "You're not enrolled to a project yet.")
      end
    end
  end

  describe 'successful logout', js: true do
    before do
      sign_in user
    end

    it 'logs out the user' do
      visit root_path
      find('.user-dropdown').click
      click_on 'Log out'

      expect(page).to have_selector('span', text: 'Log in')
    end
  end
end
