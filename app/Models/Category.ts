import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'
import Product from './Product'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column({ serializeAs: null })
  public parent_id?: number | null

  @column.dateTime()
  public deactivateAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category, {
    localKey: 'parent_id',
    onQuery(query) {
      query.withScopes((q) => q.active())
    },
  })
  public parent: BelongsTo<typeof Category>

  @hasMany(() => Category, {
    foreignKey: 'parent_id',
    onQuery(query) {
      query.withScopes((q) => q.active())
    },
  })
  public children: HasMany<typeof Category>

  @manyToMany(() => Product, {
    onQuery(query) {
      query.withScopes((q) => q.active())
    },
  })
  public products: ManyToMany<typeof Product>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
