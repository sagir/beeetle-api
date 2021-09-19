import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { hasPermission, hasPermissions } from 'App/utils/database/permissionHelpers'

export default class ProductPolicy extends BasePolicy {
  private model: string = 'product'

  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'read')
  }

  public async viewCategories(user: User): Promise<boolean> {
    return await hasPermissions(user, [
      { model: this.model, action: 'read' },
      { model: 'categories', action: 'read' },
    ])
  }

  public async viewSpecifications(user: User): Promise<boolean> {
    return await hasPermissions(user, [
      { model: this.model, action: 'read' },
      { model: 'specification', action: 'read' },
    ])
  }

  public async create(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'create')
  }

  public async update(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'update')
  }

  public async delete(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'delete')
  }

  public async activate(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'activate')
  }

  public async deactivate(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'deactivate')
  }
}
