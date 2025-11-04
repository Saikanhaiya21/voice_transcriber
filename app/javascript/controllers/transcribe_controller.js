import { Controller } from "@hotwired/stimulus";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class extends Controller {
  static targets = [];

  connect() {
    this.finalTranscript = "";
    this.isListening = false;

    // DOM elements
    this.liveDiv = document.getElementById("liveTranscript");
    this.finalDiv = document.getElementById("finalTranscript");
    this.summaryDiv = document.getElementById("summary");
    this.startBtn = document.getElementById("startBtn");
    this.stopBtn = document.getElementById("stopBtn");

    if (!SpeechRecognition) {
      alert("SpeechRecognition not supported in this browser.");
      this.startBtn.disabled = true;
      return;
    }

    // Setup recognition
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = (e) => console.error("Recognition error:", e);
    this.recognition.onend = this.handleEnd.bind(this);
  }

  handleResult(event) {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        this.finalTranscript += transcript + " ";
      } else {
        interim += transcript;
      }
    }
    this.liveDiv.textContent = this.finalTranscript + interim;
  }

  handleEnd() {
    if (this.isListening) {
      // Auto-restart after silence
      setTimeout(() => {
        try {
          this.recognition.start();
        } catch (e) {
          console.warn("Restart failed:", e);
        }
      }, 500);
    } else {
      this.startBtn.disabled = false;
      this.stopBtn.disabled = true;
    }
  }

  start() {
    this.finalTranscript = "";
    this.liveDiv.textContent = "";
    this.finalDiv.textContent = "";
    this.summaryDiv.textContent = "";

    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.isListening = true;
    this.recognition.start();
  }

  stop() {
    this.isListening = false;
    this.recognition.stop();

    const rawText = this.finalTranscript.trim();
    this.finalDiv.textContent = rawText || "No speech detected.";

    if (!rawText) {
      this.summaryDiv.textContent = "No text to summarize.";
      this.startBtn.disabled = false;
      this.stopBtn.disabled = true;
      return;
    }

    // Send transcription to backend
    fetch("/transcriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ raw_text: rawText })
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw data; });
        return res.json();
      })
      .then(data => fetch(`/summary/${data.id}`, { headers: { "Accept": "application/json" } }))
      .then(res => res.json())
      .then(data => { this.summaryDiv.textContent = "Summary: " + (data.summary || "N/A"); })
      .catch(error => {
        console.error("Error:", error);
        this.summaryDiv.textContent = error.errors ? error.errors.join(", ") : "Error obtaining summary.";
      });

    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
  }
}
