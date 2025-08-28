import React from 'react'
import LeftMenu from '../components/LeftMenu'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/Header'

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <LeftMenu />
            <div className="flex flex-col flex-1">
                <AppHeader />
                <main className="flex-1 p-6 bg-white dark:bg-gray-900 text-black dark:text-white">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
