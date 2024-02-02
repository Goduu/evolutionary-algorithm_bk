import logo from '@/assets/logo.svg'
import { FC } from 'react'
import Image from 'next/image'

export const Header: FC = () => {
  return (
    <div className="flex flex-col items-center px-24">
      <header className="flex items-center justify-center py-10 w-11/12">
        <Image src={logo} width={50} height={50} alt="A representation of a DNA" />
        <div className="text-2xl md:text-4xl font-semibold sm:block">
          Evolutionary Algorithm
        </div>
      </header>
    </div>
  )
}

