import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'
import ProductImage from './ProductImage'
import Specification from './Specification'
import Category from './Category'
import Supplier from './Supplier'
import Store from './Store'

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

  @manyToMany(() => Specification, {
    pivotColumns: ['value', 'visible'],
    onQuery(query) {
      query.withScopes((q) => q.active())
    },
  })
  public specifications: ManyToMany<typeof Specification>

  @manyToMany(() => Category, {
    onQuery(query) {
      query
        .withScopes((q) => q.active())
        .andWhereNotNull('parent_id')
        .whereHas('parent', (whq) => whq.withScopes((sq) => sq.active()))
    },
  })
  public categories: ManyToMany<typeof Category>

  @manyToMany(() => Supplier, {
    pivotTable: 'stocks',
    pivotColumns: ['quantity', 'store_id'],
    pivotForeignKey: 'product_id',
    pivotRelatedForeignKey: 'supplier_id',
    localKey: 'id',
    relatedKey: 'id',
  })
  public suppliers: ManyToMany<typeof Supplier>

  @manyToMany(() => Store, {
    pivotTable: 'stocks',
    pivotColumns: ['quantity', 'supplier_id'],
    pivotForeignKey: 'product_id',
    pivotRelatedForeignKey: 'store_id',
    localKey: 'id',
    relatedKey: 'id',
  })
  public stores: ManyToMany<typeof Store>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
