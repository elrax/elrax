import { expect, test } from "bun:test"
import { initTestDB } from "./testDB"

test("test_initTestDB", async () => {
	const db = await initTestDB()
	const u = await db.query.users.findFirst()
	expect(u).toBeUndefined()
})
