from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel

load_dotenv()

apiKey = os.getenv("API_KEY")
mongo_url = os.getenv("MONGO_URL")  # Your MongoDB connection string

# Initialize FastAPI
app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = AsyncIOMotorClient(mongo_url)
db = client.chatbot_db
collection = db.conversations

# Configure Gemini AI
genai.configure(api_key=apiKey)
model = genai.GenerativeModel("gemini-2.0-flash")


# Request model
class ChatRequest(BaseModel):
    message: str


# API endpoint to store and respond to user messages
@app.post("/chat")
async def chat(request: ChatRequest):
    response = model.generate_content(request.message)

    chat_data = {"question": request.message, "answer": response.text}
    await collection.insert_one(chat_data)  # Save to MongoDB

    return {"reply": response.text}


# API endpoint to retrieve stored chat history
@app.get("/history")
async def get_chat_history():
    chats = await collection.find().to_list(100)  # Get latest 100 messages
    return [{"question": chat["question"], "answer": chat["answer"]} for chat in chats]
