import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import type * as schema from "./schema"

export * from "./schema"
export * from "./helpers"
export * from "./types"

export type Database = BaseSQLiteDatabase<"async" | "sync", D1Result | void, typeof schema>
