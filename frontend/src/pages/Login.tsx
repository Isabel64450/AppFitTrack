import { useState } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import { Dumbbell }            from 'lucide-react'
import toast                   from 'react-hot-toast'
import { useAuth }             from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()           // Empêche le rechargement de la page
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')    
    } catch (err: unknown) {
      const message =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined
      toast.error(message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
               bg-gradient-to-br from-prussian to-dusk mb-4">
            <Dumbbell size={28} className="text-alabaster" />
          </div>
          <h1 className="text-2xl font-bold text-alabaster">FitTrack</h1>
          <p className="text-lavander text-sm mt-1">Connecte-toi à ton espace</p>
        </div>

        <div className="bg-prussian border border-dusk/50 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-lavender mb-1.5">
                Email
              </label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-ink/40 border border-dusk
                  rounded-lg text-sm text-alabaster placeholder-lavender
                  focus:outline-none focus:ring-2 focus:ring-dusk
                  focus:border-transparent transition-colors"
                placeholder="ton@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-lavender mb-1.5">
                Mot de passe
              </label>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-ink/40 border border-dusk
                  rounded-lg text-sm text-alabaster placeholder-lavender
                  focus:outline-none focus:ring-2 focus:ring-dusk transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-dusk hover:bg-lavender
                disabled:bg-prussian disabled:text-lavender
                text-alabaster font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm text-lavender mt-5">
            Pas de compte ?
            <Link to="/register" className="text-dusk hover:text-alabaster
              font-medium transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}