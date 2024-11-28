import type { LibSQLDatabase } from "drizzle-orm/libsql"
import type * as schema from "./schema"

export * from "./schema"
export * from "./helpers"
export * from "./types"

export type Database = LibSQLDatabase<typeof schema>
