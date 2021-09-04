import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'
import Product from 'App/Models/Product'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public address: string

  @column()
  public default: boolean = false

  @column.dateTime()
  public deactivatedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotTable: 'stocks',
    pivotColumns: ['quantity', 'supplier_id'],
    pivotForeignKey: 'store_id',
    pivotRelatedForeignKey: 'product_id',
    localKey: 'id',
    relatedKey: 'id',
  })
  public products: ManyToMany<typeof Product>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
