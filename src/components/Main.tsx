"use client"
import { useEffect, useMemo, useState } from 'react'
import { Bags } from './Bags'
import { ItemsSelection } from './ItemsSelection'
import { DefaultService, Item } from '@/client'
import { Button } from './Button'
import { w3cwebsocket as WebSocketClient } from "websocket";
import { BiDna } from './Icons'


const randomClientId = (Math.random() * 100).toFixed(0);

export const Main = () => {
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const [selectedBag, setSelectedBag] = useState<number>()
    // const ws = useMemo(() => new WebSocketClient(`ws://localhost:8000/evolutionary_algorithm_ws/${randomClientId}`), [randomClientId]);
    const [ws, setWs] = useState<WebSocketClient>()

    const handleRunAlgorithm = async () => {
        if (selectedBag && selectedItems.length > 0) {
            setWs(await new WebSocketClient(`ws://${process.env.NEXT_PUBLIC_APP_URL}evolutionary_algorithm_ws/${randomClientId}`))

        }
    }

    useEffect(() => {
        if (ws) {

            ws.onopen = () => {
                console.log("WebSocket connected");

                if (selectedBag && selectedItems.length > 0) {
                    DefaultService.startTaskApiStartTaskClientIdPost({ requestBody: { items: selectedItems, max_weight: selectedBag }, clientId: randomClientId }).then(data => {
                        console.log(data);
                    })
                }
                // Initiate the task when the WebSocket is connected
            };

            ws.onmessage = (message) => {
                // Handle updates/results received from WebSocket
                console.log("received", message.data);
                // check if data received is a json object
                if (typeof message.data === "string" && message.data.startsWith("[{")) {
                    console.log("parsed", JSON.parse(message.data))
                    setSelectedItems(JSON.parse(message.data) as Item[])
                }
            };

            ws.onclose = () => {
                console.log("WebSocket closed");
            };

            return () => {
                ws?.close();
            };
        }
    }, [ws, selectedBag, selectedItems, setSelectedItems]);

    return (
        <div className="flex flex-col gap-10 pb-28">
            <p className='text-xl'>
                The goal is to find the best combination of items from a given set, considering
                their weights and values, to maximize the overall value while ensuring it does not
                exceed the bag&apos;s capacity. This will be tackled using evolutionary algorithms to
                evolve and refine solutions over time, ultimately finding an optimal or near-optimal
                solution for the knapsack problem.
            </p>
            Total value: {selectedItems.reduce((acc, current) => acc + current.price, 0).toFixed(2)}
            <Bags selectedBag={selectedBag} setSelectedBag={setSelectedBag} />
            <ItemsSelection selectedItems={selectedItems} setSelectedItems={setSelectedItems} selectedBag={selectedBag} />
            <div className='flex items-center justify-center py-10 w-11/12'>
                <Button onClick={handleRunAlgorithm}><BiDna width={20} className='fill-current'/> Run Algorithm</Button>
            </div>
        </div>
    )
}
