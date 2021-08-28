import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import { hasPermission } from 'App/utils/database/permissionHelpers'

export default class RolePolicy extends BasePolicy {
	public async view(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'read')
  }

	public async create(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'create')
  }

	public async update(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'update')
  }

	public async delete(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'delete')
  }

  public async activate(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'activate')
  }

  public async deactivate(user: User): Promise<boolean> {
    return await hasPermission(user, 'role', 'activate')
  }
}
