import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'

export default class CategoryService {
  public static async getPaginatedCategories(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<Category>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')

    const query = Category.query()
      .orderBy(sortBy, order)
      .whereNull('parent_id')
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .preload('children')

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }
}
