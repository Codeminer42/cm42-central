require 'sidekiq/web'
Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  mount UserImpersonate::Engine => "/impersonate", as: "impersonate_engine"

  namespace :manage do
    resources :projects do
      resources :memberships
    end
    resources :users do
      resources :memberships
    end
  end

  get 'story/new'
  get 'projects/archived' => 'projects#archived'
  put 'locales' => 'locales#update', as: :locales

  get '/404', to: 'errors#not_found', :via => :all

  resources :projects do
    member do
      get :join, :import, :search, :reports
      patch :import_upload, :archive, :unarchive
    end
    resources :users, only: [:index, :create, :destroy]
    resources :memberships, only: [:create]
    resources :invitations, only: [:new, :create, :show]
    resources :changesets, only: [:index]
    put 'stories/sort', to: 'stories#sort'
    resources :stories, only: [:index, :create, :update, :destroy] do
      resources :activities, only: [:index], module: 'stories'
      resources :notes, only: [:index, :create, :show, :destroy]
      resources :tasks, only: [:create, :destroy, :update]
      member do
        patch :transition
      end
    end
    resources :stories_bulk_destroy, only: [:create]
    resources :stories_bulk_update, only: [:create]
  end

  resources :pivotal_projects do
    post :refresh, on: :collection
    post :import, on: :member
  end

  namespace :admin do
    resources :users
  end

  devise_for :users
  resources :invitations
  devise_scope :user do
    get 'users/current' => 'sessions#current', as: :current_user
    put 'users/:id/tour' => 'registrations#tour', as: :users_tour
    put 'users/:id/reset_tour' => 'registrations#reset_tour', as: :user_reset_tour
  end

  if Rails.env.development?
    get 'testcard' => 'static#testcard'
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  authenticate :admin_user do
    mount Sidekiq::Web => '/sidekiq'
  end

  root 'projects#index'
end
