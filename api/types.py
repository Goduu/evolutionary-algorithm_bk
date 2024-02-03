from pydantic import BaseModel
from typing import List

class Item(BaseModel):
    id: int
    name: str
    price: float
    weight: float
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "weight": self.weight
        }

class EvolutionaryInput(BaseModel):
    items: List[Item]
    max_weight: float
    
    def to_json(self):
        return {
            "items": [item.to_json() for item in self.items],
            "max_weight": self.max_weight
        }