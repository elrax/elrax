import { Buffer } from "node:buffer"
globalThis.Buffer = Buffer

import { Authenticator, type AuthenticatorOptions } from "@otplib/core"
import { keyDecoder, keyEncoder } from "@otplib/plugin-base32-enc-dec"
import { createDigest, createRandomBytes } from "@otplib/plugin-crypto-js"
import { dateNow } from "./date"

export const authenticator = new Authenticator<AuthenticatorOptions>({
	createDigest,
	createRandomBytes,
	keyDecoder,
	keyEncoder,
})

export const generateOTP = () => {
	const secret = authenticator.generateSecret()
	const token = authenticator.generate(secret)
	return {
		secret,
		token,
		date: dateNow(),
	}
}
