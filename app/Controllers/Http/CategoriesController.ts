import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import { ParentItem } from 'App/Responses/ListResponses'
import CategoryService from 'App/Services/CategoryService'
import CategoryValidator from 'App/Validators/CategoryValidator'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import { DateTime } from 'luxon'

export default class CategoriesController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Category>> {
    await ctx.bouncer.with('CategoryPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'created_at', 'updated_at'])
    )

    return await CategoryService.getPaginatedCategories(ctx)
  }

  public async list({ bouncer }: HttpContextContract): Promise<ParentItem[]> {
    await bouncer.with('CategoryPolicy').authorize('viewList')
    return await Category.query()
      .whereNull('parent_id')
      .withScopes((q) => q.active())
      .preload('children', (childQuery) => {
        childQuery.withScopes((q) => q.active()).select('id', 'name')
      })
      .select('id', 'name')
      .exec()
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

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('delete')
    const category = await Category.findByOrFail('slug', params.slug)
    await category.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('activate')
    const category = await Category.findByOrFail('slug', params.slug)
    category.deactivateAt = undefined
    await category.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('CategoryPolicy').authorize('activate')
    const category = await Category.findByOrFail('slug', params.slug)
    category.deactivateAt = DateTime.now()
    await category.save()
    return response.noContent()
  }
}
