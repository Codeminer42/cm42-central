namespace :cloudinary_preset do
  desc 'create cloudinary preset'
  task :create do
    Cloudinary::Api.create_upload_preset(name: 'attachments', unsigned: true)
  end
end
  