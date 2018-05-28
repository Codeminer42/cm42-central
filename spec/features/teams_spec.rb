require 'feature_helper'

describe 'Teams' do
  before { sign_in user }

  context 'when user is not a team admin' do
    let!(:user) { create :user, :with_team }

    describe 'create team' do
      it 'should create a new team and set the user as admin' do
        visit teams_path
        click_link 'Create new team'

        fill_in 'Team Name', with: 'foobar'
        click_button 'Create new team'

        expect(user.teams.last.is_admin?(user)).to be_truthy
      end
    end
  end

  context 'when user is a team admin' do
    let!(:user) { create :user, :with_team_and_is_admin }

    describe 'update team' do
      it 'should update a team and set a team logo' do
        VCR.use_cassette('cloudinary_upload_team_logo') do
          visit edit_team_path(user.teams.last.slug)

          attach_file('Logo', Rails.root.join('spec', 'fixtures', 'blank.jpg'))
          click_button 'Update Team'

          expect(user.teams.last.logo).not_to be_nil
        end
      end
    end
  end

  context 'when current user is the current team admin or the root' do
    let!(:user) { create :user, :with_team_and_is_admin }

    describe 'trying to add a existing user that is not in the current team' do
      let!(:user_to_be_added) { create :user, email: 'user@example.com' }

      it 'should update the team with this user' do
        visit team_manage_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in 'email_search', with: 'user@example.com'
        click_button 'Add'

        expect(current_path).to eq(team_new_enrollment_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.team_was_successfully_updated'))
      end
    end

    describe 'trying to add an email that is not registered' do

      it 'shows an error message' do
        visit team_manage_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in 'email_search', with: 'user@example.com'
        click_button 'Add'

        expect(current_path).to eq(team_new_enrollment_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.user_not_found'))
      end
    end

    describe 'trying to add a user that is not enrolled in the current team' do
      let!(:user_to_be_added) { create :user, teams: [user.teams.first], email: 'user@example.com' }

      it 'shows a message saying that the user is already on the team' do
        visit team_manage_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in 'email_search', with: 'user@example.com'
        click_button 'Add'

        expect(current_path).to eq(team_new_enrollment_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.user_is_already_in_this_team'))
      end
    end

    describe 'archiving teams' do

      it 'successfully archive the team', js: true do
        click_button 'Teams'
        click_link 'Settings'

        accept_confirm do
          click_link 'Archive Team'
        end

        expect(page).to have_text(I18n.t('teams.successfully_archived'))
      end

      it 'moves the archived team to the archived section', js: true do
        click_button 'Teams'
        click_link 'Settings'

        accept_confirm do
          click_link 'Archive Team'
        end

        within('#main > .container') do
          within('div:nth-child(3) .teams')  do
            expect(page).to have_css('div.col-md-4.col-xs-12', count: 1)
          end
        end
      end
    end

    describe 'uncharving teams' do
      let!(:user) { create :user, :with_archived_team_and_is_admin }

      it 'successfully uncharving the team' do
        visit teams_path

        click_link 'Unarchive'

        expect(page).to have_text(I18n.t('teams.successfully_unarchived'))
      end

      it 'moves the archived team to select team section' do
          visit teams_path

          click_link 'Unarchive'

        within('#main > .container') do
          within('div:nth-child(2) .teams')  do
            expect(page).to have_css('div.col-md-4.col-xs-12', count: 1)
          end
        end
      end
    end
  end
end
