import { TRPCError } from "@trpc/server"
import jwt, { type JwtAlgorithm } from "@tsndr/cloudflare-worker-jwt"

const AUD = "com.elrax.elrax"

const APPLE_BASE_URL = "https://appleid.apple.com"
const FACEBOOK_BASE_URL = "https://graph.facebook.com"
const GOOGLE_BASE_URL = "https://www.googleapis.com"

type JwtKeys = {
	keys: {
		kty: string
		kid: string
		n: string
		alg: JwtAlgorithm
	}[]
}

export const verifyAppleToken = async (token: string) => {
	const jwtData = jwt.decode(token)
	const header = jwtData.header as { kid: string }
	if (!jwtData.header) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - no header",
		})
	}

	// Get Apple's public keys
	const appleidResponse = await fetch(`${APPLE_BASE_URL}/auth/keys`)
	const appleidKeys = (await appleidResponse.json()) as JwtKeys
	const appleidKey = appleidKeys.keys.find((key) => key.kid === header.kid)
	if (!appleidKey) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not find appleid key",
		})
	}

	// Verify jwt token
	const isValid = await jwt.verify(token, appleidKey as JsonWebKey, appleidKey.alg)
	if (!isValid) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not verify",
		})
	}
	if (jwtData.payload?.iss !== APPLE_BASE_URL) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - issuer",
		})
	}
	if (jwtData.payload?.aud !== AUD) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - audience",
		})
	}

	const payload = jwtData.payload as { email: string }
	return {
		email: payload.email,
	}
}

export const verifyFacebookToken = async (token: string, appId: string, appSecret: string) => {
	// Verify if Facebook token is valid
	const facebookResponse = await fetch(
		`${FACEBOOK_BASE_URL}/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`,
	)
	if (!facebookResponse.ok) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not verify through facebook api",
		})
	}
	const facebookRes = (await facebookResponse.json()) as {
		data: {
			app_id: string
			type: "USER"
			application: string
			data_access_expires_at: number
			expires_at: boolean
			is_valid: boolean
			issued_at: number
			scopes: string[]
			user_id: string
		}
	}
	if (facebookRes.data.app_id !== appId) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - app id",
		})
	}

	const fbResponse = await fetch(
		`${FACEBOOK_BASE_URL}/me?fields=id,first_name,last_name,email&access_token=${token}`,
	)
	if (!fbResponse.ok) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not get user info",
		})
	}
	const userInfo = (await fbResponse.json()) as {
		id: string
		email?: string
		first_name?: string
		last_name?: string
	}
	return {
		userId: userInfo.id,
		email: userInfo.email,
		firstName: userInfo.first_name,
		lastName: userInfo.last_name,
	}
}

export const verifyGoogleToken = async (token: string) => {
	const jwtData = jwt.decode(token)
	const header = jwtData.header as { kid: string }
	if (!jwtData.header) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - no header",
		})
	}

	// Get Google's public keys
	const googleResponse = await fetch(`${GOOGLE_BASE_URL}/oauth2/v3/certs`)
	const googleKeys = (await googleResponse.json()) as JwtKeys
	const googleKey = googleKeys.keys.find((key) => key.kid === header.kid)
	if (!googleKey) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not find appleid key",
		})
	}

	// Verify jwt token
	const isValid = await jwt.verify(token, googleKey as JsonWebKey, googleKey.alg)
	if (!isValid) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - could not verify",
		})
	}
	if (jwtData.payload?.iss !== "https://accounts.google.com") {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid token - issuer",
		})
	}
	// TODO: Verify audience / origin
	// if (jwtData.payload?.aud === ) {
	// 	throw new TRPCError({
	// 		code: "BAD_REQUEST",
	// 		message: "Invalid token - audience",
	// 	})
	// }

	const payload = jwtData.payload as {
		email: string
		given_name: string
		family_name: string
		picture: string
	}
	return {
		email: payload.email,
		firstName: payload.given_name,
		lastName: payload.family_name,
	}
}
