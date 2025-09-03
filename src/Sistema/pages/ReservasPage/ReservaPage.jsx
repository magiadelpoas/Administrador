import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ListaView } from '../../views/reservas/lista/ListaView'
import { ListaConfirmadasView } from '../../views/reservas/listaConfirmadas/ListaConfirmadasView'
import { CrearView } from '../../views/reservas/crear/CrearView'
import { EditarView } from '../../views/reservas/editar/EditarView'

export const ReservaPage = () => {
  return (
    <Routes>
      <Route path="/listar" element={<ListaView />} />
      <Route path="/confirmadas" element={<ListaConfirmadasView />} />
      <Route path="/crear" element={<CrearView />} />
      <Route path="/editar/:id" element={<EditarView />} />
    </Routes>
  )
}
