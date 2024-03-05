"use client";
import React, {useState, useEffect} from 'react'
import NavBar from '@/components/NavBar/NavBar';


const PrincipalPage = () => {
    const [data , setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [orderStatus, setOrderStatus] = useState('')

    const filteredData = data ? data.filter(item =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_number.toString().includes(searchTerm)
    ).filter(item => orderStatus ? item.status === orderStatus : true
    ) : []
       

    const fetchData = async () => {
        const response = await fetch("https://boquiteo-garoo.koyeb.app/api/orders")
        const data = await response.json()
        if (data.status === 200) {
            setData(data.data)
        }

    }

    const handleStatusChange = (e) => {
        setOrderStatus(e.target.value)
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
        <div className='flex h-full  flex-col'>
            <NavBar />
            <div className='w-full bg-light-gray h-full flex flex-col justify-start items-center'>
            <div className='w-full flex justify-center items-center h-[180px]'>
                    <input
                        type='text'
                        placeholder='Buscar orden'
                        className='w-2/3 m-4 p-2 rounded-md'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className='flex flex-col items-center'>
                        <button onClick={()=> setShowDropdown(!showDropdown)}  className="text-white bg-orange focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">Filtrar 
                            {
                                showDropdown ? 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 7.414l6.293 6.293 1.414-1.414L10 4.586 2.293 12.293l1.414 1.414L10 7.414z" clipRule="evenodd" />
                                </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 12.586l-6.293-6.293-1.414 1.414L10 15.414l7.707-7.707-1.414-1.414L10 12.586z" clipRule="evenodd" />
                                </svg>
                            }
                        </button>
                        <div className={`${showDropdown ? 'block' : 'hidden'} p-2 z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}>
                            <ul class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                            <li>
                            <div className="flex items-center">
                                <input onChange={handleStatusChange} value="Esperando al repartidor" name="order-status" type="radio" className="focus:ring-blue-500 focus:bg-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600" checked={orderStatus === "ESPERANDO_AL_REPARTIDOR"} />
                                <label className="ml-3">Esperando al repartidor</label>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                <input onChange={handleStatusChange} value="Confirmado" name="order-status" type="radio" className="focus:ring-blue-500 focus:bg-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600" checked={orderStatus === "CONFIRMADO"} />
                                <label className="ml-3">Confirmado</label>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                <input onChange={handleStatusChange} value="Orden completada" name="order-status" type="radio" className="focus:ring-blue-500 focus:bg-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600" checked={orderStatus === "ORDEN_COMPLETADA"} />
                                <label className="ml-3">Orden completada</label>
                                </div>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='px-8 columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-2 lg:columns-3 [&>div:not(:first-child)]:mt-8'>
                    {
                        filteredData.map((item) => {
                            return (
                                <div key={item._id} className='lg:w-full lg:m-0 mx-4 w-full bg-white p-4 rounded-md border-2 border-dark-gray flex flex-col items-start justify-start gap-2  overflow-y-auto'>
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