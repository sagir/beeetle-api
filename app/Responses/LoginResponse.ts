import { OpaqueTokenContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/User'

interface LoginResponse {
  token: OpaqueTokenContract<User>
  user: User
}

export default LoginResponse
