import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import Specification from 'App/Models/Specification'
import CommonFilterQueryValidator from 'App/Validators/CommonFilterQueryValidator'
import SpecifactionValidator from 'App/Validators/SpecifactionValidator'
import { DateTime } from 'luxon'
import SpecificationService from '../../Services/SpecificationService'

export default class SpecificationsController {
  public async index(ctx: HttpContextContract): Promise<ModelPaginatorContract<Specification>> {
    await ctx.bouncer.with('SpecificationPolicy').authorize('view')
    await ctx.request.validate(
      new CommonFilterQueryValidator(ctx, ['name', 'created_at', 'updated_at'])
    )

    return await SpecificationService.getPaginatedSpecifications(ctx)
  }

  public async store({ bouncer, request, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SpecificationPolicy').authorize('create')
    await request.validate(SpecifactionValidator)
    const specification = new Specification()

    specification.name = request.input('name')
    specification.description = request.input('description')

    await specification.save()
    return response.created(specification)
  }

  public async show({ bouncer, params }: HttpContextContract): Promise<Specification> {
    await bouncer.with('SpecificationPolicy').authorize('view')
    return await Specification.findOrFail(params.id)
  }

  public async update(ctx: HttpContextContract): Promise<void> {
    await ctx.bouncer.with('SpecificationPolicy').authorize('update')
    const specification = await Specification.findOrFail(ctx.params.id)
    await ctx.request.validate(new SpecifactionValidator(ctx, specification.id))

    specification.name = ctx.request.input('name')
    specification.description = ctx.request.input('description')

    await specification.save()
    return ctx.response.noContent()
  }

  public async destroy({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SpecificationPolicy').authorize('delete')
    const specification = await Specification.findOrFail(params.id)
    await specification.delete()
    return response.noContent()
  }

  public async activate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SpecificationPolicy').authorize('activate')
    const specification = await Specification.findOrFail(params.id)
    specification.deactivatedAt = undefined
    await specification.save()
    return response.noContent()
  }

  public async deactivate({ bouncer, params, response }: HttpContextContract): Promise<void> {
    await bouncer.with('SpecificationPolicy').authorize('activate')
    const specification = await Specification.findOrFail(params.id)
    specification.deactivatedAt = DateTime.now()
    await specification.save()
    return response.noContent()
  }
}
