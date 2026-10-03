import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient


# =========================================
# LOAD ENVIRONMENT VARIABLES
# =========================================

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")


# =========================================
# FASTAPI APP
# =========================================

app = FastAPI(
    title="StudyBuddy AI API",
    description="AI study planning backend for StudyBuddy",
    version="1.0.0"
)


# =========================================
# CORS
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://vaibhavsarmai05-oss.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# HUGGING FACE CLIENT
# =========================================

client = InferenceClient(
    provider="featherless-ai",
    token=HF_TOKEN
)


# =========================================
# REQUEST MODEL
# =========================================

class StudyRequest(BaseModel):
    goal: str
    deadline: str


# =========================================
# HOME ROUTE
# =========================================

@app.get("/")
def home():
    return {
        "message": "StudyBuddy AI API is running!"
    }


# =========================================
# AI STUDY PLAN
# =========================================

@app.post("/generate-plan")
def generate_plan(request: StudyRequest):

    prompt = f"""
You are StudyBuddy, a practical AI study planner.

Create a study plan using ONLY the information provided by the student.

STUDENT GOAL:
{request.goal}

DEADLINE:
{request.deadline}

STRICT RULES:

1. Do not add unrelated subjects or topics.
2. Do not repeat the same practice task.
3. Divide the work logically across the available days.
4. Earlier days should focus on learning and understanding.
5. Middle days should focus on practice.
6. The final day should focus mainly on revision and exam-style practice.
7. Every day must have a different purpose.
8. Keep each day concise.
9. Do not invent a subject that the student did not mention.
10. If the deadline is given as a number of days, create exactly that many days.
11. Do not create more days than the deadline.
12. Use simple language suitable for a college student.

OUTPUT FORMAT:

Day 1:
Focus:
- ...

Practice:
- ...
- ...

Day 2:
Focus:
- ...

Practice:
- ...
- ...

Continue until the deadline.

Final Revision:
- ...
- ...
"""


    # =====================================
    # CALL OPEN-SOURCE AI MODEL
    # =====================================

    response = client.chat.completions.create(
        model="Qwen/Qwen2.5-0.5B-Instruct",

        messages=[
            {
                "role": "system",
                "content": (
                    "You are StudyBuddy, a concise and "
                    "practical AI study planning assistant. "
                    "Follow the user's requested topics exactly."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        max_tokens=500,

        temperature=0.3
    )


    # =====================================
    # EXTRACT AI RESPONSE
    # =====================================

    plan = response.choices[0].message.content


    # =====================================
    # RETURN RESULT
    # =====================================

    return {
        "goal": request.goal,
        "deadline": request.deadline,
        "plan": plan
    }