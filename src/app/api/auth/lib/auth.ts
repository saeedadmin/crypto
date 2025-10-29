export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}