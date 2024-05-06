require 'feature_helper'

describe 'Projects' do
  context 'when logged in', js: true do
    context 'as non-admin' do
      let(:user) { create :user }

      describe 'unjoin project' do
        let!(:project) { create :project, users: [user] }

        before do
          sign_in user
        end

        xit 'leaves a project' do
          visit projects_path

          within '.project-item' do
            find('label', text: "settings").click

            click_on 'Leave project'
          end

          expect(user.projects.count).to eq(0)
        end
      end

      describe 'archivement' do
        before { visit edit_project_path(project) }

        context 'with a non archived project' do
          let(:project) { create :project, users: [user] }

          scenario 'there is no button' do
            expect(page).not_to have_link('Archive')
            expect(page).not_to have_link('Unarchive')
          end
        end

        context 'with an archived project' do
          let(:project) { create :project, :archived, users: [user] }

          scenario 'there is no button' do
            expect(page).not_to have_link('Archive')
            expect(page).not_to have_link('Unarchive')
          end
        end
      end
    end

    context 'as admin' do
      before(:each) do
        sign_in user
      end

      let(:user) do
        create :user, :admin, email: 'user@example.com', password: 'password'
      end
      let(:tag_group) { create :tag_group }

      describe 'list projects' do
        before do
          p1 = create :project, name: 'Test Project',
                                users: [user],
                                tag_group: tag_group
          p2 = create :project, name: 'Archived Project',
                                users: [user],
                                archived_at: Time.current

          visit projects_path
        end

        it 'shows the project list' do
          expect(page).to have_selector('.navbar', text: 'New Project')
          expect(page).to have_selector('.navbar', text: 'Tag Groups')

          within('#projects') do
            click_on 'Test Project'
          end

          expect(page).not_to have_selector('h1', text: 'Archived Project')
        end

        xit 'shows the tag name of each project if it has' do
          expect(page).to have_selector('small', text: 'MY-TAG')
        end
      end

      describe 'create project' do
        it 'creates a project' do
          visit projects_path
          click_on 'New Project'

          fill_in 'Name', with: 'New Project'
          click_on 'Create Project'

          expect(current_path).to eq(project_path(Project.find_by(name: 'New Project')))
        end
      end

      describe 'edit project' do
        let!(:project) do
          create :project, name: 'Test Project',
                           users: [user],
                           tag_group: tag_group
        end

        it 'edits a project' do
          visit project_path(project.slug)
          click_on 'Settings'
          fill_in 'Name', with: 'New Project Name'
          expect(page).to have_unchecked_field 'Send reports via mail'
          click_on 'Update Project'

          expect(current_path).to eq(project_path(project))
        end

        it 'disables tasks' do
          visit project_path(project.slug)
          click_on 'Settings'
          uncheck 'Enable tasks'
          click_on 'Update Project'

          expect(current_path).to eq(project_path(project))
        end

        describe 'trying to add a existing user that is not in the current project' do
          let!(:user_to_be_added) { create :user, email: 'x@example.com' }

          it 'should update the project with this user' do
            visit project_users_path(project.slug)

            fill_in 'Email', with: 'x@example.com'
            click_button 'Add user'

            expect(current_path).to eq(project_users_path(project.slug))
            expect(page).to have_text(
              I18n.t('users.was added to this project', email: user_to_be_added.email)
            )
          end
        end

        describe 'trying to add a user that is already a member in the current project' do
          let!(:user) { create :user, :admin }
          let!(:user_to_be_added) do
            create :user, email: 't@example.com'
          end
          let!(:project_to_be_associate) do
            create :project,  name: 'Test Project 2',
                              users: [user_to_be_added]
          end

          it 'shows a message saying that the user is already on the project' do
            visit project_users_path(project_to_be_associate.slug)

            fill_in 'Email', with: 't@example.com'
            click_button 'Add user'

            expect(current_path).to eq(project_users_path(project_to_be_associate.slug))
            expect(page).to have_text(
              I18n.t('users.is already a member of this project', email: user_to_be_added.email)
            )
          end
        end

        describe 'trying to add an email that is not registered' do
          let!(:user) { create :user, :admin }

          let!(:project_to_be_associate) do
            create :project,  name: 'Test Project 2', users: [user]
          end

          it 'shows an error message' do
            visit project_users_path(project_to_be_associate.slug)

            fill_in 'Email', with: 'x@example.com'
            click_button 'Add user'

            expect(page).to have_text("x@example.com was not found")
          end
        end

        it 'shows form errors' do
          visit project_path(project.slug)
          click_on 'Settings'
          fill_in 'Name', with: ''
          click_on 'Update Project'

          expect(page).to have_content("Name can't be blank")
        end
      end

      describe 'delete project' do
        let!(:project) do
          create :project, name: 'Test Project',
                           users: [user]
        end

        before(:each) do
          visit edit_project_path(project)
          find('#delete-project-confirm').click
        end

        it 'shows delete confirmation modal' do
          expect(page).to have_css('#delete-confirmation-modal')
        end

        it 'deletes a project' do
          fill_in 'name_confirmation',	with: project.name
          click_on 'Delete'

          expect(Project.count).to eq(0)
        end

        it 'disable button when project name is invalid' do
          fill_in 'name_confirmation',	with: "wrong#{project.name}"

          expect(page).to have_button('Delete', disabled: true)
        end
      end

      describe 'archivement' do
        before do
          visit edit_project_path(project)
        end

        context 'when project is not archived' do
          let(:project) { create :project, users: [user] }

          scenario 'archives a project' do
            accept_alert do
              click_on 'Archive'
            end

            expect(page).to have_text('Project was successfully archived')
          end
        end

        context 'when project is archived' do
          let(:project) { create :project, :archived, users: [user] }

          scenario 'unarchives a project' do
            accept_alert do
              click_on 'Unarchive'
            end

            expect(page).to have_text('Project was successfully reinstated')
          end
        end
      end
    end
  end
end
