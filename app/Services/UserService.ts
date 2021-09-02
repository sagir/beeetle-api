import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserService {
  public static async getPaginatedUsers(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<User>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')
    const roleId = request.input('roleId')

    const query = User.query()
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
      })
    }

    if (roleId) {
      query.andWhereHas('roles', (rolesQuery) => {
        rolesQuery.where('id', roleId)

        if (active) {
          rolesQuery.withScopes((q) => q.active())
        }
      })
    }

    return query.paginate(page, perPage)
  }
}
