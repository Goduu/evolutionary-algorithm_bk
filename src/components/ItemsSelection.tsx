import React, { FC, useState } from 'react'
import { items } from './items'
import classNames from 'classnames'
import { Item } from '@/client'
import { ItemTooltip } from './ItemTooltip'
import { Button } from './Button'
import { HiOutlineRefresh } from "react-icons/hi";
import { TbArrowsRandom } from "react-icons/tb";
import { PiSelectionAllFill } from "react-icons/pi";

type ItemsSelectionProps = {
    selectedItems: Item[]
    setSelectedItems: (items: Item[]) => void
}
export const ItemsSelection: FC<ItemsSelectionProps> = ({ selectedItems, setSelectedItems }) => {
    const [hoveredItem, setHoveredItem] = useState<Item>()

    const handleSelectItem = (item: Item) => {
        const chosenObjectsCopy = [...selectedItems]
        if (!chosenObjectsCopy.includes(item)) {
            chosenObjectsCopy.push(item)
        } else {
            chosenObjectsCopy.splice(selectedItems.indexOf(item), 1)
        }
        setSelectedItems(chosenObjectsCopy)
    }
    const handleSelectRandom = () => {
        // selecte between 14 and 20 items
        const itemQuantity = Math.floor(Math.random() * 7) + 15
        const itemsCopy = [...items]
        const randomItems = itemsCopy.sort(() => Math.random() - 0.5).slice(0, itemQuantity)
        setSelectedItems(randomItems)
    }

    return (
        <div className='flex flex-col gap-4'>
            <p className="text-2xl">Choose your items:</p>
            <div className="flex flex-row gap-2 justify-center">
                <Button onClick={() => setSelectedItems([])}><HiOutlineRefresh />Clear</Button>
                <Button onClick={handleSelectRandom}><TbArrowsRandom /> Random</Button>
                <Button onClick={() => setSelectedItems(items)}><PiSelectionAllFill /> All</Button>
            </div>
            <div className="flex flex-row gap-2 flex-wrap  items-center justify-center">
                {items.map((object, index) => {
                    return (
                        <>
                            <div
                                key={index}
                                className={classNames({
                                    "flex flex-col rounded-xl border p-8 items-center w-32 cursor-pointer": true,
                                    "bg-green-600": selectedItems.includes(object),
                                }

                                )}
                                onMouseMove={() => setHoveredItem(object)}
                                onMouseOut={() => setHoveredItem(undefined)}
                                onClick={() => handleSelectItem(object)}
                            >
                                <object.icon size={40} />
                            </div>
                        </>
                    )
                })}
                <ItemTooltip item={hoveredItem} selectedItems={selectedItems} />
            </div>
        </div>
    )
}
