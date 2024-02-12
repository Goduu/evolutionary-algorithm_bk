import { DefaultService, Item } from '@/client'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";

type WebSocketProps = {
    ws: WebSocketClient | undefined,
    selectedKnapsack: number | undefined,
    selectedItems: Item[],
    randomClientId: string
    setAlgorithmResults: Dispatch<SetStateAction<Item[][] | undefined>>,

}

export const useWebsocket = ({ ws, selectedKnapsack, selectedItems, randomClientId, setAlgorithmResults }: WebSocketProps) => {
    const [websocketOpen, setWebSocketOpen] = useState(false)

    useEffect(() => {
        if (ws) {

            ws.onopen = () => {
                console.log("WebSocket connected");

                if (selectedKnapsack && selectedItems.length > 0) {
                    DefaultService.startTaskApiStartTaskClientIdPost({ requestBody: { items: selectedItems, max_weight: selectedKnapsack }, clientId: randomClientId }).then(data => {
                        console.log(data);
                    })
                }
                setWebSocketOpen(true)
                // Initiate the task when the WebSocket is connected
            };

            ws.onmessage = (message) => {
                // Handle updates/results received from WebSocket
                console.log("received", message.data);
                // check if data received is a json object
                try {
                    if (typeof message.data === "string") {
                        console.log("parsed", JSON.parse(message.data))
                        const parsedData = JSON.parse(message.data) as Item[]
                        setAlgorithmResults(current => current ? [...current, parsedData] : [parsedData])
                    }
                } catch (error) {
                    console.error("Fail do parse received data:", message.data)
                }

            };

            ws.onerror = function (event) {
                console.error("WebSocket error observed:", event);
            };

            ws.onclose = (paha) => {
                console.log("WebSocket closed", paha);
                setWebSocketOpen(false)
            };

            return () => {
                ws?.close();
            };
        }

    }, [ws, selectedKnapsack, selectedItems, setAlgorithmResults]);

    return { websocketOpen }
}