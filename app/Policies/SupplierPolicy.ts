import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { hasPermission } from 'App/utils/database/permissionHelpers'

export default class SupplierPolicy extends BasePolicy {
  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'read')
  }

  public async create(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'create')
  }

  public async update(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'update')
  }

  public async delete(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'delete')
  }

  public async activate(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'activate')
  }

  public async deactivate(user: User): Promise<boolean> {
    return await hasPermission(user, 'supplier', 'deactivate')
  }
}
