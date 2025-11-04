class TranscriptionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  # GET /transcriptions/new
  def new
  end

  # POST /transcriptions
  def create
    transcription = Transcription.new(transcription_params)

    if transcription.save
      render json: { id: transcription.id, raw_text: transcription.raw_text }, status: :created
    else
      render json: { errors: transcription.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /summary/:id
  def summary
    transcription = Transcription.find(params[:id])
    summary = transcription.summary.presence || transcription.summarize!
    render json: { id: transcription.id, raw_text: transcription.raw_text, summary: summary }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Transcription not found" }, status: :not_found
  end

  private

  def transcription_params
    params.require(:raw_text)
    { raw_text: params[:raw_text] }
  end
end
