"use client";
import React, {useState, useEffect} from 'react'
import NavBar from '@/components/NavBar/NavBar'
import { FaRegCircleCheck } from "react-icons/fa6"
import { GiCancel } from "react-icons/gi"
import ConfirmDialog from '@/components/ConfirmDialog.jsx/ConfirmDialog'
import { DateTime } from 'luxon'

const PageCocina = () => {
    const [data , setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [refreshIndicator, setRefreshIndicator] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentAction, setCurrentAction] = useState(() => () => {})
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState('')
  
    // Función para manejar la confirmación
  const handleConfirm = () => {
    currentAction();
    setIsDialogOpen(false); // Cierra el diálogo después de confirmar
  }

  // Función para abrir el diálogo de confirmación con una acción específica
  const promptConfirm = (action) => {
    setCurrentAction(() => action)
    setIsDialogOpen(true)
  }


    const filteredData = data ? data.filter(item =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order_number.toString().includes(searchTerm)
    ) : []
       

    const fetchData = async () => {
        
        const response = await fetch("https://boquiteo-garoo.koyeb.app/api/kitchen/orders")
        const data = await response.json()
        if (data.status === 200) {
            setData(data.data)
        }
    }

    const confirmOrder = async (id, line_items) => {   
        const pendingItems = line_items.filter(item => item.status === 'Pendiente') 
        const response = await fetch (`https://boquiteo-garoo.koyeb.app/api/kitchen/orders`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "order_id": id,
                "status": true
            })
        })

        const data = await response.json()
        if (data.status === 200) {
            setRefreshIndicator(prev => prev + 1)
        }
        else {
            setPopupMessage("Los siguientes platillos no están listos: " + pendingItems.map(item => item.name).join(', '))
            setShowPopup(true)
        }

    }


    const updateOrder = async (idItem, idOrder, orderStatus) => {
        let isReady = false
        if (orderStatus === 'Listo') {
            isReady = false
        }
        else {
            isReady = true
        }
        const response = await fetch(`https://boquiteo-garoo.koyeb.app/api/kitchen/orders/items`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "item_id": idItem,
                "item_ready": isReady,
                "order_id": idOrder
            })
        })
        const data = await response.json()
        if (data.status === 200) {
            setRefreshIndicator(prev => prev + 1)
        }
        
    }
        

    useEffect(() => {
        setInterval(() => {
            fetchData()

        }
        , 5000)
    }
    , [])

    useEffect(() => {
        fetchData()
    }, [refreshIndicator])

  return (
    <div className='w-full isolate h-screen'>
        <div className='flex h-full lg:flex-row flex-col'>
            <NavBar />
            <div className='w-full bg-light-gray h-full flex flex-col justify-start items-center'>
                <input
                    type='text'
                    placeholder='Buscar orden'
                    className='w-2/3 m-4 p-2 rounded-md'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='flex flex-wrap justify-center gap-4 w-full overflow-y-auto'>
                    {
                        filteredData.map((item) => {
                            const timeOrderConfirmed = DateTime.fromISO(item.time_order_confirmed)
                            const timeInGuatemala = DateTime.fromISO(timeOrderConfirmed).setZone('America/Guatemala').toFormat('HH:mm:ss')
                            return (
                                <div key={item._id} className='lg:w-1/3 lg:m-0 mx-4 w-full bg-white p-4 rounded-md border-2 border-dark-gray flex flex-col items-start justify-start gap-2 h-[350px] overflow-y-auto'>
                                    <div className='flex flex-col w-full'>
                                        <div className='flex justify-end w-full'>
                                            <p className='text-lg text-orange'>Hora confirmación: {timeInGuatemala}</p>
                                        </div>
                                        <h1 className='text-xl font-bold'>Order #{item.order_number}</h1>
                                        <p className='text-l text-dark-gray uppercase'>{item.customer}</p>
                                    </div>
                                    <p className='text-lg'>{item.description}</p>
                                    <p className='text-lg'>{item.price}</p>
                                    {
                                        item.line_items.map((line_item, index) => {
                                            const isItemReady = line_item.status === 'Listo'
                                            return (
                                                    <div className='flex justify-center items-center w-full'>
                                                        <div key={index} className='flex flex-col border-b-2 border-dark-gray w-full p-2'>
                                                            <p className='text-lg'>{line_item.name}</p>
                                                            <p className='text-lg text-gray'>Cocina: {line_item.vendor}</p>
                                                            <div className='flex flex-row justify-between'>
                                                                <p className='text-lg'>Qty: {line_item.quantity}</p>
                                                                <p className='text-lg font-bold'>Q{line_item.price}</p>
                                                            </div>
                                                            {line_item.variant && <p className='text-lg text-orange'>Variante: {line_item.variant}</p>}
                                                            {line_item.options && <p className='text-lg text-gray'>
                                                                {line_item.options.map((option, index) => {
                                                                    return (
                                                                        <p key={index} className='text-lg text-black'>{option}</p>
                                                                    )
                                                                }
                                                                )
                                                            }
                                                            </p>}
                                                            {line_item.comments && <p className='text-lg text-gray'>{line_item.comments}</p>}
                                                            <p className='text-lg'>Status Platillo: {line_item.status}</p>
                                                        </div>
                                                        <button className={`text-white p-2 rounded-md h-20 w-20 flex justify-center items-center ${isItemReady ? "bg-red-500" : "bg-green-500"} hover:brightness-110`}
                                                        onClick={() => promptConfirm(() => updateOrder(line_item.item, item.order_number, line_item.status))}>
                                                        {isItemReady ? <GiCancel/> : <FaRegCircleCheck />}
                                                        </button>
                                                    </div>
                                            )

                                        }
                                        )
                                        
                                    }
                                    <button className='text-white px-2 py-4 rounded-md w-full bg-gray flex justify-center items-center hover:bg-green-500' onClick={() => promptConfirm(() => confirmOrder(item.order_number, item.line_items))}>
                                        Completar Orden
                                    </button>
                                </div>
                            )
                        }
                    )      
                    }
                </div>
                {
                    showPopup && (
                        <div className='fixed right-0 bg-gray p-10 m-4 rounded-md max-w-[300px]'>
                            <p className='text-white font-bold my-2'>No se pudo completar la acción</p>
                            <p className='text-white'>{popupMessage}</p>
                            <button className='text-white p-2 mt-2 rounded-md bg-red-500 w-full' onClick={() => setShowPopup(false)}>Cerrar</button>
                        </div>
                    )
                }
            </div>
        </div>
        <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsDialogOpen(false)}
        message="¿Estás seguro de que quieres realizar esta acción?"
      />
    </div>
  )
}

export default PageCocina