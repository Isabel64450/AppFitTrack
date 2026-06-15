import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useState } from 'react'
import {Menu} from 'lucide-react'

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      <Sidebar open={open} setOpen={setOpen}/>
      <main className="flex-1 overflow-y-auto">
         <div className="lg:hidden flex items-center p-4 border-b border-slate-800">
          <button onClick={() => setOpen(true)}>
            <Menu className="text-white" />
          </button>
          <span className="ml-3 text-white font-semibold">FitTrack</span>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}