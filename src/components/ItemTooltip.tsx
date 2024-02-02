import { Item } from '@/client'
import classNames from 'classnames'
import { FC } from 'react'

type ItemTooltipProps = {
    item: Item | undefined
    selectedItems: Item[]
}

export const ItemTooltip: FC<ItemTooltipProps> = ({ item, selectedItems }) => {
    return (
        <div
            className={classNames({
                "flex justify-between px-8 h-24 fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 transition-opacity duration-300": true,
                "hidden": selectedItems.length === 0 && !item,
            })}
        >
            <div>
                {item &&
                    <>
                        <p>Name: {item.name}</p>
                        <p>Price: ${item.price}</p>
                        <p>Weight: {item.weight}kg</p>
                    </>
                }
            </div>
            <div>
                <p>
                    Items selected: {selectedItems.length}
                </p>
                <p>
                    Total Weight: {selectedItems.reduce((acc, item) => acc + item.weight, 0).toFixed(2)}kg
                </p>
            </div>
        </div>
    )
}
