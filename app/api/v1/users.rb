class V1::Users < Grape::API
  before do
    authenticate!

    @allowed_users = current_team&.users || User.all
  end

  desc 'Return all users', tags: ['user']
  params do
    optional :created_at, type: DateTime
  end
  paginate
  get '/users/' do
    users = @allowed_users.recently_created(params[:created_at])

    present paginate(users), with: Entities::User
  end
end
