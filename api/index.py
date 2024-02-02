from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    id: int
    name: str
    price: float
    weight: float

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
    
@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}