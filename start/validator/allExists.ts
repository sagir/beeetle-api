import { validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import { AllExistsDbOptions } from './AllExistsDbOptionsInterface'

validator.rule(
  'allExists',
  async (
    value,
    options: AllExistsDbOptions,
    { pointer, arrayExpressionPointer, errorReporter }
  ) => {
    if (!value || !Array.isArray(value)) {
      return
    }

    let values = value
    if (options.field) {
      values.map((item) => item[options.field as string])
    }

    const query = Database.from(options.table).whereIn(options.column || 'id', values)

    if (options.where) {
      query.andWhere(options.where)
    }

    const count = await query.count('id', 'total')

    if (value.length < count[0].total) {
      return errorReporter.report(
        pointer,
        'allExists',
        "All items doesn't exist in Database",
        arrayExpressionPointer
      )
    }
  }
)
