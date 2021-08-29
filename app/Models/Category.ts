import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public parent_id?: number | null

  @column.dateTime()
  public deactivateAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category, { localKey: 'parent_id' })
  public parent: BelongsTo<typeof Category>

  @hasMany(() => Category, { foreignKey: 'parent_id' })
  public children: HasMany<typeof Category>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
