import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoleService {
  public static async getPaginatedRoles(
    { request }: HttpContextContract,
    active = true
  ): Promise<ModelPaginatorContract<Role>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')

    const query = Role.query()
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page || 1, perPage || 10)
  }
}
