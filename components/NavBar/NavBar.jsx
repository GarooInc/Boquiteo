import React from 'react'
import { useRouter, usePathname } from "next/navigation"



const NavBar = () => {
    const router = useRouter()
    const pathname = usePathname()


    const menu = [
        { name: "Call Center", link: "/" },
        { name: "Cocina", link: "/cocina" },
        { name: "Entrega", link: "/entrega" },
    ]

    const navigateTo = (link) => {
        router.push(link)
    }

    // Función para determinar si el enlace es la ruta activa
    const isActive = (link) => {
        return link === pathname
    }

  return (
    <div className='lg:h-[200px] w-full flex lg:flex-row flex-col  justify-center items-center'>
        <img src='/assets/logoboquiteo.png' alt='logo' className='w-1/5 h-[100px] m-auto object-cover' />
        <div className='flex flex-col lg:flex-row gap-6 p-10 w-full lg:w-4/5'>
            {
                menu.map((item, index) => {
                    const buttonClass = isActive(item.link)
                        ? 'w-full block text-center text-white bg-orange p-2 font-bold border-2 border-orange rounded-md'
                        : 'w-full block text-center text-black hover:bg-orange hover:text-white p-2 font-bold border-2 border-orange rounded-md';
                    return (
                        <div key={index} className='w-full px-8'>
                            <button className={buttonClass} onClick={() => navigateTo(item.link)}>{item.name}</button>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default NavBar
