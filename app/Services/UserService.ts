import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

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

  public static async saveUser({ request }: HttpContextContract, user: User): Promise<User | null> {
    const trx = await Database.transaction()

    user.name = request.input('name')
    user.email = request.input('email')

    if (!user.id) {
      user.password = request.input('password')
    }

    try {
      await user.useTransaction(trx).save()
      await user.related('roles').sync(request.input('roles'), undefined, trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return null
    }

    return user
  }

  public static async updateState(userId: number, activate: boolean = true): Promise<boolean> {
    const user = await User.findOrFail(userId)

    if (!activate && user.id === 1) {
      return false
    }

    user.deactivatedAt = activate ? undefined : DateTime.now()
    await user.save()
    return true
  }
}
