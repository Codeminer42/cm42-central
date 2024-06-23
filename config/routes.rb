require 'sidekiq/web'

Rails.application.routes.draw do
  root 'projects#index'
  resources :projects do
    get :archived, on: :collection
    member do
      get :join, :reports
      patch :archive, :unarchive
    end
    resources :users, only: [:index, :create, :destroy]
    resources :memberships, only: [:create]
    resources :invitations, only: [:new, :create, :show, :update]
    resources :stories, only: [:create, :update, :destroy] do
      get :done, on: :collection
      resources :comments, only: [:index, :create, :show, :destroy]
      resources :tasks, only: [:create, :destroy, :update]
      patch :transition, on: :member
    end
    resources :stories_bulk_destroy, only: [:create]
    resources :stories_bulk_update, only: [:create]
    resources :activities, only: [:index]
  end

  resources :pivotal_projects do
    post :refresh, on: :collection
    member do
      post :import
      put :hide, :unhide
    end
  end

  devise_for :users, controllers: { registrations: "registrations" }
  devise_scope :user do
    get 'users/current' => 'sessions#current', as: :current_user
    put 'users/:id/tour' => 'registrations#tour', as: :users_tour
    put 'users/:id/reset_tour' => 'registrations#reset_tour', as: :user_reset_tour
  end
  resources :invitations

  mount UserImpersonate::Engine => "/impersonate", as: "impersonate_engine"
  ActiveAdmin.routes(self)
  namespace :manage do
    resources :projects do
      resources :memberships
    end
    resources :users do
      resources :memberships
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  authenticate :user, ->(u) { u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end
  get '/404', to: 'errors#not_found', :via => :all
end
