class CreateTranscriptions < ActiveRecord::Migration[8.1]
  def change
    create_table :transcriptions do |t|
      t.text :raw_text
      t.text :summary

      t.timestamps
    end
  end
end
