import BaseSchema from '@ioc:Adonis/Lucid/Schema'

/**
 * will be used for stock tracking
 * will behave like a pivot table
 * for many to many relationships
 * between
 * product store
 * product supplier
 * product store supplier
 */
export default class StockPivot extends BaseSchema {
  protected tableName = 'stocks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table
        .integer('store_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('stores')
        .onDelete('CASCADE')

      table
        .integer('supplier_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('suppliers')
        .onDelete('CASCADE')

      table.integer('quantity').unsigned().notNullable()

      // to prevent duplicates
      table.unique(['product_id', 'store_id', 'supplier_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
