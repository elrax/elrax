/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["plugin:@typescript-eslint/recommended", "prettier"],
	rules: {
		"import/no-anonymous-default-export": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "inline-type-imports" },
		],
		quotes: [2, "double"],
		semi: [2, "never"],
		"comma-dangle": ["error", "always-multiline"],
	},
	ignorePatterns: ["**/*.config.js", "**/*.config.cjs"],
}
