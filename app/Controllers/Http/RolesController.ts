import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import RoleValidator from 'App/Validators/RoleValidator'
import { DateTime } from 'luxon'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import RoleService from 'App/Services/RoleService'

export default class RolesController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Role>> {
    await ctx.bouncer.with('RolePolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, [
        'name',
        'slug',
        'description',
        'created_at',
        'updated_at',
      ])
    )

    return await RoleService.getPaginatedRoles(ctx)
  }

  public async inactive(ctx: HttpContextContract): Promise<ModelPaginatorContract<Role>> {
    await ctx.bouncer.with('RolePolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, [
        'name',
        'slug',
        'description',
        'created_at',
        'updated_at',
        'deactivated_at',
      ])
    )

    return await RoleService.getPaginatedRoles(ctx, false)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('RolePolicy').authorize('create')
    await ctx.request.validate(RoleValidator)
    const role = await RoleService.saveRole(ctx, new Role())

    return role
      ? ctx.response.created(role)
      : ctx.response.internalServerError({
          message: 'Something went wrong. Please try again later.',
        })
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Role> {
    await bouncer.with('RolePolicy').authorize('view')
    return await Role.findByOrFail('slug', params.slug)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('RolePolicy').authorize('update')
    const role = await Role.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new RoleValidator(ctx, role.id))
    const res = await RoleService.saveRole(ctx, role)

    return res
      ? ctx.response.noContent()
      : ctx.response.internalServerError({
          message: 'Something went wrong. Please try again later.',
        })
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('RolePolicy').authorize('delete')
    const role = await Role.findByOrFail('slug', params.slug)

    if (role.id === 1) {
      return response.badRequest({ message: 'Operation not permitted' })
    }

    await role.delete()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('RolePolicy').authorize('activate')
    const res = await RoleService.updateState(params.slug, false)
    return res ? response.noContent() : response.badRequest({ message: 'Operation not permitted' })
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('RolePolicy').authorize('activate')
    await RoleService.updateState(params.slug, true)
    return response.noContent()
  }

  public async permissions({ bouncer, params }: HttpContextContract): Promise<Permission[]> {
    await bouncer.with('RolePolicy').authorize('view')
    const role = await Role.findByOrFail('slug', params.slug)
    await role.load('permissions')
    return role.permissions
  }

  public async users({
    bouncer,
    params,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<User>> {
    await bouncer.with('RolePolicy').authorize('viewUsers')
    const role = await Role.findByOrFail('slug', params.slug)

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    return await User.query()
      .whereHas('roles', (query) => query.where('id', role.id))
      .orderBy(orderBy, orderDirection)
      .paginate(page, perPage)
  }
}
