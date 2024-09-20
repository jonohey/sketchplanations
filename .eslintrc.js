module.exports = {
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@next/next/recommended",
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	rules: {
		"react/prop-types": 0,
		"react/react-in-jsx-scope": "off",
		"react/no-unknown-property": [
			2,
			{
				ignore: ["jsx"],
			},
		],
		'react/no-unescaped-entities': ['error', { forbid: ['\'', '"'] }],
	},
	settings: {
		"import/core-modules": ["styled-jsx/css"],
		react: { version: "detect" },
	},
};
