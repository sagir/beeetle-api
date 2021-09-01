import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
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

    product.name = request.input('name')
    product.slug = request.input('slug')
    product.code = request.input('code')
    product.description = request.input('description')
    product.deactivatedAt = DateTime.now()

    await product.save()
    return response.created(product)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Product> {
    await bouncer.with('ProductPolicy').authorize('view')
    return await Product.findByOrFail('slug', params.slug)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('ProductPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new ProductValidator(ctx, product.id))

    product.name = ctx.request.input('name')
    product.slug = ctx.request.input('slug')
    product.code = ctx.request.input('code')
    product.description = ctx.request.input('description')

    await product.save()
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

    // const [res] = await Database.from('category_product')
    //   .debug(true)
    //   .join('product_specification', (joinQuery) => {
    //     joinQuery.on('category_product.product_id', 'product_specification.product_id')
    //   })
    //   .whereExists(
    //     Database.from('categories')
    //       .where('categories.id', 'category_product.id')
    //       .andWhere((query) => {
    //         query.whereNull('deactivated_at').orWhere('deactivated_at', '>', DateTime.now().toSQL())
    //       })
    //       .limit(1)
    //   )
    //   .count('*', 'total')

    // console.log(res)

    const [categories] = await product
      .related('categories')
      .query()
      .whereNull('parent_id')
      .withScopes((q) => q.active())
      .count('id', 'total')

    // @ts-ignore
    if (!categories.total) {
      return response.badRequest({
        message: 'Product required at-least 1 category.',
      })
    }

    const [specifications] = await product
      .related('specifications')
      .query()
      .withScopes((q) => q.active())
      .wherePivot('visible', true)
      .count('id', 'total')

    // @ts-ignore
    if (!specifications.total) {
      return response.badRequest({
        message: 'Product required at-least 1 category and 1 specification.',
      })
    }

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

  public async updateCategories({
    bouncer,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await bouncer.with('ProductPolicy').authorize('update')
    const product = await Product.findByOrFail('slug', params.slug)

    await request.validate({
      schema: schema.create({
        categories: schema.array([rules.required(), rules.minLength(1)]).members(
          schema.number([
            rules.unsigned(),
            rules.allExists({
              table: 'categories',
              column: 'id',
              where: (query: DatabaseQueryBuilderContract) => {
                query
                  .whereNull('deactivate_at')
                  .orWhere('deactivated_at', '>', DateTime.now().toSQL())
              },
            }),
          ])
        ),
      }),
    })

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

    await request.validate({
      schema: schema.create({
        specifications: schema
          .array([
            rules.required(),
            rules.minLength(1),
            rules.allExists({
              table: 'specifications',
              column: 'id',
              field: 'id',
              where: (query: DatabaseQueryBuilderContract) => {
                query
                  .whereNull('deactivated_at')
                  .orWhere('deactivated_at', '>', DateTime.now().toSQL())
              },
            }),
          ])
          .members(
            schema.object().members({
              id: schema.number([rules.required(), rules.unsigned()]),
              value: schema.string({ trim: true }, [rules.required(), rules.maxLength(1)]),
              visible: schema.boolean([rules.required()]),
            })
          ),
      }),
    })

    const specifications = request.input('specifications').map((specification) => {
      let obj = {}

      obj[specification.id] = {
        value: specification.value,
        visible: specification.visible,
      }

      return obj
    })

    await product.related('specifications').sync(specifications)
    return response.noContent()
  }
}
