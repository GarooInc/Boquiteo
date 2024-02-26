"use client";
import React, {useState, useEffect} from 'react'
import NavBar from '@/components/NavBar/NavBar'
import { FaRegCircleCheck } from "react-icons/fa6"
import { GiCancel } from "react-icons/gi"
import ConfirmDialog from '@/components/ConfirmDialog.jsx/ConfirmDialog'

const PageCocina = () => {
    const [data , setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [refreshIndicator, setRefreshIndicator] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(() => () => {});
  
    // Función para manejar la confirmación
  const handleConfirm = () => {
    currentAction();
    setIsDialogOpen(false); // Cierra el diálogo después de confirmar
  }

  // Función para abrir el diálogo de confirmación con una acción específica
  const promptConfirm = (action) => {
    setCurrentAction(() => action);
    setIsDialogOpen(true);
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
        else {
            console.log("Error")
        }
        console.log(data)
    }

    const confirmOrder = async (id) => {    
        console.log(id)    
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
            console.log('Updated')
        }
        else {
            console.log('Error')
        }
    }


    const updateOrder = async (idItem, idOrder, orderStatus) => {
        let isReady = false
        console.log(idItem, idOrder)
        console.log(orderStatus)
        if (orderStatus === 'Listo') {
            isReady = false
        }
        else {
            isReady = true
            console.log(isReady)
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
            console.log('Updated')
        }
        else {
            console.log('Error')
        }            
    }
        

    useEffect(() => {
        fetchData()
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
                            return (
                                <div key={item._id} className='lg:w-1/3 lg:m-0 mx-4 w-full bg-white p-4 rounded-md border-2 border-dark-gray flex flex-col items-start justify-start gap-2 h-[350px] overflow-y-auto'>
                                    <div className='flex flex-col'>
                                        <h1 className='text-xl font-bold'>Order #{item.order_number}</h1>
                                        <p className='text-l text-dark-gray uppercase'>{item.customer}</p>
                                    </div>
                                    <p className='text-lg'>{item.description}</p>
                                    <p className='text-lg'>{item.price}</p>
                                    {
                                        item.line_items.map((line_item, index) => {
                                            const isItemReady = line_item.status === 'Listo'; // Asumiendo que 'listo' es un estado posible
                                            return (
                                                    <div className='flex justify-center items-center w-full'>
                                                        <div key={index} className='flex flex-col border-b-2 border-dark-gray w-full p-2'>
                                                            <p className='text-lg'>{line_item.name}</p>
                                                            <p className='text-lg text-gray'>Cocina: {line_item.vendor}</p>
                                                            <div className='flex flex-row justify-between'>
                                                                <p className='text-lg'>Qty: {line_item.quantity}</p>
                                                                <p className='text-lg font-bold'>Q{line_item.price}</p>
                                                            </div>
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
                                    <button className='text-white px-2 py-4 rounded-md w-full bg-gray flex justify-center items-center hover:bg-green-500' onClick={() => promptConfirm(() => confirmOrder(item.order_number))}>
                                        Completar Orden
                                    </button>
                                </div>
                            )
                        }
                    )      
                    }
                </div>
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