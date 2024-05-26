import eslintPluginAstro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"
import prettiereslint from "eslint-config-prettier"

export default [
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	prettiereslint,
	{
		rules: {
			"@typescript-eslint/triple-slash-reference": "off",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					"prefer": "type-imports",
					"fixStyle": "inline-type-imports",
				},
			],
			"quotes": [
				2,
				"double",
			],
			"semi": [
				2,
				"never",
			],
			"comma-dangle": [
				"error",
				"always-multiline",
			],
		},
	},
]
