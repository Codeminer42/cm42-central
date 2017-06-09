require 'feature_helper'

describe "Teams" do
  before { sign_in user }

  context 'when user is not a team admin' do
    let!(:user)  { create :user, :with_team }

    describe "create team" do
      it "should create a new team and set the user as admin" do
        visit teams_path
        click_link 'Create new team'

        fill_in "Team Name", with: "foobar"
        click_button 'Create new team'

        expect(user.teams.last.is_admin?(user)).to be_truthy
      end
    end
  end

  context 'when user is a team admin' do
    let!(:user)  { create :user, :with_team_and_is_admin }

    describe "update team" do
      it "should update a team and set a team logo" do
        VCR.use_cassette('cloudinary_upload_team_logo') do
          visit edit_team_path(user.teams.last.slug)

          attach_file("Logo", Rails.root.join("spec/fixtures/blank.jpg"))
          click_button 'Update Team'

          expect(user.teams.last.logo).not_to be_nil
        end
      end
    end
  end

  context 'when current user is a team admin or root' do
    describe 'try add a user existing and he is not have this team' do
      let!(:user)  { create :user, :with_team_and_is_admin }
      let!(:user_to_be_added) { create :user, email: "user@example.com"}

      it 'should update the team with this user' do
        visit team_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in "user_email", with: "user@example.com"
        click_button 'Add'

        expect(current_path).to eq(team_find_user_by_email_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.team_was_successfully_updated'))
      end
    end

    describe 'try add a user not existing' do
      let!(:user)  { create :user, :with_team_and_is_admin }

      it 'when user was not found' do
        visit team_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in "user_email", with: "user@example.com"
        click_button 'Add'

        expect(current_path).to eq(team_find_user_by_email_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.user_no_was_found'))
      end
    end

    describe 'try add a user does have this team' do
      let!(:user)  { create :user, :with_team_and_is_admin }
      let!(:user_to_be_added) { create :user, teams: [user.teams.first], email: "user@example.com"}

      it 'when user does have this team' do
        visit team_users_path(user.teams.first.slug)
        click_link 'Add'

        fill_in "user_email", with: "user@example.com"
        click_button 'Add'

        expect(current_path).to eq(team_find_user_by_email_path(user.teams.first.slug))
        expect(page).to have_text(I18n.t('teams.user_is_already_in_this_team'))
      end
    end
  end
end
