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

ActiveRecord::Schema[7.1].define(version: 2024_05_11_081518) do
  create_table "active_admin_comments", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_id", null: false
    t.string "resource_type", null: false
    t.integer "author_id"
    t.string "author_type"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["id"], name: "id", unique: true
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.bigint "pivotal_id"
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["pivotal_id"], name: "index_active_storage_attachments_on_pivotal_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: nil, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "user_id", null: false
    t.integer "subject_id"
    t.string "subject_type"
    t.string "action"
    t.text "subject_changes"
    t.string "subject_destroyed_type"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "pivotal_id"
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_activities_on_pivotal_id"
    t.index ["project_id", "user_id"], name: "index_activities_on_project_id_and_user_id"
    t.index ["project_id"], name: "index_activities_on_project_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "admin_users", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "authy_id"
    t.datetime "last_sign_in_with_authy", precision: nil
    t.boolean "authy_enabled", default: false
    t.index ["authy_id"], name: "index_admin_users_on_authy_id"
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["id"], name: "id", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "api_tokens", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "team_id"
    t.string "token"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["id"], name: "id", unique: true
    t.index ["team_id"], name: "index_api_tokens_on_team_id"
  end

  create_table "attachinary_files", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "attachinariable_id"
    t.string "attachinariable_type"
    t.string "scope"
    t.string "public_id"
    t.string "version"
    t.integer "width"
    t.integer "height"
    t.string "format"
    t.string "resource_type"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["attachinariable_type", "attachinariable_id", "scope"], name: "by_scoped_parent"
    t.index ["id"], name: "id", unique: true
  end

  create_table "changesets", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "story_id"
    t.integer "project_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["id"], name: "id", unique: true
  end

  create_table "enrollments", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "team_id", null: false
    t.integer "user_id", null: false
    t.boolean "is_admin", default: false, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["id"], name: "id", unique: true
    t.index ["team_id", "user_id"], name: "index_enrollments_on_team_id_and_user_id", unique: true
  end

  create_table "integrations", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "project_id"
    t.string "kind", null: false
    t.text "data", null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["id"], name: "id", unique: true
  end

  create_table "memberships", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "project_id"
    t.integer "user_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["id"], name: "id", unique: true
    t.index ["project_id", "user_id"], name: "index_memberships_on_project_id_and_user_id", unique: true
    t.index ["project_id"], name: "index_memberships_on_project_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "notes", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.text "note"
    t.integer "user_id"
    t.integer "story_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "user_name"
    t.string "smtp_id"
    t.bigint "pivotal_id"
    t.text "reactions", size: :medium
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_notes_on_pivotal_id"
    t.index ["smtp_id"], name: "index_notes_on_smtp_id", unique: true
  end

  create_table "ownerships", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "team_id", null: false
    t.integer "project_id", null: false
    t.boolean "is_owner", default: false, null: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["id"], name: "id", unique: true
    t.index ["team_id", "project_id"], name: "index_ownerships_on_team_id_and_project_id", unique: true
  end

  create_table "pivotal_projects", charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "name"
    t.text "users_attributes"
    t.datetime "started_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "project_attributes", size: :medium
    t.text "memberships_attributes", size: :medium
    t.text "labels_attributes", size: :medium
    t.text "stories_attributes", size: :long
    t.text "activities_attributes", size: :medium
    t.boolean "hidden", default: false, null: false
  end

  create_table "projects", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "name"
    t.string "point_scale", default: "pivotal"
    t.date "start_date"
    t.integer "iteration_start_day", default: 1
    t.integer "iteration_length", default: 1
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "default_velocity", default: 10
    t.string "slug"
    t.integer "stories_count", default: 0
    t.integer "memberships_count", default: 0
    t.datetime "archived_at", precision: nil
    t.boolean "disallow_join", default: true, null: false
    t.integer "tag_group_id"
    t.boolean "mail_reports", default: false
    t.integer "velocity_strategy", default: 3
    t.boolean "enable_tasks", default: false, null: false
    t.bigint "pivotal_id"
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_projects_on_pivotal_id"
    t.index ["slug"], name: "index_projects_on_slug", unique: true
  end

  create_table "stories", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "estimate"
    t.string "story_type", default: "feature"
    t.string "state", default: "unscheduled"
    t.datetime "accepted_at", precision: nil
    t.integer "requested_by_id"
    t.integer "owned_by_id"
    t.integer "project_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "position"
    t.string "labels"
    t.string "requested_by_name"
    t.string "owned_by_name"
    t.string "owned_by_initials"
    t.datetime "started_at", precision: nil
    t.float "cycle_time", default: 0.0
    t.date "release_date"
    t.datetime "delivered_at", precision: nil
    t.string "branch"
    t.integer "new_position"
    t.string "positioning_column"
    t.bigint "pivotal_id"
    t.text "blockers", size: :medium
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_stories_on_pivotal_id"
    t.index ["project_id", "positioning_column", "position"], name: "index_stories_on_project_id_and_positioning_column_and_position", unique: true
  end

  create_table "tag_groups", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "team_id"
    t.string "name", limit: 15
    t.text "description"
    t.string "bg_color", default: "#2075F3"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "foreground_color"
    t.index ["id"], name: "id", unique: true
    t.index ["team_id"], name: "index_tag_groups_on_team_id"
  end

  create_table "tasks", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.integer "story_id"
    t.string "name"
    t.boolean "done", default: false
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.bigint "pivotal_id"
    t.integer "position"
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_tasks_on_pivotal_id"
    t.index ["story_id"], name: "index_tasks_on_story_id"
  end

  create_table "teams", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug"
    t.string "logo"
    t.datetime "archived_at", precision: nil
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.boolean "disable_registration", default: false, null: false
    t.string "registration_domain_whitelist"
    t.string "registration_domain_blacklist"
    t.index ["id"], name: "id", unique: true
    t.index ["name"], name: "index_teams_on_name", unique: true
    t.index ["slug"], name: "index_teams_on_slug", unique: true
  end

  create_table "users", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", options: "ENGINE=InnoDB ROW_FORMAT=DYNAMIC", force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", limit: 128, null: false
    t.string "reset_password_token"
    t.string "remember_token"
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.string "password_salt"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "name"
    t.string "initials"
    t.boolean "email_delivery", default: true
    t.boolean "email_acceptance", default: true
    t.boolean "email_rejection", default: true
    t.datetime "reset_password_sent_at", precision: nil
    t.string "locale"
    t.integer "memberships_count", default: 0
    t.string "username", null: false
    t.string "time_zone", default: "Brasilia", null: false
    t.string "role", default: "developer", null: false
    t.string "authy_id"
    t.datetime "last_sign_in_with_authy", precision: nil
    t.boolean "authy_enabled", default: false
    t.boolean "finished_tour", default: false
    t.boolean "admin", default: false, null: false
    t.bigint "pivotal_id"
    t.index ["authy_id"], name: "index_users_on_authy_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["id"], name: "id", unique: true
    t.index ["pivotal_id"], name: "index_users_on_pivotal_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
