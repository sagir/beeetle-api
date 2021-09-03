import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Supplier from 'App/Models/Supplier'
import { DateTime } from 'luxon'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import SupplierService from 'App/Services/SupplierService'
import SupplierCreateValidator from 'App/Validators/SupplierCreateValidator'
import SupplierUpdateValidator from 'App/Validators/SupplierUpdateValidator'

export default class SuppliersController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Supplier>> {
    await ctx.bouncer.with('SupplierPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'email', 'created_at', 'updated_at'])
    )

    return await SupplierService.getPaginatedSuppliers(ctx)
  }

  public async inactive(ctx: HttpContextContract): Promise<ModelPaginatorContract<Supplier>> {
    await ctx.bouncer.with('SupplierPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, [
        'name',
        'email',
        'created_at',
        'updated_at',
        'deactivated_at',
      ])
    )

    return await SupplierService.getPaginatedSuppliers(ctx, false)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('SupplierPolicy').authorize('create')
    await ctx.request.validate(SupplierCreateValidator)
    const supplier = await SupplierService.saveSupplier(ctx, new Supplier())
    return ctx.response.created(supplier)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Supplier> {
    await bouncer.with('SupplierPolicy').authorize('view')
    return await Supplier.findOrFail(params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('SupplierPolicy').authorize('update')
    const supplier = await Supplier.findOrFail(ctx.params.id)
    await ctx.request.validate(new SupplierUpdateValidator(ctx, supplier.id))
    await SupplierService.saveSupplier(ctx, supplier)
    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SupplierPolicy').authorize('delete')
    const supplier = await Supplier.findOrFail(params.id)
    await supplier.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SupplierPolicy').authorize('activate')
    const supplier = await Supplier.findOrFail(params.id)
    supplier.deactivatedAt = undefined
    await supplier.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SupplierPolicy').authorize('activate')
    const supplier = await Supplier.findOrFail(params.id)
    supplier.deactivatedAt = DateTime.now()
    await supplier.save()
    return response.noContent()
  }
}
