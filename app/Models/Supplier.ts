import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, scope } from '@ioc:Adonis/Lucid/Orm'
import { active, inactive } from 'App/utils/database/scopes'
import Hash from '@ioc:Adonis/Core/Hash'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone: string

  @column()
  public address?: string

  @column.dateTime()
  public deactivatedAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: Supplier) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
