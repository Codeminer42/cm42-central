require 'sidekiq/web'
Rails.application.routes.draw do

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  namespace :manage do
    resources :projects do
      resources :ownerships
      resources :memberships
    end
    resources :teams do
      resources :ownerships
      resources :enrollments
    end
    resources :users do
      resources :memberships
      resources :enrollments
    end
  end

  mount Attachinary::Engine => "/attachinary"

  get 'story/new'
  get 'projects/archived' => 'projects#archived'
  put 'locales' => 'locales#update', as: :locales

  get 't/:id' => 'teams#switch', as: :teams_switch

  resources :teams, except: :show do
    get :switch, on: :collection
    resources :api_tokens, only: [:create, :destroy]
  end

  resources :projects do
    member do
      get :join
      get :import
      patch :import_upload
      patch :archive
      patch :unarchive
      patch :ownership
      get :search
      get :reports
    end
    resources :users, only: [:index, :create, :destroy]
    resources :integrations, only: [:index, :create, :destroy]
    resources :changesets, only: [:index]
    resources :stories, only: [:index, :create, :update, :destroy, :show] do
      resources :activities, only: [:index], module: 'stories'
      resources :notes, only: [:index, :create, :show, :destroy]
      resources :tasks, only: [:create, :destroy, :update]
      collection do
        get :done
        get :in_progress
        get :backlog
      end
    end
  end

  resources :tag_groups

  namespace :admin do
    resources :users do
      member do
        patch :enrollment
      end
    end
  end

  devise_for :users, controllers: {
    confirmations: 'confirmations',
    registrations: 'registrations'
  },
  path_names: {
    verify_authy: '/verify-token',
    enable_authy: '/enable-two-factor',
    verify_authy_installation: '/verify-installation'
  }

  devise_scope :user do
    get 'users/verfiy_two_factor' => 'registrations#verify_two_factor', as: :user_verify_two_factor
    post 'users/disable_two_factor' => 'registrations#disable_two_factor', as: :user_disable_two_factor
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

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  mount GrapeSwaggerRails::Engine => '/api/v1/explore'
  mount API => '/'
end
