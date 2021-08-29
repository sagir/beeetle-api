import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { hasPermission, hasPermissions } from 'App/utils/database/permissionHelpers'

export default class UserPolicy extends BasePolicy {
  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, 'user', 'read')
  }

  public async create(user: User) {
    return await hasPermission(user, 'user', 'create')
  }

  public async update(user: User) {
    return await hasPermission(user, 'user', 'update')
  }

  public async delete(user: User) {
    return await hasPermission(user, 'user', 'delete')
  }

  public async activate(user: User) {
    return await hasPermission(user, 'user', 'activate')
  }

  public async deactivate(user: User) {
    return await hasPermission(user, 'user', 'deactivate')
  }

  public async viewRoles(user: User) {
    return await hasPermissions(user, [
      { model: 'user', action: 'read' },
      { model: 'role', action: 'read' },
    ])
  }
}
