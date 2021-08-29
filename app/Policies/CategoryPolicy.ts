import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { hasPermission } from 'App/utils/database/permissionHelpers'

export default class CategoryPolicy extends BasePolicy {
  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'read')
  }

  public async create(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'create')
  }

  public async update(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'update')
  }

  public async delete(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'delete')
  }

  public async activate(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'activate')
  }

  public async deactivate(user: User): Promise<boolean> {
    return await hasPermission(user, 'category', 'deactivate')
  }
}
