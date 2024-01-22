import { channel } from "expo-updates"
import { Environment } from "@elrax/api/src/types"

const Config = {
	env: Environment.DEV,
	apiUrl: null as string | null,
	enableHiddenFeatures: true,
}

if (channel === "production") {
	Config.env = Environment.PRODUCTION
	Config.apiUrl = "https://api.elrax.com"
	Config.enableHiddenFeatures = false
} else if (channel === "staging") {
	Config.env = Environment.STAGING
	Config.apiUrl = "https://api-staging.elrax.com"
	Config.enableHiddenFeatures = true
}

export default Config
