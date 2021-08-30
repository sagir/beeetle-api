import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductValidator {
  constructor(protected ctx: HttpContextContract, private productId: number = 0) {}

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
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    slug: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(100),
      rules.unique({
        table: 'products',
        column: 'slug',
        whereNot: { id: this.productId },
      }),
    ]),
    code: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(10),
      rules.unique({
        table: 'products',
        column: 'code',
        whereNot: { id: this.productId },
      }),
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(10),
      rules.maxLength(1000),
    ]),
    categories: schema
      .array([
        rules.minLength(1),
        rules.allExists({
          table: 'categories',
          column: 'id',
          where(query) {
            query.whereNotNull('parent_id')
          },
        }),
      ])
      .members(schema.number([rules.unsigned()])),
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
