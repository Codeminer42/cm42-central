require 'rails_helper'

RSpec.describe V1::Users do
  let(:api_token) { create :api_token }

  describe '#GET /api/v1/users' do

    context 'when api token is invalid' do
      let(:api_token) { double :api_token, token: 'foo' }

      it 'returns a authorization error' do
        get '/api/v1/users', api_key: api_token.token

        expect(response.body).to match(/Invalid token/)
      end
    end

    context 'when api token is linked with a team' do
      let(:user_1) { create :user, name: 'new_user_1', created_at: 1.hour.ago }
      let(:user_2) { create :user, name: 'new_user_2', created_at: 1.hour.ago }
      let(:some_team) { create :team, users: [user_1] }
      let(:api_token) { create :api_token, team: some_team }  

      it 'returns only the users associated with current team' do
        get '/api/v1/users', api_key: api_token.token

        user_name = JSON.parse(response.body).map{ |u| u['name'] } 
        expect(user_name).to contain_exactly('new_user_1')
      end
    end

    context 'when fetching' do
      before do
        create :user, name: 'new_user_1', created_at: 2.days.ago
        create :user, name: 'new_user_2', created_at: 3.days.ago
        create :user, name: 'new_user_3', created_at: 1.hour.ago
        create :user, name: 'new_user_4', created_at: 1.hour.ago
        create :user, name: 'new_user_5', created_at: 4.hour.ago
      end

      it 'return all users' do
        get '/api/v1/users', api_key: api_token.token

        expect(JSON.parse(response.body).count).to eq(5)
      end

      it 'accepts pagination' do
        get '/api/v1/users', per_page: 2, api_key: api_token.token

        expect(JSON.parse(response.body).count).to eq(2)
      end

      it 'filter by created_at' do
        get '/api/v1/users', created_at: 1.day.ago, api_key: api_token.token

        users_name = JSON.parse(response.body).map{ |u| u['name'] } 
        expect(users_name).to contain_exactly('new_user_3', 'new_user_4', 'new_user_5')
      end
    end
  end
end
