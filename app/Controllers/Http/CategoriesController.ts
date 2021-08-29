import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/CategoryValidator'

export default class CategoriesController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Category>> {
    await bouncer.with('CategoryPolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = Category.query().whereNull('parent_id').preload('children')

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive()))
    }

    return await query.orderBy(orderBy, orderDirection).paginate(page, perPage)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('create')
    await request.validate(CategoryValidator)
    const category = new Category()

    category.name = request.input('name')
    category.slug = request.input('slug')
    category.description = request.input('description')
    category.parent_id = request.input('parent_id')

    await category.save()
    return response.created(category)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Category> {
    await bouncer.with('CategoryPolicy').authorize('view')
    const category = await Category.findByOrFail('slug', params.slug)

    if (category.parent_id) {
      await category.load('parent')
    } else {
      await category.load('children')
    }

    return category
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('CategoryPolicy').authorize('update')
    const category = await Category.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new CategoryValidator(ctx, category.id))

    category.name = ctx.request.input('name')
    category.slug = ctx.request.input('slug')
    category.description = ctx.request.input('description')
    category.parent_id = ctx.request.input('parent_id')

    await category.save()
    return ctx.response.noContent()
  }

  public async destroy({}: HttpContextContract) {}

  public async activate({}: HttpContextContract) {}

  public async deactivate({}: HttpContextContract) {}
}
