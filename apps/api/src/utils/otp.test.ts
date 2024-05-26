import { expect, test } from "bun:test"
import { generateOTP } from "./otp"

test("test_generateOTP", () => {
	const res = generateOTP()
	expect(res.token.length).toBe(6)
	expect(res.secret.length).toBe(16)
})
