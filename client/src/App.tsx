import './App.css'
import Chat from './components/Chat'
import ParticipacionCard from './components/dashboard-ia/ParticipacionCard'
import EmocionalCard from './components/dashboard-ia/EmocionalCard'
import ClaridadCard from './components/dashboard-ia/ClaridadCard'
import DecicionesCard from './components/dashboard-ia/DecicionesCard'
import SugerenciasIaCard from './components/dashboard-ia/SugerenciasIaCard'
import DashboardHeader from './components/dashboard-ia/DashboardHeader'
import Header from './components/Header'
import { Button } from './components/ui/button'
import { useAuthStore } from './store/auth.store'
import { useNavigate } from 'react-router-dom'

function App() {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <Chat />
        <div className='overflow-y-scroll'>
          <DashboardHeader />
          <ParticipacionCard />
          <EmocionalCard />
          <ClaridadCard />
          <DecicionesCard  />
          <SugerenciasIaCard />
          <Button onClick={() => {
            logout()
            navigate('/login')
          }}>Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default App
