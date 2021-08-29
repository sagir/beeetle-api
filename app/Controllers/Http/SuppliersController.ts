import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Supplier from 'App/Models/Supplier'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SuppliersController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Supplier>> {
    await bouncer.with('SupplierPolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = Supplier.query().orderBy(orderBy, orderDirection)

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive()))
    }

    return await query.paginate(page, perPage)
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

  public async destroy({}: HttpContextContract) {}

  public async activate({}: HttpContextContract) {}

  public async deactivate({}: HttpContextContract) {}
}
