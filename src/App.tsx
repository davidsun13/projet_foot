import Header from './components/header'
import Footer from './components/footer'
import Connexion from './components/connexion'
import Inscription from './components/inscription'
import DashboardContent from './components/dashboardcontent'
import Sidebar from './components/sidebar'
import CreationEntrainement from './components/creationentrainement'
import GestionCotisations from './components/GestionCotisations'
import ListeEntrainements from './components/ListeEntrainements'
import ListeJoueurs from './components/ListeJoueurs'
import ListeMatchs from './components/ListeMatchs'
import CreationMatch from './components/CreationMatch'
import ModifPlayer from './components/ModifPlayer'
import ModifEntrainement from './components/Modifentrainement'
import ModifMatch from './components/Modifmatch'
import ProfilePlayer from './components/profileplayer'
import ConvocationsPlayer from './components/convocationsplayer'
import ConvocationTrainingDetail from './components/convocationTrainingDetail'
import ConvocationMatchDetail from './components/convocationMatchDetail'
import CreationCotisation from './components/CreationCotisation'
import DetailsPlayer from './components/detailsPlayer'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen flex flex-col">

        {/* HEADER */}
        <Header />

        {/* LAYOUT PRINCIPAL */}
        <div className="flex flex-1">

          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENU */}
          <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">

            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />

              <Route path="/entrainements" element={<ListeEntrainements />} />
              <Route path="/entrainements/creer" element={<CreationEntrainement />} />
              <Route path="/entrainements/modifier/:id_entrainement" element={<ModifEntrainement />} />

              <Route path="/matchs" element={<ListeMatchs />} />
              <Route path="/matchs/creer" element={<CreationMatch />} />
              <Route path="/matchs/modifier/:id_match" element={<ModifMatch />} />

              <Route path="/cotisations" element={<GestionCotisations />} />
              <Route path="/cotisations/ajouter" element={<CreationCotisation />} />

              <Route path="/players" element={<ListeJoueurs />} />
              <Route path="/joueurs/modifier/:id_player" element={<ModifPlayer />} />
              <Route path="/joueurs/:id_player" element={<DetailsPlayer />} />

              <Route path="/player-profile/:id_player" element={<ProfilePlayer />} />
              <Route path="/convocations/:id_player" element={<ConvocationsPlayer />} />
              <Route path="/convocations/training/:id_training" element={<ConvocationTrainingDetail />} />
              <Route path="/convocations/match/:id_match" element={<ConvocationMatchDetail />} />
            </Routes>

          </main>

        </div>

        {/* FOOTER */}
        <Footer />

      </div>

    </BrowserRouter>
  )
}

export default App
