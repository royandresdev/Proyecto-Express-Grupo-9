import './App.css'
import Chat from './components/Chat'
import ParticipacionCard from './components/dashboard-ia/ParticipacionCard'
import EmocionalCard from './components/dashboard-ia/EmocionalCard'
import ClaridadCard from './components/dashboard-ia/ClaridadCard'
import DecicionesCard from './components/dashboard-ia/DecicionesCard'
import SugerenciasIaCard from './components/dashboard-ia/SugerenciasIaCard'
import DashboardHeader from './components/dashboard-ia/DashboardHeader'
import Header from './components/Header'

function App() {
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
          <DecicionesCard />
          <SugerenciasIaCard />
        </div>
      </div>
    </div>
  )
}

export default App
