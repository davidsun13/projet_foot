import Header from './components/header'
import Footer from './components/footer'
//import Connexion from './components/connexion'
import Sidebar from './components/sidebar'
import DashboardContent from './components/dashboardcontent'
import './App.css'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <DashboardContent />
      </div>
    </div>
    </>
  )
}

export default App
