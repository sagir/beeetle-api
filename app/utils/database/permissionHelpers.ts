import Permission from "App/Models/Permission";
import User from "App/Models/User";

export const hasPermission = async (
  user: User,
  model: string,
  action: string
): Promise<boolean> => {
  const permission = await Permission.query().where([
    ['model', model],
    ['action', action]
  ]).whereHas('roles', rolesQuery => {
    rolesQuery.whereHas('users', usersQuery => {
      usersQuery.where('id', user.id)
    })
  }).first()

  return !!permission
}

export const hasPermissions = async (
  user: User,
  permissions: { model: string; action: string }[]
): Promise<boolean> => {
  if (!permissions.length) {
    return true
  }

  const permissionModels = await Permission.query().where(query => {
    query
      .whereIn('model', permissions.map(({ model }) => model))
      .andWhereIn('action', permissions.map(({ action }) => action))
  }).whereHas('roles', rolesQuery => {
    rolesQuery.whereHas('users', usersQuery => {
      usersQuery.where('id', user.id)
    })
  }).exec()

  return permissionModels.length === permissions.length
}
