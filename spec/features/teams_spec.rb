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
end
