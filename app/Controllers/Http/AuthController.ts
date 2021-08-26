import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginCredentialValidator from 'App/Validators/LoginCredentialValidator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import LoginResponse from 'App/Responses/LoginResponse'

export default class AuthController {
  async login({ auth, request, response }: HttpContextContract): Promise<LoginResponse|void> {
    await request.validate(LoginCredentialValidator)

    const email = request.input('email')
    const password = request.input('password')
    const user = await User.query().withScopes(query => query.active()).where('email', email).first()

    if (user && await Hash.verify(user.password, password)) {
      const token = await auth.use('api').generate(user)
      return { token, user }
    }

    return response.badRequest('Invalid credentials.')
  }

  async logout({ auth, response }: HttpContextContract): Promise<void> {
    await auth.use('api').revoke()
    return response.ok({ revoked: true })
  }
}
