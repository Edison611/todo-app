class AddTagToTask < ActiveRecord::Migration[8.1]
  def change
    add_reference :tasks, :tag, foreign_key: true
  end
end
