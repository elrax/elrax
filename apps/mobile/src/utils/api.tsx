import React, { useState } from "react"
import Constants from "expo-constants"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import type { AppRouter } from "@elrax/api"

/**
 * A set of typesafe hooks for consuming the API.
 */
export const api = createTRPCReact<AppRouter>()
export { type RouterInputs, type RouterOutputs } from "@elrax/api"

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL
	if (apiUrl === "production") {
		return apiUrl
	}

	const debuggerHost = Constants.expoConfig?.hostUri
	const localhost = debuggerHost?.split(":")[0]

	if (!localhost) {
		return "https://api-staging.elrax.com"
	}
	return `http://${localhost}:8787`
}

/**
 * A wrapper for the app that provides the TRPC context.
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())
	const [trpcClient] = useState(() =>
		api.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/v1`,
					headers() {
						const headers = new Map<string, string>()
						headers.set("x-trpc-source", "elrax-app")
						return Object.fromEntries(headers)
					},
				}),
			],
		}),
	)
	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</api.Provider>
	)
}
