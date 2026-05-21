import { Dashboard, LoginPage, MatchesPage, TrainingsPage, CotisationsPage } from './presentation/pages';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
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
              <Route path="/matchs/cloturer/:id_match" element={<ClotureMatch />} />
              <Route path="/cotisations" element={<GestionCotisations />} />
              <Route path="/cotisations/ajouter" element={<CreationCotisation />} />
              <Route path="/mes-cotisations" element={<MesCotisations />} />
              <Route path="/players" element={<ListeJoueurs />} />
              <Route path="/joueurs/modifier/:id_player" element={<ModifPlayer />} />
              <Route path="/joueurs/:id_player" element={<DetailsPlayer />} />
              <Route path="/player-profile/:id_player" element={<ProfilePlayer />} />
              <Route path="/convocations/:id_player" element={<ConvocationsPlayer />} />
              <Route path="/convocations/training/:id_training" element={<ConvocationTrainingDetail />} />
              <Route path="/convocations/match/:id_match" element={<ConvocationMatchDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
