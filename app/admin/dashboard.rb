ActiveAdmin.register_page 'Dashboard' do
  LIMIT = 15

  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t('active_admin.dashboard') } do
    columns do
      column do
        panel 'Recent Users' do
          ul do
            User.order(id: :desc).limit(LIMIT).map do |user|
              li link_to(user.email, manage_user_path(user))
            end
          end
        end
      end

      column do
        panel 'Recent Projects' do
          ul do
            Project.order(id: :desc).limit(LIMIT).map do |project|
              li link_to(project.name, manage_project_path(project))
            end
          end
        end
      end

      column do
        panel 'Info' do
          para "Total Projects: #{Project.count}"
          para "Total Active Projects: #{Project.not_archived.count}"
          para "Total Users: #{User.count}"
        end
      end
    end
  end
end
