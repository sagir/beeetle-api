import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Role from 'App/Models/Role';
import RoleValidator from 'App/Validators/RoleValidator';

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

  public async store ({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('RolePolicy').authorize('view')
    await request.validate(RoleValidator)
    const role = new Role()

    role.name = request.input('name')
    role.slug = request.input('slug')
    role.description = request.input('description', undefined)

    await role.save()
    await role.related('permissions').attach(request.input('permissions'))

    return response.created(role)
  }

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
