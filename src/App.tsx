import Header from './components/header'
import Footer from './components/footer'
import Connexion from './components/connexion'
import Inscription from './components/inscription'
import './App.css'
import DashboardContent from './components/dashboardcontent'
import Sidebar from './components/sidebar'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <DashboardContent />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
