"use client"
import { useEffect, useMemo, useState } from 'react'
import { Bags } from './Bags'
import { ItemsSelection } from './ItemsSelection'
import { Item } from '@/client'
import { Button } from './Button'
import { w3cwebsocket as WebSocketClient } from "websocket";
import { AiOutlineLoading3Quarters, BiDna, CiPlay1 } from './Icons'
import { useWebsocket } from './useWebsocket'


const randomClientId = (Math.random() * 100).toFixed(0);

export const Algorithm = () => {
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const [selectedKnapsack, setSelectedKnapsack] = useState<number>()
    const [algorithmResults, setAlgorithmResults] = useState<Item[][]>()
    const [generation, setGeneration] = useState<number>(0)
    const [playingResults, setPlayingResults] = useState<boolean>(false)

    // const ws = useMemo(() => new WebSocketClient(`ws://localhost:8000/evolutionary_algorithm_ws/${randomClientId}`), [randomClientId]);
    const [ws, setWs] = useState<WebSocketClient>()
    const { websocketOpen } = useWebsocket({ ws, selectedKnapsack, selectedItems, randomClientId, setAlgorithmResults });

    const handleRunAlgorithm = async () => {
        setAlgorithmResults([])
        if (selectedKnapsack && selectedItems.length > 0) {
            setWs(await new WebSocketClient(`${process.env.NEXT_PUBLIC_SERVER_WS_URL}/evolutionary_algorithm_ws/${randomClientId}`))

        }
    }

    const handlePlayResults = () => {
        if (algorithmResults) {
            setPlayingResults(true)
            algorithmResults.forEach((result, index) => {
                setTimeout(() => {
                    setSelectedItems(result)
                    setGeneration(index + 1)
                }, index * 1000)
            })
            setTimeout(() => {
                setPlayingResults(false)
            }, (algorithmResults.length + 1) * 1000)
        }
    }


    return (
        <div className=" flex flex-col gap-10 pb-28">
            <p className='text-xl'>
                The goal is to find the best combination of items from a given set, considering
                their weights and values, to maximize the overall value while ensuring it does not
                exceed the bag&apos;s capacity. This will be tackled using evolutionary algorithms to
                evolve and refine solutions over time, ultimately finding an optimal or near-optimal
                solution for the knapsack problem.
            </p>
            <Bags selectedBag={selectedKnapsack} setSelectedBag={setSelectedKnapsack} />
            <ItemsSelection selectedItems={selectedItems} setSelectedItems={setSelectedItems} selectedKnapsack={selectedKnapsack} />

            <div className='flex items-center justify-center py-10 gap-4'>
                <Button onClick={handlePlayResults} disabled={!algorithmResults}><CiPlay1 width={20} className='fill-current' /> Play Results</Button>
                <Button onClick={handleRunAlgorithm} disabled={!selectedItems.length || !selectedKnapsack}><BiDna width={20} className='fill-current' /> Run Algorithm</Button>
            </div>
            {websocketOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-slate-100 bg-opacity-20">
                    <div className="animate-spin w-16"><AiOutlineLoading3Quarters className='fill-current' /></div>
                </div>
            )}

            {playingResults && (
                <div className="fixed top-0 left-0 w-screen h-screen items-center justify-center z-50 bg-slate-100 bg-opacity-20 text-5xl gap-4">
                    <div>
                        Total Knapsack Value: {selectedItems.reduce((acc, current) => acc + current.price, 0).toFixed(2)}
                    </div>
                    <div>
                        Generation: {generation * 2}
                    </div>
                </div>
            )}

        </div>
    )
}
