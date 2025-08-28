import { useState } from 'react'
import viteLogo from '/vite.svg'
import LoginForm from './pages/login/LoginForm'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import { AuthContextProvider as AuthProvider } from './context/AuthContext'
import PublicRoutes from './Routes/PublicRoutes'
import PrivateRoutes from './Routes/PrivateRoutes'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Location from './pages/Master/location'
import { ThemeContextProvider } from './context/ThemeContext'


function App() {

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <div className=''>
          <Routes>
            <Route path='/' element={<PublicRoutes><LoginForm /></PublicRoutes>} ></Route>
            <Route path='/login' element={<PublicRoutes><LoginForm /></PublicRoutes>} ></Route>
            <Route element={<PrivateRoutes><MainLayout /></PrivateRoutes>}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/home' element={<Home />} />
              <Route path='/master/location/list' element={<Location />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider >
    </ThemeContextProvider>
  )
}

export default App
