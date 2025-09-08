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

import HostelList from './pages/Master/Hostel/List'
import HostelAdd from './pages/Master/Hostel/Add'
import HostelView from './pages/Master/Hostel/View'
import HostelEdit from './pages/Master/Hostel/Edit'


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

              <Route path="/master">
                <Route path='location'>
                  <Route path="list" element={<List />} />
                  <Route path="add" element={<Add />} />
                  <Route path="view/:id" element={<View />} />
                  <Route path="edit/:id" element={<Edit />} />
                </Route>

                <Route path='hostel'>
                  <Route path="list" element={<HostelList />} />
                  <Route path="add" element={<HostelAdd />} />
                  <Route path="view/:id" element={<HostelView />} />
                  <Route path="edit/:id" element={<HostelEdit />} />
                </Route>
              </Route>
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider >
    </ThemeContextProvider>
  )
}

export default App
