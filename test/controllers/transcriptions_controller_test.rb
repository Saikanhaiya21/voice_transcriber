require "test_helper"

class TranscriptionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get transcriptions_new_url
    assert_response :success
  end
end
