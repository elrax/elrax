const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

// Find the project and workspace directories
const projectRoot = __dirname
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

if (!config.resolver) throw Error("Cannot find resolver config")

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]
// @ts-ignore 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(workspaceRoot, "node_modules"),
]
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true
// 4. Force Metro to resolve package.json exports and symlinks
config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true
// Work around a Metro warning with resolution of tslib defined in "exports" in package.json.
// Potentially can break some packages in the future. New value rewrites "import" with "default".
config.resolver.unstable_conditionNames = ["require", "default"]

module.exports = config
