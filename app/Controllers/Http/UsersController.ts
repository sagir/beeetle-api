import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
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

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('UserPolicy').authorize('create')
    await ctx.request.validate(UserCreateValidator)
    const user = await UserService.saveUser(ctx, new User())

    return user
      ? ctx.response.created(user)
      : ctx.response.internalServerError({
          message: 'Something went wrong. Please try again later',
        })
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<User> {
    await bouncer.with('UserPolicy').authorize('view')
    return await User.findOrFail(params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('UserPolicy').authorize('update')
    const user = await User.findOrFail(ctx.params.id)
    await ctx.request.validate(new UserUpdateValidator(ctx, user.id))
    const res = await UserService.saveUser(ctx, user)

    return res
      ? ctx.response.noContent()
      : ctx.response.internalServerError({
          message: 'Something went wrong. Please try again later.',
        })
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('delete')
    const user = await User.findOrFail(params.id)

    if (user.id === 1) {
      return response.badRequest({ message: 'Operation not permitted.' })
    }

    await user.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('activate')
    await UserService.updateState(params.id, true)
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('UserPolicy').authorize('deactivate')
    const res = await UserService.updateState(params.id, false)
    return res ? response.noContent() : response.badRequest({ message: 'Operation not permitted.' })
  }

  public async roles({ bouncer, params }: HttpContextContract): Promise<Role[]> {
    await bouncer.with('UserPolicy').authorize('viewRoles')
    const user = await User.findOrFail(params.id)
    return await user.related('roles').query().orderBy('name', 'asc').exec()
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
      .select('model', 'action')
      .orderBy('model', 'asc')
      .orderBy('action', 'asc')
      .exec()
  }
}
