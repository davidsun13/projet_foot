import Header from './components/header'
import Footer from './components/footer'
import Connexion from './components/connexion'
import Inscription from './components/inscription'
import DashboardContent from './components/dashboardcontent'
import Sidebar from './components/sidebar'
import CreationEntrainement from './components/creationentrainement'
import GestionCotisations from './components/GestionCotisations'
import ListeEntrainements from './components/ListeEntrainements'
import ListeMatchs from './components/ListeMatchs'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex flex-1">
          <Sidebar />

          <div className="flex-1 flex items-center justify-center p-4">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/entrainements" element={<ListeEntrainements />} />
              <Route path="/matchs" element={<ListeMatchs />} />
              <Route path="/entrainements/creer" element={<CreationEntrainement />} />
              <Route path="/cotisations" element={<GestionCotisations />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
