import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import { User } from '../types'


interface AuthContextType {
  user: User | null              
  loading: boolean               
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}


interface RegisterData {
  username: string
  email: string
  password: string
  goal: 'lose' | 'maintain' | 'gain'
  weight?: number 
}


const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true) 
 
  useEffect(() => {
    const initAuth = async () => {
      try {
        
        const token = await AsyncStorage.getItem('token')
        if (token) {
          
          const res = await api.get('/auth/me')
          setUser(res.data.user) 
        }
      
      } catch {
       
        await AsyncStorage.removeItem('token')
      } finally {
        setLoading(false) 
      }
    }
    initAuth()
  }, []) 

  
  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    // Sauvegarde le token pour les prochains démarrages de l'app
    await AsyncStorage.setItem('token', res.data.token)
    setUser(res.data.user) // Mise à jour → RootNavigator bascule vers les onglets
  }

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data)
    await AsyncStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token') // Supprime le token du stockage
    setUser(null) // Mise à jour → RootNavigator revient à l'écran de connexion
  }

  // ── Rendu du Provider ───────────────────────────────────────
  // AuthContext.Provider rend les valeurs accessibles à tous les enfants
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook personnalisé ───────────────────────────────────────
// useAuth() est un "custom hook" : il encapsule useContext pour simplifier
// l'usage (pas besoin d'importer AuthContext dans chaque écran).
// Hook qui force une erreur claire si appelé hors du Provider,
// évitant un null silencieux difficile à déboguer.
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  // Vérification de sécurité : si useAuth est appelé hors de AuthProvider, erreur explicite
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}