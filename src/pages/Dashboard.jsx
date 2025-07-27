import React from 'react'
import Navbar from '../components/layouts/Navbar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default Dashboard
