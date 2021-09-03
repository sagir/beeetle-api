import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Supplier from 'App/Models/Supplier'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import SupplierService from 'App/Services/SupplierService'

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

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SupplierPolicy').authorize('create')

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
            table: 'suppliers',
            column: 'email',
          }),
        ]),
        phone: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(7),
          rules.maxLength(15),
          rules.unique({
            table: 'suppliers',
            column: 'phone',
          }),
        ]),
        password: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(6),
          rules.maxLength(16),
        ]),
        address: schema.string.optional({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
      }),
    })

    const supplier = new Supplier()

    supplier.name = request.input('name')
    supplier.email = request.input('email')
    supplier.phone = request.input('phone')
    supplier.password = request.input('password')
    supplier.address = request.input('address')

    await supplier.save()
    return response.created(supplier)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Supplier> {
    await bouncer.with('SupplierPolicy').authorize('view')
    return await Supplier.findOrFail(params.id)
  }

  public async update({ bouncer, params, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SupplierPolicy').authorize('update')
    const supplier = await Supplier.findOrFail(params.id)

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
            table: 'suppliers',
            column: 'email',
          }),
        ]),
        phone: schema.string({ trim: true }, [
          rules.required(),
          rules.minLength(7),
          rules.maxLength(15),
          rules.unique({
            table: 'suppliers',
            column: 'phone',
          }),
        ]),
        address: schema.string.optional({ trim: true }, [rules.minLength(3), rules.maxLength(255)]),
      }),
    })

    supplier.name = request.input('name')
    supplier.email = request.input('email')
    supplier.phone = request.input('phone')
    supplier.address = request.input('address')

    await supplier.save()
    return response.noContent()
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
