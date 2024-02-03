"use client"
import { useEffect, useMemo, useState } from 'react'
import { Bags } from './Bags'
import { ItemsSelection } from './ItemsSelection'
import { DefaultService, Item } from '@/client'
import { Button } from './Button'
import { BiDna } from "react-icons/bi";
import { w3cwebsocket as WebSocketClient } from "websocket";


export const Main = () => {
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const [selectedBag, setSelectedBag] = useState<number>()
    const randomClientId = (Math.random() * 100).toFixed(0);
    const ws = useMemo(() => new WebSocketClient(`ws://localhost:8000/evolutionary_algorithm_ws/${randomClientId}`), [randomClientId]);

    const handleRunAlgorithm = () => {
        if (selectedBag && selectedItems.length > 0) {
            DefaultService.startTaskApiStartTaskClientIdPost({ requestBody: { items: selectedItems, max_weight: selectedBag }, clientId: randomClientId }).then(data => {
                console.log(data);
            })
        }
    }

    useEffect(() => {
        ws.onopen = () => {
            console.log("WebSocket connected");
            // Initiate the task when the WebSocket is connected
        };

        ws.onmessage = (message) => {
            // Handle updates/results received from WebSocket
            console.log(message.data);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            ws.close();
        };
    }, [ws]);

    return (
        <div className="flex flex-col gap-10 pb-28">
            <p className='text-xl'>
                The goal is to find the best combination of items from a given set, considering
                their weights and values, to maximize the overall value while ensuring it does not
                exceed the bag&apos;s capacity. This will be tackled using evolutionary algorithms to
                evolve and refine solutions over time, ultimately finding an optimal or near-optimal
                solution for the knapsack problem.
            </p>
            <Bags selectedBag={selectedBag} setSelectedBag={setSelectedBag} />
            <ItemsSelection selectedItems={selectedItems} setSelectedItems={setSelectedItems} selectedBag={selectedBag} />
            <Button onClick={handleRunAlgorithm}><BiDna size={30} /> Run Algorithm</Button>
        </div>
    )
}
