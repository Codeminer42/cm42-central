# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_04_19_081722) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pg_stat_statements"
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "active_admin_comments", id: :serial, force: :cascade do |t|
    t.string "namespace", limit: 255
    t.text "body"
    t.string "resource_id", limit: 255, null: false
    t.string "resource_type", limit: 255, null: false
    t.integer "author_id"
    t.string "author_type", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", id: :serial, force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "user_id", null: false
    t.integer "subject_id"
    t.string "subject_type", limit: 255
    t.string "action", limit: 255
    t.text "subject_changes"
    t.string "subject_destroyed_type", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["project_id", "user_id"], name: "index_activities_on_project_id_and_user_id"
    t.index ["project_id"], name: "index_activities_on_project_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "admin_users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "authy_id"
    t.datetime "last_sign_in_with_authy", precision: nil
    t.boolean "authy_enabled", default: false
    t.index ["authy_id"], name: "index_admin_users_on_authy_id"
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "api_tokens", id: :serial, force: :cascade do |t|
    t.integer "team_id"
    t.string "token"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["team_id"], name: "index_api_tokens_on_team_id"
  end

  create_table "attachinary_files", id: :serial, force: :cascade do |t|
    t.integer "attachinariable_id"
    t.string "attachinariable_type", limit: 255
    t.string "scope", limit: 255
    t.string "public_id", limit: 255
    t.string "version", limit: 255
    t.integer "width"
    t.integer "height"
    t.string "format", limit: 255
    t.string "resource_type", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["attachinariable_type", "attachinariable_id", "scope"], name: "by_scoped_parent"
  end

  create_table "changesets", id: :serial, force: :cascade do |t|
    t.integer "story_id"
    t.integer "project_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "enrollments", id: :serial, force: :cascade do |t|
    t.integer "team_id", null: false
    t.integer "user_id", null: false
    t.boolean "is_admin", default: false, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["team_id", "user_id"], name: "index_enrollments_on_team_id_and_user_id", unique: true
  end

  create_table "integrations", id: :serial, force: :cascade do |t|
    t.integer "project_id"
    t.string "kind", limit: 255, null: false
    t.hstore "data", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["data"], name: "index_integrations_on_data", using: :gin
  end

  create_table "memberships", id: :serial, force: :cascade do |t|
    t.integer "project_id"
    t.integer "user_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["project_id", "user_id"], name: "index_memberships_on_project_id_and_user_id", unique: true
    t.index ["project_id"], name: "index_memberships_on_project_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "notes", id: :serial, force: :cascade do |t|
    t.text "note"
    t.integer "user_id"
    t.integer "story_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "user_name", limit: 255
  end

  create_table "ownerships", id: :serial, force: :cascade do |t|
    t.integer "team_id", null: false
    t.integer "project_id", null: false
    t.boolean "is_owner", default: false, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["team_id", "project_id"], name: "index_ownerships_on_team_id_and_project_id", unique: true
  end

  create_table "projects", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "point_scale", limit: 255, default: "fibonacci"
    t.date "start_date"
    t.integer "iteration_start_day", default: 1
    t.integer "iteration_length", default: 1
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "default_velocity", default: 10
    t.string "slug", limit: 255
    t.integer "stories_count", default: 0
    t.integer "memberships_count", default: 0
    t.datetime "archived_at", precision: nil
    t.boolean "disallow_join", default: true, null: false
    t.integer "tag_group_id"
    t.boolean "mail_reports", default: true
    t.integer "velocity_strategy", default: 3
    t.boolean "enable_tasks", default: false, null: false
    t.index ["slug"], name: "index_projects_on_slug", unique: true
  end

  create_table "stories", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.text "description"
    t.integer "estimate"
    t.string "story_type", limit: 255, default: "feature"
    t.string "state", limit: 255, default: "unscheduled"
    t.datetime "accepted_at", precision: nil
    t.integer "requested_by_id"
    t.integer "owned_by_id"
    t.integer "project_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "position"
    t.string "labels", limit: 255
    t.string "requested_by_name", limit: 255
    t.string "owned_by_name", limit: 255
    t.string "owned_by_initials", limit: 255
    t.datetime "started_at", precision: nil
    t.float "cycle_time", default: 0.0
    t.date "release_date"
    t.datetime "delivered_at", precision: nil
    t.string "branch"
    t.integer "new_position"
    t.string "positioning_column"
    t.index ["project_id", "positioning_column", "position"], name: "index_stories_on_project_id_and_positioning_column_and_position", unique: true
  end

  create_table "tag_groups", id: :serial, force: :cascade do |t|
    t.integer "team_id"
    t.string "name", limit: 15
    t.text "description"
    t.string "bg_color", default: "#2075F3"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "foreground_color"
    t.index ["team_id"], name: "index_tag_groups_on_team_id"
  end

  create_table "tasks", id: :serial, force: :cascade do |t|
    t.integer "story_id"
    t.string "name", limit: 255
    t.boolean "done", default: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["story_id"], name: "index_tasks_on_story_id"
  end

  create_table "teams", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.string "slug", limit: 255
    t.string "logo", limit: 255
    t.datetime "archived_at", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.boolean "disable_registration", default: false, null: false
    t.string "registration_domain_whitelist", limit: 255
    t.string "registration_domain_blacklist", limit: 255
    t.index ["name"], name: "index_teams_on_name", unique: true
    t.index ["slug"], name: "index_teams_on_slug", unique: true
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 128, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.string "remember_token", limit: 255
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip", limit: 255
    t.string "last_sign_in_ip", limit: 255
    t.string "confirmation_token", limit: 255
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.string "password_salt", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "name", limit: 255
    t.string "initials", limit: 255
    t.boolean "email_delivery", default: true
    t.boolean "email_acceptance", default: true
    t.boolean "email_rejection", default: true
    t.datetime "reset_password_sent_at", precision: nil
    t.string "locale", limit: 255
    t.integer "memberships_count", default: 0
    t.string "username", limit: 255, null: false
    t.string "time_zone", limit: 255, default: "Brasilia", null: false
    t.string "role", default: "developer", null: false
    t.string "authy_id"
    t.datetime "last_sign_in_with_authy", precision: nil
    t.boolean "authy_enabled", default: false
    t.boolean "finished_tour", default: false
    t.index ["authy_id"], name: "index_users_on_authy_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "enrollments", "teams", name: "enrollments_team_id_fk", on_delete: :cascade
  add_foreign_key "enrollments", "users", name: "enrollments_user_id_fk", on_delete: :cascade
  add_foreign_key "integrations", "projects", name: "integrations_project_id_fk", on_delete: :cascade
  add_foreign_key "memberships", "projects", name: "memberships_project_id_fk", on_delete: :cascade
  add_foreign_key "memberships", "users", name: "memberships_user_id_fk", on_delete: :cascade
  add_foreign_key "notes", "stories", name: "notes_story_id_fk", on_delete: :cascade
  add_foreign_key "ownerships", "projects", name: "ownerships_project_id_fk", on_delete: :cascade
  add_foreign_key "ownerships", "teams", name: "ownerships_team_id_fk", on_delete: :cascade
  add_foreign_key "stories", "projects", name: "stories_project_id_fk", on_delete: :cascade
  add_foreign_key "tasks", "stories", name: "tasks_story_id_fk", on_delete: :cascade
end
