import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import { ParentItem } from 'App/Responses/ListResponses'
import CategoryService from 'App/Services/CategoryService'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'

export default class CategoriesController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Category>> {
    await ctx.bouncer.with('CategoryPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'created_at', 'updated_at'])
    )

    return await CategoryService.getPaginatedCategories(ctx)
  }

  public async inactive(ctx: HttpContextContract): Promise<ModelPaginatorContract<Category>> {
    await ctx.bouncer.with('CategoryPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'created_at', 'updated_at', 'deactivated_at'])
    )

    return await CategoryService.getPaginatedCategories(ctx, false)
  }

  public async list({ bouncer }: HttpContextContract): Promise<ParentItem[]> {
    await bouncer.with('CategoryPolicy').authorize('viewList')
    return await Category.query()
      .whereNull('parent_id')
      .withScopes((q) => q.active())
      .preload('children', (childQuery) => {
        childQuery.select('id', 'name')
      })
      .select('id', 'name')
      .exec()
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('CategoryPolicy').authorize('create')
    const category = await CategoryService.saveCategory(ctx, new Category())
    return ctx.response.created(category)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Category> {
    await bouncer.with('CategoryPolicy').authorize('view')
    const category = await Category.findByOrFail('slug', params.slug)
    await category.load(category.parent_id ? 'parent' : 'children')
    return category
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('CategoryPolicy').authorize('update')
    await CategoryService.saveCategory(ctx, await Category.findByOrFail('slug', ctx.params.slug))
    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('delete')
    const category = await Category.findByOrFail('slug', params.slug)
    await category.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('activate')
    await CategoryService.updateState(params.slug, true)
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('activate')
    await CategoryService.updateState(params.slug, false)
    return response.noContent()
  }
}
