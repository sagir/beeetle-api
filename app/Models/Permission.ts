import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public model: string

  @column()
  public action: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'permission_dependency',
    localKey: 'id',
    pivotForeignKey: 'permission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'depends_on',
  })
  public dependsOn: ManyToMany<typeof Permission>
}
