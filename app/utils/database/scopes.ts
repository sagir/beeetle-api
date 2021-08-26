import { LucidModel, LucidRow, ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export function active(query: ModelQueryBuilderContract<LucidModel, LucidRow>) {
  query.whereNull('deactivated_at').orWhere('deactivated_at', '>', DateTime.now().toSQL())
}

export function inactive(query: ModelQueryBuilderContract<LucidModel, LucidRow>) {
  query.whereNotNull('deactivated_at').andWhere('deactivated_at', '<=', DateTime.now().toSQL())
}
