import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class ProductService {
  public static async getPaginatedProducts(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<Product>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy')
    const order = request.input('order')

    const query = Product.query()
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }

  public static async saveProduct(
    { request }: HttpContextContract,
    product: Product
  ): Promise<Product> {
    product.name = request.input('name')
    product.slug = request.input('slug')
    product.code = request.input('code')
    product.description = request.input('description')

    if (!product.id) {
      product.deactivatedAt = DateTime.now()
    }

    return await product.save()
  }
}
