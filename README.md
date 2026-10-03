# 📚 StudyBuddy

**Study smarter. Stay consistent.**

StudyBuddy is a simple, student-focused productivity web app that helps students organize study tasks, focus with a timer, take quick notes, track progress, and generate personalized study plans using open-source AI.

🔗 **Live Demo:** https://vaibhavsarmai05-oss.github.io/StudyBuddy/

💻 **GitHub:** https://github.com/vaibhavsarmai05-oss/StudyBuddy

---

## ✨ Why StudyBuddy?

Students often use separate apps for tasks, notes, timers, and study planning.

StudyBuddy brings these basic tools together in one lightweight interface, with an AI Study Planner for turning a study goal and deadline into a practical plan.

The project was built as a simple tool that a student could actually use during everyday studying.

---

## 🚀 Features

### 📝 Study Tasks

- Add study tasks
- Set High, Medium, or Low priority
- Mark tasks as completed
- Delete tasks
- Filter tasks by status or priority
- Track total and completed tasks
- Progress percentage indicator

### ⏱️ Focus Timer

- 25-minute focus timer
- Start / Pause
- Reset
- Completion notification

### 💡 Quick Notes

- Write quick study notes
- Save notes locally
- Notes persist using browser LocalStorage

### 🌙 Dark Mode

- Light and dark themes
- Theme preference saved locally

### 🤖 AI Study Planner

StudyBuddy includes an AI-powered study planner.

Students provide:

- What they need to study
- Their deadline

The application sends the request to a FastAPI backend, which uses an open-source language model through Hugging Face Inference Providers to generate a structured study plan.

The generated plan is then displayed directly in the StudyBuddy interface.

### 🔒 Privacy-Friendly Storage

Tasks, notes, and theme preferences are stored locally in the browser using LocalStorage.

---

## 🧠 AI Architecture

```text
Student
   ↓
StudyBuddy Web App
   ↓
FastAPI Backend
   ↓
Hugging Face Inference API
   ↓
Open-Source AI Model
   ↓
Generated Study Plan
   ↓
StudyBuddy
```

The frontend does not contain the Hugging Face API token.

The token is stored securely as an environment variable on the backend deployment.

---

## 🛠️ Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- LocalStorage

### Backend

- Python
- FastAPI
- Uvicorn

### AI

- Hugging Face Inference Providers
- Qwen/Qwen2.5-0.5B-Instruct

### Deployment

- GitHub Pages — frontend
- Render — backend

---

## 📸 Screenshots

### Dashboard

![StudyBuddy Dashboard](screenshots/dashboard.png)

### Dark Mode

![StudyBuddy Dark Mode](screenshots/dark-mode.png)

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/vaibhavsarmai05-oss/StudyBuddy.git

cd StudyBuddy
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the AI backend

Create a `.env` file:

```text
HF_TOKEN=your_huggingface_token
```

Never commit your `.env` file.

### 5. Start the FastAPI backend

```bash
uvicorn backend.app:app --reload
```

The backend will run locally at:

```text
http://127.0.0.1:8000
```

### 6. Run the frontend

Open `index.html` using a local development server such as VS Code Live Server.

---

## 📁 Project Structure

```text
StudyBuddy/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
├── requirements.txt
├── .gitignore
│
├── screenshots/
│   ├── dashboard.png
│   └── dark-mode.png
│
└── backend/
    └── app.py
```

---

## 🤝 Contributing

Contributions are welcome.

If you want to improve StudyBuddy:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test the application
5. Open a pull request

Good areas for contribution include:

- Custom timer durations
- Study streak tracking
- Subject categories
- Better AI planning
- Accessibility improvements
- UI improvements

---

## 🔮 Future Improvements

- Custom timer durations
- Study streak tracking
- Subject categories
- AI-generated revision quizzes
- Better deadline parsing
- More detailed progress analytics
- Improved accessibility
- Offline-friendly AI workflows

---

## ❤️ Built for Students

StudyBuddy was built as a small, practical project for students who want their study planning tools in one place.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.