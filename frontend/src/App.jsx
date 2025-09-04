import { useState } from 'react'
import viteLogo from '/vite.svg'
import { ToastContainer } from "react-toastify";
import LoginForm from './pages/login/LoginForm'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import { AuthContextProvider as AuthProvider } from './context/AuthContext'
import PublicRoutes from './Routes/PublicRoutes'
import PrivateRoutes from './Routes/PrivateRoutes'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import { ThemeContextProvider } from './context/ThemeContext'
import List from './pages/Master/Location/List'
import Add from './pages/Master/Location/Add'
import View from './pages/Master/Location/View';
import Edit from './pages/Master/Location/Edit';


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
              <Route path='/master/location/list' element={<List />} />
              <Route path='/master/location/add' element={<Add />} />
              <Route path='/master/location/view/:id' element={<View />} />
              <Route path='/master/location/edit/:id' element={<Edit />} />
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider >
    </ThemeContextProvider>
  )
}

export default App
