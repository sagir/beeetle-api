import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class ProductSpecificationListValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    specifications: schema
      .array([
        rules.required(),
        rules.minLength(1),
        rules.allExists({
          table: 'specifications',
          column: 'id',
          field: 'id',
          where: (query) => {
            query.whereNull('deactivated_at').orWhere('deactivated_at', '>', DateTime.now().toSQL())
          },
        }),
      ])
      .members(
        schema.object().members({
          id: schema.number([rules.required(), rules.unsigned()]),
          value: schema.string({ trim: true }, [rules.required(), rules.minLength(1)]),
          visible: schema.boolean([rules.required()]),
        })
      ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
