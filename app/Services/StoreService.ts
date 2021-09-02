import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Store from 'App/Models/Store'
import StoreValidator from 'App/Validators/StoreValidator'

export default class StoreService {
  public static async getPaginatedStores(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<Store>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')

    const query = Store.query()
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('address', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }

  public static async saveStore(ctx: HttpContextContract, store: Store): Promise<Store> {
    await ctx.request.validate(new StoreValidator(ctx, store.id || 0))
    store.name = ctx.request.input('name')
    store.slug = ctx.request.input('slug')
    store.address = ctx.request.input('address')
    return await store.save()
  }
}
