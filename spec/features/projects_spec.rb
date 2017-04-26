require 'feature_helper'

describe "Projects" do
  context "when logged in" do

    context "as non-admin" do
      let(:user) { create :user, :with_team }
      let(:current_team) { user.teams.first }

      describe "join project" do
        let(:project) { create :project, disallow_join: false }

        before do
          create :ownership, team: current_team, project: project
          sign_in user
        end

        it "joins a project", js: true do
          visit projects_path

          within ".project-item" do
            click_on 'Join project'
          end

          expect(user.projects.count).to eq(1)
        end
      end

      describe "unjoin project" do
        let(:project) { create :project, users: [user] }

        before do
          create :ownership, team: current_team, project: project
          sign_in user
        end

        it "leaves a project", js: true do
          visit projects_path

          within ".project-item" do
            find('a[data-toggle="dropdown"]').click

            click_on 'Leave project'
          end

          expect(user.projects.count).to eq(0)
        end
      end
    end

    context "as admin" do
      before(:each) do
        sign_in user
      end

      let(:user) { create :user, :with_team_and_is_admin, email: 'user@example.com', password: 'password' }
      let(:team) { user.teams.first }
      let(:tag_group) {create :tag_group }

      describe "list projects" do

        before do
          p1 = create :project, name: 'Test Project',
                                users: [user],
                                tag_group: tag_group
          p2 = create :project, name: 'Archived Project',
                                users: [user],
                                archived_at: Time.current
          team.ownerships.create(project: p1, is_owner: true)
          team.ownerships.create(project: p2, is_owner: true)
          team.tag_groups << tag_group

          visit projects_path
        end

        it "shows the project list", js: true do
          expect(page).to have_selector('.navbar', text: 'New Project')
          expect(page).to have_selector('.navbar', text: 'Tag Groups')

          within('#projects') do
            click_on 'Test Project'
          end

          expect(page).not_to have_selector('h1', text: 'Archived Project')
        end

        it "shows the tag name of each project if it has", js: true do
           expect(page).to have_selector('small', text: 'MY-TAG')
        end
      end

      describe "create project" do

        it "creates a project", js: true do
          visit projects_path
          click_on 'New Project'

          fill_in 'Name', with: 'New Project'
          click_on 'Create Project'

          expect(current_path).to eq(project_path(Project.find_by_name('New Project')))
        end

      end

      describe "edit project" do

        let!(:project) {
          create :project,  name: 'Test Project',
                            users: [user],
                            teams: [user.teams.first]
        }

        before do
          team.tag_groups << tag_group
        end

        it "edits a project", js: true do
          visit projects_path

          within('.project-item') do
            find('a[data-toggle="dropdown"]').click

            click_on 'Settings'
          end

          fill_in 'Name', with: 'New Project Name'
          select tag_group.name, :from => "project_tag_group_id"
          click_on 'Update Project'

          expect(current_path).to eq(project_path(project))
        end

        it "shows form errors", js: true do
          visit projects_path

          within('.project-item') do
            find('a[data-toggle="dropdown"]').click

            click_on 'Settings'
          end

          fill_in 'Name', with: ''
          click_on 'Update Project'

          expect(page).to have_content("Name can't be blank")
        end

        describe "modal" do
          it "creates a new tag group", js: true do
            visit projects_path

            within('.project-item') do
              find('a[data-toggle="dropdown"]').click

              click_on 'Settings'
            end

            fill_in 'Name', with: 'New Project Name'
            select tag_group.name, :from => "project_tag_group_id"

            find('#submit_tag_group').click()
            fill_in 'tag_group[name]', with: 'foo_tag_name'
            click_on 'Create Tag group'

            expect(current_path).to eq(edit_project_path(project))
            expect(page).to have_select("project_tag_group_id", with_options: [tag_group.name, 'foo_tag_name'])
          end

          it "shows form errors", js: true do
            visit projects_path

            within('.project-item') do
              find('a[data-toggle="dropdown"]').click

              click_on 'Settings'
            end

            fill_in 'Name', with: ''

            find('#submit_tag_group').click()
            click_on 'Create Tag group'
            expect(page).to have_content("can't be blank")
          end
        end
      end

      describe "delete project" do

        let!(:project) {
          create :project, name: 'Test Project',
                           users: [user]
        }

        before do
          team.ownerships.create(project: project, is_owner: true)
        end

        it "deletes a project" do
          visit edit_project_path(project)
          click_on 'Delete'

          expect(Project.count).to eq(0)
        end
      end

      describe "share/transfer project" do

        let!(:another_admin) { create :user, :with_team_and_is_admin }
        let!(:another_team) { another_admin.teams.first }

        let!(:project) {
          create :project, name: 'Test Project',
                           users: [user]
        }

        before do
          team.ownerships.create(project: project, is_owner: true)
        end

        it "shares and unshares a project" do
          visit edit_project_path(project)

          within('.share-project') do
            fill_in "Slug", with: another_team.slug
            click_on 'Share'
          end

          another_team_elem = page.find('.share-project table tr:first-child td:first-child')
          expect(another_team_elem.text).to eq(another_team.name)

          within('.share-project') do
            click_on "Unshare"

            expect(page).to_not have_selector('.share-project table')
          end
        end

        it "transfers a project" do
          visit edit_project_path(project)

          within('.transfer-project') do
            fill_in "Slug", with: another_team.slug
            click_on 'Transfer'
          end

          expect(page).to have_text(I18n.t('projects.project was successfully transferred'))
        end
      end
    end
  end
end
