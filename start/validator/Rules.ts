import { validator } from '@ioc:Adonis/Core/Validator'
import Database, { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'

interface ArrayExistsWhereCallback {
  (query: DatabaseQueryBuilderContract): void
}

interface ArrayExistsDbOptions {
  table: string
  column?: string
  where?: ArrayExistsWhereCallback
}

validator.rule(
  'allExists',
  async (
    value,
    options: ArrayExistsDbOptions,
    { pointer, arrayExpressionPointer, errorReporter }
  ) => {
    if (!value || !Array.isArray(value)) {
      return
    }

    const query = Database.from(options.table).whereIn(options.column || 'id', value)

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
