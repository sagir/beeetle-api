import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export const hasPermission = async (
  user: User,
  model: string,
  action: string
): Promise<boolean> => {
  const permission = await Permission.query()
    .where((query) => {
      query
        .where('model', model)
        .andWhere('action', action)
        .andWhereHas('roles', (rolesQuery) => {
          rolesQuery.whereHas('users', (usersQuery) => {
            usersQuery.where('id', user.id)
          })
        })
    })
    .first()

  return !!permission
}

export const hasPermissions = async (
  user: User,
  permissions: { model: string; action: string }[]
): Promise<boolean> => {
  if (!permissions.length) {
    return true
  }

  const permissionModels = await Permission.query()
    .whereHas('roles', (q) => {
      q.whereHas('users', (q) => {
        q.where('id', user.id)
      })
    })
    .where((q) => {
      permissions.forEach(({ model, action }) => {
        q.orWhere((q) => {
          q.where('model', model).andWhere('action', action)
        })
      })
    })

  return permissionModels.length === permissions.length
}
