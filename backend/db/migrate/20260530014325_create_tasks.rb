class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.timestamps
      t.string :title, null: false
      t.integer :priority, null:false
    end
  end
end
