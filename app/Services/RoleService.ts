import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class RoleService {
  public static async getPaginatedRoles(
    { request }: HttpContextContract,
    active: boolean = true
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

    return await query.paginate(page, perPage)
  }

  public static async saveRole({ request }: HttpContextContract, role: Role): Promise<Role | null> {
    const trx = await Database.transaction()

    role.name = request.input('name')
    role.slug = request.input('slug')
    role.description = request.input('description', undefined)

    const permissions = request.input('permissions') as number[]
    const dependencies = await Database.from('permission_dependency')
      .whereIn('permission_id', permissions)
      .select('depends_on')
      .exec()

    const allPermissions = [...permissions, ...dependencies.map((item) => item.depends_on)]

    try {
      await role.useTransaction(trx).save()
      await role.related('permissions').sync(
        [...new Set(allPermissions)], // unique items only
        undefined,
        trx
      )
      await trx.commit()
    } catch (error) {
      trx.rollback()
      return null
    }

    return role
  }

  public static async updateState(slug: string, activate: boolean = true): Promise<boolean> {
    const role = await Role.findByOrFail('slug', slug)

    if (!activate && role.id === 1) {
      return false
    }

    role.deactivatedAt = activate ? undefined : DateTime.now()
    await role.save()
    return true
  }
}
