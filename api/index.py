from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import asyncio
from api.run_evolutionary_algorithm import run_evolutionary_algorithm
from api.types import EvolutionaryInput, Item

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://evolutionary-algorithm.vercel.app/", "http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=["https://evolutionary-algorithm.vercel.app/", "http://localhost:3000/"],
    allow_headers=["https://evolutionary-algorithm.vercel.app/", "http://localhost:3000/"],
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
connections: Dict[str, WebSocket] = {}
  
# Create an asyncio.Queue for communication

@app.websocket("/evolutionary_algorithm_ws/{client_id}")
async def evolutionary_algorithm_ws(websocket: WebSocket, client_id: str):
    await websocket.accept()
    connections[client_id] = websocket
    try:
        while True:
            if(client_id in connections):
                await asyncio.sleep(0.5)
                await websocket.send_text("[CK] Keep the connection alive...")
            else: 
                break
    except WebSocketDisconnect:
        if client_id in connections:
            del connections[client_id]

# Asynchronous task endpoint
@app.post("/api/start_task/{client_id}", response_model=ResponseMessage)
async def start_task(input: EvolutionaryInput, client_id: str):
    print("Task started")
    try:
        best_individual = await run_evolutionary_algorithm(input, connections[client_id])
        if(best_individual is not None):
            best_individual_json = [item.to_json() for item in best_individual]
            await connections[client_id].send_json(best_individual_json)
            print("closing connections", connections[client_id].url)
            await connections[client_id].close()
            del connections[client_id]
            asyncio.sleep(1)
        else:
            print("Error: Best individual is None")
        return {"message": "Task completed"}
    
    except Exception as e:
        print("Exception:", str(e))
        return {"message": f"Error occurred: {str(e)}"}

