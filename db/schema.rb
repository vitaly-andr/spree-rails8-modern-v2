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

ActiveRecord::Schema[8.0].define(version: 2025_05_19_120904) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "db_metadata_table_infos", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.bigint "size_bytes"
    t.string "size_pretty"
    t.text "description"
    t.jsonb "columns"
    t.jsonb "indexes"
    t.jsonb "foreign_keys"
    t.jsonb "sample_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_db_metadata_table_infos_on_category"
    t.index ["name"], name: "index_db_metadata_table_infos_on_name"
  end
end
