"use client"
import { useState } from 'react'
import { Bags } from './Bags'
import { ItemsSelection } from './ItemsSelection'
import { Item } from '@/client'


export const DraggableArea = () => {
    const [selectedItems, setSelectedItems] = useState<Item[]>([])
    const [selectedBag, setSelectedBag] = useState<number>()

    return (
        <div className="flex flex-col gap-10">
            <p className='text-xl'>
                The goal is to find the best combination of items from a given set, considering
                their weights and values, to maximize the overall value while ensuring it does not
                exceed the bag's capacity. This will be tackled using evolutionary algorithms to
                evolve and refine solutions over time, ultimately finding an optimal or near-optimal
                solution for the knapsack problem.
            </p>
            <Bags selectedBag={selectedBag} setSelectedBag={setSelectedBag} />
            <ItemsSelection selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </div>
    )
}
