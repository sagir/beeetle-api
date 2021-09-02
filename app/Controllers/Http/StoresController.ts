import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Store from 'App/Models/Store'
import StoreValidator from 'App/Validators/StoreValidator'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import StoreService from 'App/Services/StoreService'

export default class StoresController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Store>> {
    await ctx.bouncer.with('StorePolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'slug', 'created_at', 'updated_at', 'address'])
    )

    return StoreService.getPaginatedStores(ctx)
  }

  public async store(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('StorePolicy').authorize('create')
    await ctx.request.validate(StoreValidator)
    const store = await StoreService.saveStore(ctx, new Store())
    return ctx.response.created(store)
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
