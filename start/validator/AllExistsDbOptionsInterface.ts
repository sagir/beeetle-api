import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'

export interface AllExistsWhereCallback {
  (query: DatabaseQueryBuilderContract): void
}

export interface AllExistsDbOptions {
  table: string
  column?: string
  field?: string
  where?: AllExistsWhereCallback
}
