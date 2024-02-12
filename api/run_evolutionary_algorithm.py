from asyncio import sleep
from typing import List
import random
from typing import List
import random
from fastapi import WebSocket
from api.types import EvolutionaryInput, Item
from starlette.websockets import WebSocketState
from fastapi.websockets import WebSocketDisconnect

POPULATION_SIZE = 100
MAX_GENERATIONS = 20
TOURNAMENT_SIZE = 3
MUTATION_RATE = 0.1
MAX_ITEMS_FROM_EACH = 3

def initialize_population(items: List[Item], max_weight: float) -> List[List[Item]]:
    population = []
    for _ in range(POPULATION_SIZE):
        individual = []
        items_added = {}
        while True:
            item = random.choice(items)
            if items_added.get(item.id, 0) < MAX_ITEMS_FROM_EACH and sum(item.weight for item in individual) + item.weight <= max_weight:
                individual.append(item)
                items_added[item.id] = items_added.get(item.id, 0) + 1
            if len(individual) == len(items) or random.random() > 0.8:
                break
        population.append(individual)
    return population

def calculate_fitness(individual: List[Item]) -> float:
    return sum(item.price for item in individual)

def selection(population: List[List[Item]]) -> List[Item]:
    selected = []
    for _ in range(TOURNAMENT_SIZE):
        individual = random.choice(population)
        selected.append(individual)
    selected.sort(key=lambda x: calculate_fitness(x), reverse=True)
    return selected[0]

def crossover(parent1: List[Item], parent2: List[Item], max_weight: float) -> List[List[Item]]:
    child1, child2 = [], []
    # Simple one-point crossover
    cut = random.randint(0, min(len(parent1), len(parent2)))
    child1_candidates = parent1[:cut] + parent2[cut:]
    child2_candidates = parent2[:cut] + parent1[cut:]
    items_added_1, items_added_2 = {}, {}
    for item in child1_candidates:
        if items_added_1.get(item.id, 0) < MAX_ITEMS_FROM_EACH and sum(item.weight for item in child1) + item.weight <= max_weight:
            child1.append(item)
            items_added_1[item.id] = items_added_1.get(item.id, 0) + 1
    for item in child2_candidates:
        if items_added_2.get(item.id, 0) < MAX_ITEMS_FROM_EACH and sum(item.weight for item in child2) + item.weight <= max_weight:
            child2.append(item)
            items_added_2[item.id] = items_added_2.get(item.id, 0) + 1
    return [child1, child2]


def mutate(individual: List[Item], items: List[Item], max_weight: float):
    if random.random() < MUTATION_RATE:
        item_to_add = random.choice(items)
        current_weight = sum(item.weight for item in individual)
        items_added = {item.id: individual.count(item) for item in individual}
        if items_added.get(item_to_add.id, 0) < MAX_ITEMS_FROM_EACH and current_weight + item_to_add.weight <= max_weight:
            individual.append(item_to_add)
        if individual and random.random() > 0.5:  # Adding randomness to mutation
            item_to_remove = random.choice(individual)
            individual.remove(item_to_remove)


async def run_evolutionary_algorithm(ev_input: EvolutionaryInput, websocket: WebSocket) -> List[Item]:
    items, max_weight = ev_input.items, ev_input.max_weight
    population = initialize_population(items, max_weight)
    try:
        for generation in range(MAX_GENERATIONS):
            print("generation: ", generation)
            new_population = []
            for _ in range(int(POPULATION_SIZE / 2)):
                parent1 = selection(population)
                parent2 = selection(population)
                for child in crossover(parent1, parent2, max_weight):
                    mutate(child, items, max_weight)
                    new_population.append(child)
            population = new_population
            if generation % 2 == 0 and generation != 0:
                if websocket.client_state != WebSocketState.DISCONNECTED:
                    best_individual = max(population, key=lambda x: calculate_fitness(x))
                    best_individual_json = [item.to_json() for item in best_individual]
                    await websocket.send_json(best_individual_json)
                else:
                    raise WebSocketDisconnect()
            else:
                await websocket.send_text("[EA] Keep the connection alive...")
        best_individual = max(population, key=lambda x: calculate_fitness(x))
        return best_individual
    except WebSocketDisconnect:
        print("WebSocket disconnected during algorithm execution.")
        # Handle disconnection gracefully
        return None
    except Exception as e:
        print("An error occurred during algorithm execution:", e)
        # Handle other exceptions gracefully
        return None
