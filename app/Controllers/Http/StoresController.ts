import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Store from 'App/Models/Store'
import StoreValidator from 'App/Validators/StoreValidator'

export default class StoresController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Store>> {
    await bouncer.with('StorePolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'name')

    const query = Store.query()

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive()))
    }

    return await query.orderBy(orderBy, orderDirection).paginate(page, perPage)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('StorePolicy').authorize('create')
    await request.validate(StoreValidator)
    const store = new Store()

    store.name = request.input('name')
    store.slug = request.input('slug')
    store.address = request.input('address')

    await store.save()
    return response.created(store)
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async activate({}: HttpContextContract) {}

  public async deactivate({}: HttpContextContract) {}
}
