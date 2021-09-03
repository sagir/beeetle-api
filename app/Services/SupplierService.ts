import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Supplier from 'App/Models/Supplier'

export default class SupplierService {
  public static async getPaginatedSuppliers(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<Supplier>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')

    const query = Supplier.query()
      .withScopes((q) => (active ? q.active : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }

  public static async saveSupplier(
    { request }: HttpContextContract,
    supplier: Supplier
  ): Promise<Supplier> {
    supplier.name = request.input('name')
    supplier.email = request.input('email')
    supplier.password = request.input('phone')
    supplier.address = request.input('address')

    if (!supplier.id) {
      supplier.password = request.input('password')
    }

    return await supplier.save()
  }
}
