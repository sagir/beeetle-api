import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, scope } from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'
import ProductImage from './ProductImage'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public code: string

  @column()
  public description?: string

  @column.dateTime()
  public deactivatedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ProductImage)
  public images: HasMany<typeof ProductImage>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
