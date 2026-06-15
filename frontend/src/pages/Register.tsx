import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate }  from 'react-router-dom'
import { Dumbbell }           from 'lucide-react'
import toast                  from 'react-hot-toast'
import { useAuth }            from '../hooks/useAuth'

// Classes CSS réutilisées (DRY)
const inputCls = 'w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700'
  + ' rounded-lg text-sm text-slate-100 placeholder-slate-500'
  + ' focus:outline-none focus:ring-2 focus:ring-indigo-500'
  + ' focus:border-transparent transition-colors'
const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '', email: '', password: '', weight: '', goal: 'maintain'
  })

  // Gestion unifiée de tous les champs via name/value
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Spread operator + computed key : met à jour le bon champ dynamiquement
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({
        username: form.username,
        email:    form.email,
        password: form.password,
        weight:   form.weight ? Number(form.weight) : undefined,
        goal:     form.goal,
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.error
      toast.error(message || "Erreur lors de l'inscription")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
      
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
            rounded-2xl bg-gradient-to-br from-prussian to-dusk mb-4">
            <Dumbbell size={28} className="text-alabaster" />
          </div>
          <h1 className="text-2xl font-bold text-alabaster">FitTrack</h1>
          <p className="text-lavander text-sm mt-1">Crée ton compte gratuitement</p>
        </div>
        <div className="bg-prussian border border-dusk/50 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className={labelCls}>Nom d'utilisateur</label>
              <input name="username" required value={form.username}
                onChange={handleChange} className={inputCls} placeholder="johndoe"/>
            </div>
            <div><label className={labelCls}>Email</label>
              <input name="email" type="email" required value={form.email}
                onChange={handleChange} className={inputCls} placeholder="ton@email.com"/>
            </div>
            <div><label className={labelCls}>Mot de passe</label>
              <input name="password" type="password" required minLength={6}
                value={form.password} onChange={handleChange}
                className={inputCls} placeholder="6 caractères minimum"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Poids (kg)</label>
                <input name="weight" type="number" step="0.1" min="30" max="300"
                  value={form.weight} onChange={handleChange}
                  className={inputCls} placeholder="75"/>
              </div>
              <div><label className={labelCls}>Objectif</label>
                <select name="goal" value={form.goal}
                  onChange={handleChange} className={inputCls}>
                  <option value="lose">Perdre</option>
                  <option value="maintain">Maintenir</option>
                  <option value="gain">Prendre</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-dusk hover:bg-lavender
                disabled:bg-prussian disabled:text-lavender text-alabaster font-semibold py-2.5
                rounded-lg transition-colors text-sm mt-2">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
          <p className="text-center text-sm text-alabaster mt-5">
            Déjà un compte ?{/* */}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300
              font-medium transition-colors"> Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}