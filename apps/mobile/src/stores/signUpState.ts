import type { SignedWith } from "@elrax/api/src/db/types"
import { create } from "zustand"

type UserSignUpData = {
	oauthProvider?: SignedWith
	email?: string
	username?: string
	firstName?: string
	lastName?: string
}

interface SignUpState {
	userData?: UserSignUpData
	setUserData: (userData: UserSignUpData) => void
}

export const useSignUpState = create<SignUpState>((set) => ({
	userData: undefined,
	setUserData: (userData) => set(() => ({ userData })),
}))
