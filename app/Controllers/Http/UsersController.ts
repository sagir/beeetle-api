import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'
import UserCreateValidator from 'App/Validators/UserCreateValidator'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'
import UserFilterQueryValidator from 'App/Validators/UserFilterQueryValidator'
import UserService from 'App/Services/UserService'

export default class UsersController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<User>> {
    await ctx.bouncer.with('UserPolicy').authorize('view')
    await ctx.request.validate(
      new UserFilterQueryValidator(ctx, ['name', 'email', 'created_at', 'updated_at'])
    )

    return await UserService.getPaginatedUsers(ctx)
  }

  public async inactive(ctx: HttpContextContract): Promise<ModelPaginatorContract<User>> {
    await ctx.bouncer.with('UserPolicy').authorize('view')
    await ctx.request.validate(
      new UserFilterQueryValidator(ctx, ['name', 'email', 'created_at', 'updated_at'])
    )

    return await UserService.getPaginatedUsers(ctx, false)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('create')
    await request.validate(UserCreateValidator)

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
    await ctx.request.validate(new UserUpdateValidator(ctx, user.id))

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
