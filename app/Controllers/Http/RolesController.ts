import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Role from 'App/Models/Role';

export default class RolesController {
  public async index ({ bouncer, request }: HttpContextContract): Promise<ModelPaginatorContract<Role>> {
    await bouncer.with('RolePolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('sortBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = Role.query()

    if (active !== undefined) {
      query.withScopes(q => !!active ? q.active() : q.inactive())
    }

    query.orderBy(orderBy, orderDirection === 'desc' ? 'desc': 'asc')
    return await query.paginate(page, perPage)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
