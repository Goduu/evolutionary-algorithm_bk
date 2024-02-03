import classNames from 'classnames';
import React, { FC } from 'react'
import { CiBag1 } from "react-icons/ci";

const bags = [
    { iconSize: 30, weight: 6 },
    { iconSize: 40, weight: 8 },
    { iconSize: 55, weight: 10 },
]
type BagsProps = {
    selectedBag: number | undefined
    setSelectedBag: (bag: number) => void
}
export const Bags: FC<BagsProps> = ({ selectedBag: chosenBag, setSelectedBag: setChosenBag }) => {

    return (
        <div className='flex flex-col gap-2 '>
            <p className='text-2xl'>Choose your bag size:</p>

            <div className='flex gap-2 justify-center'>
                {bags.map((bag, index) => (
                    <div key={bag.weight} className={classNames({
                        'flex flex-col rounded-xl border p-8 justify-center items-center w-28 cursor-pointer': true,
                        'bg-teal-600': chosenBag === bag.weight
                    })}
                        onClick={() => setChosenBag(bag.weight)}>
                        <CiBag1 size={bag.iconSize} />
                        <p>{bag.weight}kg</p>
                    </div>)
                )}

            </div>
        </div >
    )
}
