// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config")

// Find the project and workspace directories
const config = getDefaultConfig(__dirname)

if (config.resolver) {
	// Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
	config.resolver.disableHierarchicalLookup = true
	// Work around a Metro warning with resolution of tslib defined in "exports" in package.json.
	// Potentially can break some packages in the future. New value rewrites "import" with "default".
	config.resolver.unstable_conditionNames = ["require", "default"]
}

module.exports = config
