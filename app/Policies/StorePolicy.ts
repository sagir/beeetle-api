import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Store from 'App/Models/Store'
import { hasPermission } from 'App/utils/database/permissionHelpers'

export default class StorePolicy extends BasePolicy {
  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, 'store', 'read')
  }

  public async create(user: User): Promise<boolean> {
    return await hasPermission(user, 'store', 'create')
  }

  public async update(user: User): Promise<boolean> {
    return await hasPermission(user, 'store', 'update')
  }

  public async delete(user: User, store: Store): Promise<boolean> {
    if (store.default) return false
    return await hasPermission(user, 'store', 'delete')
  }

  public async activate(user: User): Promise<boolean> {
    return await hasPermission(user, 'store', 'activate')
  }

  public async deactivate(user: User, store: Store): Promise<boolean> {
    if (store.default) return false
    return await hasPermission(user, 'store', 'deactivate')
  }

  public async makeDefault(user: User): Promise<boolean> {
    return await hasPermission(user, 'store', 'makeDefault')
  }
}
