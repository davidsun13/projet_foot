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
import ClotureMatch from './components/ClotureMatch'
import MesCotisations from './components/MesCotisations'
import MentionsLegales from './components/MentionsLegales'
import PolitiqueConfidentialite from './components/PolitiqueConfidentialite'
import Contact from './components/Contact'
import CookieConsent from './components/CookieConsent'
import ProtectedRoute from './components/ProtectedRoute'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
            {children}
          </main>
        </div>
        <Footer />
        <CookieConsent />
      </div>
    </ProtectedRoute>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/connexion" element={<PublicLayout><Connexion /></PublicLayout>} />
        <Route path="/inscription" element={<PublicLayout><Inscription /></PublicLayout>} />
        <Route path="/mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />
        <Route path="/confidentialite" element={<PublicLayout><PolitiqueConfidentialite /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={<ProtectedLayout><DashboardContent /></ProtectedLayout>} />
        
        <Route path="/entrainements" element={<ProtectedLayout><ListeEntrainements /></ProtectedLayout>} />
        <Route path="/entrainements/creer" element={<ProtectedLayout><CreationEntrainement /></ProtectedLayout>} />
        <Route path="/entrainements/modifier/:id_entrainement" element={<ProtectedLayout><ModifEntrainement /></ProtectedLayout>} />

        <Route path="/matchs" element={<ProtectedLayout><ListeMatchs /></ProtectedLayout>} />
        <Route path="/matchs/creer" element={<ProtectedLayout><CreationMatch /></ProtectedLayout>} />
        <Route path="/matchs/modifier/:id_match" element={<ProtectedLayout><ModifMatch /></ProtectedLayout>} />
        <Route path="/matchs/cloturer/:id_match" element={<ProtectedLayout><ClotureMatch /></ProtectedLayout>} />

        <Route path="/cotisations" element={<ProtectedLayout><GestionCotisations /></ProtectedLayout>} />
        <Route path="/cotisations/ajouter" element={<ProtectedLayout><CreationCotisation /></ProtectedLayout>} />

        <Route path="/mes-cotisations" element={<ProtectedLayout><MesCotisations /></ProtectedLayout>} />

        <Route path="/players" element={<ProtectedLayout><ListeJoueurs /></ProtectedLayout>} />
        <Route path="/joueurs/modifier/:id_player" element={<ProtectedLayout><ModifPlayer /></ProtectedLayout>} />
        <Route path="/joueurs/:id_player" element={<ProtectedLayout><DetailsPlayer /></ProtectedLayout>} />

        <Route path="/player-profile/:id_player" element={<ProtectedLayout><ProfilePlayer /></ProtectedLayout>} />
        <Route path="/convocations/:id_player" element={<ProtectedLayout><ConvocationsPlayer /></ProtectedLayout>} />
        <Route path="/convocations/training/:id_training" element={<ProtectedLayout><ConvocationTrainingDetail /></ProtectedLayout>} />
        <Route path="/convocations/match/:id_match" element={<ProtectedLayout><ConvocationMatchDetail /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
