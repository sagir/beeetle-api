import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Specification from 'App/Models/Specification'

export default class SpecificationsController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Specification>> {
    await bouncer.with('SpecificationPolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = Specification.query().orderBy(orderBy, orderDirection)

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive))
    }

    return await query.paginate(page, perPage)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async activate({}: HttpContextContract) {}

  public async deactivate({}: HttpContextContract) {}
}
