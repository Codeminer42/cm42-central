require 'rails_helper'

describe ProjectSerializer do
  let(:user) { create :user, :with_team, email: 'foobar@example.com' }

  before { create :project, name: 'Test Project Foobar', users: [user] }

  let(:project) { ProjectPresenter.new(user.projects.first) }
  let(:serialized_project) { ProjectSerializer.new(project) }

  it 'should have a name that matches' do
    expect(project.truncate_name).to eq(serialized_project.name)
  end

  it 'should have a velocity that matches' do
    expect(project.velocity).to eq(serialized_project.velocity)
  end

  it 'should have a volatility that matches' do
    expect(project.volatility).to eq(serialized_project.volatility)
  end

  it 'should have a slug that matches' do
    expect(project.slug).to eq(serialized_project.slug)
  end

  it 'should have a path_to that matches' do
    expect(project.path_to).to eq(serialized_project.path_to)
  end

  it 'should have a archived_at that matches' do
    expect(project.archived_at).to eq(serialized_project.archived_at)
  end

  it 'should have a users_avatar that matches' do
    expect(project.users_avatar(4)).to eq(serialized_project.users_avatar)
  end
end
