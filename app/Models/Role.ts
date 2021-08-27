import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import User from './User'
import { active, inactive } from 'App/utils/database/scopes'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description?: string

  @column.dateTime()
  public deactivatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Permission, { pivotTimestamps: true })
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => User, { pivotTimestamps: true })
  public permission: ManyToMany<typeof User>

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
