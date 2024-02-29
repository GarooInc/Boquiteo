"use client";
import React, {useState, useEffect} from 'react'
import NavBar from '@/components/NavBar/NavBar';


const PrincipalPage = () => {
    const [data , setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = data ? data.filter(item =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_number.toString().includes(searchTerm)
    ) : []
       

    const fetchData = async () => {
        const response = await fetch("https://boquiteo-garoo.koyeb.app/api/orders")
        const data = await response.json()
        if (data.status === 200) {
            setData(data.data)
        }

    }

    useEffect(() => {
        setInterval(() => {
            fetchData()

        }
        , 5000)
    }
    , [])

  return (
    <div className='w-full isolate h-screen'>
        <div className='flex h-full lg:flex-row flex-col'>
            <NavBar />
            <div className='w-full bg-light-gray h-full flex flex-col justify-start items-center'>
                <input
                    type='text'
                    placeholder='Buscar orden'
                    className='w-2/3 m-4 p-2 rounded-md border-2 border-dark-gray'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='flex flex-wrap justify-center gap-4 w-full overflow-y-auto'>
                    {
                        filteredData.map((item) => {
                            return (
                                <div key={item._id} className='lg:w-1/3 lg:m-0 mx-4 w-full bg-white p-4 rounded-md border-2 border-dark-gray flex flex-col items-start justify-start gap-2 h-[350px] overflow-y-auto'>
                                    <div className='flex flex-col'>
                                        <h1 className='text-xl font-bold'>Order #{item.order_number}</h1>
                                        <p className='text-l text-dark-gray uppercase'>{item.customer}</p>
                                        <p className={`text-lg uppercase ${item.status === 'Orden completada' ? 'text-green-500' : 'text-gray'}`}>{item.status}</p>
                                    </div>
                                    <p className='text-lg'>{item.description}</p>
                                    <p className='text-lg'>{item.price}</p>
                                    {
                                        item.line_items.map((line_item, index) => {
                                            return (
                                                <div key={index} className='flex flex-col border-b-2 border-dark-gray w-full p-2'>
                                                    <p className='text-lg bg-light-gray rounded-md'>{line_item.name}</p>
                                                    <p className='text-lg text-gray'>Cocina: {line_item.vendor}</p>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className='text-lg font-bold'>Qty: {line_item.quantity}</p>
                                                        <p className='text-lg font-bold'>Q{line_item.price}</p>
                                                    </div>
                                                    {line_item.variant && <p className='text-lg text-orange'>Variante: {line_item.variant}</p>}
                                                    {line_item.options && <p className='text-lg text-gray'>
                                                        {line_item.options.map((option, index) => {
                                                            return (
                                                                <p key={index} className='text-lg text-gray'>{option}</p>
                                                            )
                                                        }
                                                        )
                                                    }
                                                    </p>}
                                                    {line_item.comments && <p className='text-lg text-gray'>Comentarios: {line_item.comments}</p>}
                                                    <p className='text-lg text-dark-gray'>Status: {line_item.status}</p>
                                                </div>
                                            )

                                        }
                                        )
                                        
                                    }
                                </div>
                            )
                        }
                    )      
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default PrincipalPage