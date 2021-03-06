import { action, BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { hasPermission } from 'App/utils/database/permissionHelpers'

export default class CategoryPolicy extends BasePolicy {
  private readonly model: string = 'category'

  public async view(user: User): Promise<boolean> {
    return await hasPermission(user, this.model, 'read')
  }

  @action({ allowGuest: true })
  public async viewList(user: User | null): Promise<boolean> {
    if (!user) return true
    return await hasPermission(user, this.model, 'read')
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
