import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract, private categoryId: number = 0) {}

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
      rules.notIn(['inactive']),
      rules.minLength(3),
      rules.maxLength(100),
      rules.unique({
        table: 'categories',
        column: 'slug',
        whereNot: { id: this.categoryId },
      }),
    ]),
    description: schema.string.optional({ trim: true }, [
      rules.minLength(10),
      rules.maxLength(500),
    ]),
    parent_id: schema.number.optional([
      rules.unsigned(),
      rules.notIn([0]),
      rules.exists({
        table: 'categories',
        column: 'id',
        where: { parent_id: null },
      }),
    ]),
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
