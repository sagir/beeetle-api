import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Specification from 'App/Models/Specification'
import { DateTime } from 'luxon'

export default class SpecificationService {
  public static async getPaginatedSpecifications(
    { request }: HttpContextContract,
    active: boolean = true
  ): Promise<ModelPaginatorContract<Specification>> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const sortBy = request.input('sortBy', 'name')
    const order = request.input('order', 'asc')

    const query = Specification.query()
      .withScopes((q) => (active ? q.active() : q.inactive()))
      .orderBy(sortBy, order)

    if (search) {
      query.andWhere((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }

  public static async saveSpecification(
    { request }: HttpContextContract,
    specification: Specification
  ): Promise<Specification> {
    specification.name = request.input('name')
    specification.description = request.input('description')
    return await specification.save()
  }

  public static async updateState(
    specificationId: number,
    activate: boolean = true
  ): Promise<void> {
    const specification = await Specification.findOrFail(specificationId)
    specification.deactivatedAt = activate ? undefined : DateTime.now()
    await specification.save()
  }
}
