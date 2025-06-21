import React from 'react'

// Icons
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';

type Props = {}

const Navbar = ({}: Props) => {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-20 w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
            <p className='flex items-center justify-center gap-2'>
                <h2 className='text-gray-500 text-3xl'>Wheather</h2>
                <MdWbSunny  className='text-3xl mt-1 text-yellow-300'/>
            </p>

            <section className='flex gap-2 items-center'>
                <MdMyLocation className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer' />
                <MdOutlineLocationOn  className='text-3xl'/>
                <p className='text-sm text-slate-900/80'>Gaza</p>
                <div>
                  <SearchBox />
                </div>
            </section>
        </div>
    </nav>
  )
}

export default Navbar
