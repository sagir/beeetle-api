import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Store from 'App/Models/Store'
import StoreValidator from 'App/Validators/StoreValidator'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

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

  public async show({ bouncer, params }: HttpContextContract): Promise<Store> {
    await bouncer.with('StorePolicy').authorize('view')
    return await Store.findByOrFail('slug', params.slug)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('StorePolicy').authorize('update')
    const store = await Store.findByOrFail('slug', ctx.params.slug)
    await ctx.request.validate(new StoreValidator(ctx, store.id))

    store.name = ctx.request.input('name')
    store.slug = ctx.request.input('slug')
    store.address = ctx.request.input('address')

    await store.save()
    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('StorePolicy').authorize('delete')
    const store = await Store.findByOrFail('slug', params.slug)

    if (store.default) {
      return response.badRequest({
        message: "Can't delete default store.",
      })
    }

    await store.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('StorePolicy').authorize('activate')
    const store = await Store.findByOrFail('slug', params.slug)
    store.deactivatedAt = undefined
    await store.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('StorePolicy').authorize('deactivate')
    const store = await Store.findByOrFail('slug', params.slug)

    if (store.default) {
      return response.badRequest({
        message: "Can't deactivate default store.",
      })
    }

    store.deactivatedAt = DateTime.now()
    await store.save()
    return response.noContent()
  }

  public async makeDefault({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('StorePolicy').authorize('makeDefault')
    const store = await Store.findByOrFail('slug', params.slug)
    store.default = true
    const trx = await Database.transaction()

    try {
      await store.useTransaction(trx).save()

      await Store.query()
        .where((query) => {
          query.whereNot('id', store.id).andWhere('default', true)
        })
        .useTransaction(trx)
        .update({ default: false })

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Something went wrong. Please try again.',
      })
    }

    return response.noContent()
  }
}
