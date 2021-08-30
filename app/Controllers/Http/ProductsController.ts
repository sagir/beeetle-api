import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import ProductValidator from 'App/Validators/ProductValidator'
import { DateTime } from 'luxon'

export default class ProductsController {
  public async index({
    bouncer,
    request,
  }: HttpContextContract): Promise<ModelPaginatorContract<Product>> {
    await bouncer.with('ProductPolicy').authorize('view')

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('query')
    const active = request.input('activeItems')
    const orderBy = request.input('orderBy', 'name')
    const orderDirection = request.input('orderDirection', 'asc')

    const query = Product.query().orderBy(orderBy, orderDirection)

    if (active !== undefined) {
      query.withScopes((q) => (active ? q.active() : q.inactive()))
    }

    if (search) {
      query.where((q) => {
        q.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`)
      })
    }

    return await query.paginate(page, perPage)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('create')
    await request.validate(ProductValidator)
    const product = new Product()
    const trx = await Database.transaction()

    product.name = request.input('name')
    product.slug = request.input('slug')
    product.code = request.input('code')
    product.description = request.input('description')

    try {
      await product.useTransaction(trx).save()
      await product.related('categories').attach(request.input('categories'), trx)

      await product
        .related('specifications')
        .attach(this.getSpecificationData(request.input('specifications')), trx)

      await trx.commit()
    } catch (error) {
      trx.rollback()
      return response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

    return response.created(product)
  }

  private getSpecificationData(specifications: any[]): any[] {
    return specifications.map((specification) => {
      let obj = {}

      obj[specification.id] = {
        value: specification.value,
        visible: specification.visible,
      }

      return obj
    })
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Product> {
    await bouncer.with('ProductPolicy').authorize('view')
    return await Product.findByOrFail('slug', params.slug)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('ProductPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new ProductValidator(ctx, product.id))
    const trx = await Database.transaction()

    product.name = ctx.request.input('name')
    product.slug = ctx.request.input('slug')
    product.code = ctx.request.input('code')
    product.description = ctx.request.input('description')

    try {
      await product.useTransaction(trx).save()
      await product.related('categories').sync(ctx.request.input('permissions'), undefined, trx)

      await product
        .related('specifications')
        .sync(this.getSpecificationData(ctx.request.input('specifications')), undefined, trx)

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return ctx.response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

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
    product.deactivatedAt = undefined
    await product.save()
    return response.noContent()
  }

  public async deactive({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('activate')
    const product = await Product.findByOrFail('slug', params.slug)
    product.deactivatedAt = DateTime.now()
    await product.save()
    return response.noContent()
  }
}
