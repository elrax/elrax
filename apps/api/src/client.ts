import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "./router"

export { appRouter, type AppRouter } from "./router"
export { createContext } from "./trpc"
export type * from "./types"

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
