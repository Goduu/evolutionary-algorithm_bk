from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
from api.run_evolutionary_algorithm import run_evolutionary_algorithm
from api.types import EvolutionaryInput, Item

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://evolutionary-algorithm-819493p3w-goduu.vercel.app/", "http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=["https://evolutionary-algorithm-819493p3w-goduu.vercel.app/", "http://localhost:3000/"],
    allow_headers=["https://evolutionary-algorithm-819493p3w-goduu.vercel.app/", "http://localhost:3000/"],
)

class ResponseMessage(BaseModel):
    message: str
    
    
@app.post("/api/items/", response_model=ResponseMessage)
async def create_item(item: Item):
    print("item received", item.name)
    return {"message": "item received"}

@app.get("/api/items/", response_model=list[Item])
async def get_items():
    return [
        {"name": "Plumbus", "price": 3, "weight": 1.5},
        {"name": "Portal Gun", "price": 9, "weight": 2.5},
    ]
  
# Store WebSocket connections along with client identifiers
connections: List[WebSocket] = {}
  
# Create an asyncio.Queue for communication
task_queue = asyncio.Queue()

@app.websocket("/evolutionary_algorithm_ws/{client_id}")
async def evolutionary_algorithm_ws(websocket: WebSocket, client_id: str):
    await websocket.accept()
    connections[client_id] = websocket
    try:
        while True:
            await asyncio.sleep(3)
            await websocket.send_text("Running...")
    except WebSocketDisconnect:
        del connections[client_id]

# Asynchronous task endpoint
@app.post("/api/start_task/{client_id}", response_model=ResponseMessage)
async def start_task(input: EvolutionaryInput, client_id: str):
    print("Task started")
    while not connections.get(client_id):
        await asyncio.sleep(0.2)
    best_individual = await run_evolutionary_algorithm(input, connections[client_id])
    best_individual_json = [item.to_json() for item in best_individual]
    connections[client_id].send_json(best_individual_json)
        
    return {"message": "Task started"}


