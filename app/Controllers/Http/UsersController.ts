import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'

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
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

    return response.created(user)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<User> {
    await bouncer.with('UserPolicy').authorize('view')
    return await User.findOrFail(params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('UserPolicy').authorize('update')
    const user = await User.findOrFail(ctx.params.id)

    await ctx.request.validate({
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
            whereNot: { id: user.id },
          }),
        ]),
        roles: schema
          .array([rules.required(), rules.minLength(1)])
          .members(schema.number([rules.unsigned()])),
      }),
    })

    user.name = ctx.request.input('name')
    user.email = ctx.request.input('email')
    const trx = await Database.transaction()

    try {
      await user.useTransaction(trx).save()
      await user.related('roles').sync(ctx.request.input('roles'), undefined, trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return ctx.response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('delete')
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('activate')
    const user = await User.findOrFail(params.id)
    user.deactivatedAt = DateTime.now()
    await user.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('deactivate')
    const user = await User.findOrFail(params.id)
    user.deactivatedAt = DateTime.now()
    await user.save()
    return response.noContent()
  }

  public async roles({
    bouncer,
    params,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Role>> {
    await bouncer.with('UserPolicy').authorize('viewRoles')
    const user = await User.findOrFail(params.id)

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    return await Role.query()
      .whereHas('users', (query) => query.where('id', user.id))
      .orderBy(orderBy, orderDirection)
      .paginate(page, perPage)
  }

  public async permissions({ bouncer, params }: HttpContextContract): Promise<Permission[]> {
    await bouncer.with('UserPolicy').authorize('viewRoles')
    const user = await User.findOrFail(params.id)

    return await Permission.query()
      .whereHas('roles', (rolesQuery) => {
        rolesQuery.whereHas('users', (usersQuery) => {
          usersQuery.where('id', user.id)
        })
      })
      .select('id', 'model', 'action')
      .orderBy('model', 'asc')
      .exec()
  }
}
