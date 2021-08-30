declare module '@ioc:Adonis/Core/Validator' {
  import { Rule } from '@ioc:Adonis/Core/Validator'
  import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'

  interface ArrayExistsWhereCallback {
    (query: DatabaseQueryBuilderContract): void
  }

  interface ArrayExistsDbOptions {
    table: string
    column?: string
    where?: ArrayExistsWhereCallback
  }

  export interface Rules {
    allExists(options: ArrayExistsDbOptions): Rule
  }
}
