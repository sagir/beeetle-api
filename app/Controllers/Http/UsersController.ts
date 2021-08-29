import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<User>> {
    await bouncer.with('UserPolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = User.query()

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive()))
    }

    return await query.orderBy(orderBy, orderDirection).paginate(page, perPage)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('create')

    await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(3),
          rules.maxLength(100),
        ]),
        email: schema.string({ trim: true }, [
          rules.required(),
          rules.email(),
          rules.unique({
            table: 'users',
            column: 'email',
          }),
        ]),
        password: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(6),
          rules.maxLength(16),
        ]),
        roles: schema
          .array([rules.required(), rules.minLength(1)])
          .members(schema.number([rules.unsigned()])),
      }),
    })

    const user = new User()
    const trx = await Database.transaction()

    user.name = request.input('name')
    user.email = request.input('email')
    user.password = request.input('password')

    try {
      await user.useTransaction(trx).save()
      await user.related('roles').attach(request.input('roles'), trx)
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

    return response.created(user)
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async activate({}: HttpContextContract) {}

  public async deactivate({}: HttpContextContract) {}

  public async roles({}: HttpContextContract) {}

  public async permissions({}: HttpContextContract) {}
}
