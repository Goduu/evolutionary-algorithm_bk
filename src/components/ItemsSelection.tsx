import React, { FC, useState } from 'react'
import { items } from './items'
import classNames from 'classnames'
import { Item } from '@/client'
import { ItemTooltip } from './ItemTooltip'
import { Button } from './Button'
import { HiOutlineRefresh, TbArrowsRandom, PiSelectionAllFill } from './Icons'

type ItemsSelectionProps = {
    selectedItems: Item[]
    setSelectedItems: (items: Item[]) => void
    selectedBag?: number
}
export const ItemsSelection: FC<ItemsSelectionProps> = ({ selectedItems, setSelectedItems, selectedBag }) => {
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

    const istItemSelected = (item: Item) => {
        return selectedItems.find((selectedItem) => selectedItem.id === item.id)
    }

    return (
        <div className='flex flex-col gap-4'>
            <p className="text-2xl">Choose your items:</p>
            <div className="flex flex-row gap-2 justify-center">
                <Button onClick={() => setSelectedItems([])}><HiOutlineRefresh  width={20} />Clear</Button>
                <Button onClick={handleSelectRandom}><TbArrowsRandom width={20} className='fill-current'/> Random</Button>
                <Button onClick={() => setSelectedItems(items)}><PiSelectionAllFill width={20} className='fill-current'/> All</Button>
            </div>
            <div className="flex flex-row gap-2 flex-wrap  items-center justify-center">
                {items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={classNames({
                                "flex flex-col rounded-xl border p-8 items-center w-28 cursor-pointer": true,
                                "bg-green-600": istItemSelected(item),
                            }

                            )}
                            onMouseMove={() => setHoveredItem(item)}
                            onMouseOut={() => setHoveredItem(undefined)}
                            onClick={() => handleSelectItem(item)}
                        >
                            <item.icon className='h-10 w-10 fill-current' />
                        </div>
                    )
                })}
                <ItemTooltip item={hoveredItem} selectedItems={selectedItems} selectedBag={selectedBag} />
            </div>
        </div>
    )
}
