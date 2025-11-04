# Voice Transcription & Summarization Web App

## Overview

This Rails 7 web application allows users to:

- Record voice directly from the browser.
- Display **real-time transcription** while speaking.
- Show **full transcription** after stopping.
- Generate a **summary** of the conversation using a simple built-in summarization method (no external API use).

The app uses the **browser's SpeechRecognition API**, StimulusJS for frontend interactions, and Rails for backend storage and summarization.

---

## Features

- Real-time voice transcription in the browser.
- Continuous speech handling (pauses do not erase previous content).
- Summarization of full conversation.
- Frontend built with StimulusJS, no heavy frameworks required.
- Backend built in Rails 7.

---

## Prerequisites

- Ruby 3.1+  
- Rails 7+   
- SQLite3 (or other DB supported by Rails)  

---

## Setup

**Clone the repository:**
```bash
git clone https://github.com/Saikanhaiya21/voice_transcriber.git
cd voice_transcriber
```
**Install dependencies:**
```bash
bundle install
```
**Set up the database:**
```bash
rails db:create db:migrate
```

**Start Server:**
```bash
rails server
```
