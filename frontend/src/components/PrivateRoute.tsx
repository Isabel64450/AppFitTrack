import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner  from './LoadingSpinner'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  // Pendant la vérification du token au démarrage
  if (loading) return <LoadingSpinner />
  // Sans ce check, l'app flasherait vers /login avant de vérifier le token

  // Pas connecté : redirige vers la page de connexion
  if (!user) return <Navigate to="/login" replace />
  // replace : ne laisse pas /dashboard dans l'historique si non connecté

  // Connecté : rend les routes enfants via Outlet
  return <Outlet />
  // Outlet = emplacement où les routes enfants sont rendues
}

// Dans App.tsx, les routes protégées sont déclarées comme enfants :
// <Route element={<PrivateRoute />}>
//   <Route path="/dashboard" element={<Dashboard />} />
//   <Route path="/workouts"  element={<Workouts />} />
// </Route>