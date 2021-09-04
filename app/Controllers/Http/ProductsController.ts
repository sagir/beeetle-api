import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import ProductService from 'App/Services/ProductService'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import ProductCategoryListValidator from 'App/Validators/ProductCategoryListValidator'
import ProductSpecificationListValidator from 'App/Validators/ProductSpecificationListValidator'
import ProductValidator from 'App/Validators/ProductValidator'
import { DateTime } from 'luxon'

export default class ProductsController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Product>> {
    await ctx.bouncer.with('ProductPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'description', 'created_at', 'updated_at'])
    )
    return await ProductService.getPaginatedProducts(ctx)
  }

  public async inactive(ctx: HttpContextContract): Promise<ModelPaginatorContract<Product>> {
    await ctx.bouncer.with('ProductPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'description', 'created_at', 'updated_at'])
    )
    return await ProductService.getPaginatedProducts(ctx, false)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('ProductPolicy').authorize('create')
    await ctx.request.validate(ProductValidator)
    const product = await ProductService.saveProduct(ctx, new Product())
    return ctx.response.created(product)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Product> {
    await bouncer.with('ProductPolicy').authorize('view')
    return await Product.findByOrFail('slug', params.slug)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('ProductPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new ProductValidator(ctx, product.id))
    await ProductService.saveProduct(ctx, product)
    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('delete')
    const product = await Product.findByOrFail('slug', params.slug)
    await product.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('activate')
    const product = await Product.findByOrFail('slug', params.slug)

    let [categories] = await product.related('categories').query().count('id', 'total')

    if (!categories.$extras.total) {
      return response.badRequest({
        message: 'Product needs at-least 1 categry to be cativated',
      })
    }

    let [specifications] = await product
      .related('specifications')
      .query()
      .wherePivot('visible', 1)
      .count('id', 'total')

    if (!specifications.$extras.total) {
      return response.badRequest({
        message: 'Product needs at-least 1 visible specification to be cativated',
      })
    }

    product.deactivatedAt = undefined
    await product.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('activate')
    const product = await Product.findByOrFail('slug', params.slug)
    product.deactivatedAt = DateTime.now()
    await product.save()
    return response.noContent()
  }

  public async updateCategories({
    bouncer,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', params.slug)
    await request.validate(ProductCategoryListValidator)
    await product.related('categories').sync(request.input('categories'))
    return response.noContent()
  }

  public async updateSpecifications({
    bouncer,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await bouncer.with('SpecificationPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', params.slug)
    await request.validate(ProductSpecificationListValidator)

    const specifications = {}

    request.input('specifications').forEach((specification) => {
      specifications[specification.id] = {
        value: specification.value,
        visible: specification.visible,
      }
    })

    await product.related('specifications').sync(specifications)
    return response.noContent()
  }
}
