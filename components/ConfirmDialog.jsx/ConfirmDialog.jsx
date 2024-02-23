import React from 'react'

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center lg:m-0 m-4">
        <p className="mb-4">{message}</p>
        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
