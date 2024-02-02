import { FC, ReactNode } from 'react'

type ButtonProps = {
    onClick: () => void,
    children: ReactNode
}

export const Button: FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button onClick={onClick} className="flex items-center gap-1 bg-transparent hover:bg-cyan-500 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded">
            {children}
        </button>
    )
}
