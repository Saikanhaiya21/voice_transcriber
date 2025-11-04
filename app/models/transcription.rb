class Transcription < ApplicationRecord
  validates :raw_text, presence: true 
end
