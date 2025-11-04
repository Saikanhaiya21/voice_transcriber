class Transcription < ApplicationRecord
  validates :raw_text, presence: true

  def summarize!
    summary = basic_summary(raw_text)
    update!(summary: summary)
    summary
  end

  private

  # Simple extractive summary: first 2 sentences
  def basic_summary(text)
    sentences = text.split(/(?<=[.!?])\s+/)
    sentences.first(2).join(" ")
  end
end
