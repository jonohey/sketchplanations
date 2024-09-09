/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */

export default {
	guiOptions: {
		consentModal: {
			layout: "box",
			position: "bottom right",
			flipButtons: true,
			equalWeightButtons: false,
		},
		preferencesModal: {
			equalWeightButtons: false,
		},
	},
	categories: {
		necessary: {
			enabled: true, // this category is enabled by default
			readOnly: true, // this category cannot be disabled
		},
		analytics: {
			enabled: false,
			readOnly: false,
			autoClear: {
				cookies: [
					{
						name: "_ga",
					},
					{
						name: "_hj",
					},
				],
			},
		},
	},

	language: {
		default: "en",
		translations: {
			en: {
				consentModal: {
					title: "Welcome",
					description:
						"Stay and check out 100s of topics explained in sketches. Also, I use cookies.",
					acceptAllBtn: "Accept all",
					acceptNecessaryBtn: "Reject all",
					showPreferencesBtn: "Manage",
				},
				preferencesModal: {
					title: "Manage cookie preferences",
					acceptAllBtn: "Accept all",
					acceptNecessaryBtn: "Reject all",
					savePreferencesBtn: "Save preferences",
					closeIconLabel: "Close modal",
					sections: [
						{
							title: "Somebody said ... cookies?",
							description:
								"Toggle on/off below as you wish. I use cookies to help make the site better.",
						},
						{
							title: "Strictly Necessary cookies",
							description:
								"These cookies are essential for the proper functioning of the website and cannot be disabled.",

							//this field will generate a toggle linked to the 'necessary' category
							linkedCategory: "necessary",
						},
						{
							title: "Performance and Analytics",
							description:
								"These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
							linkedCategory: "analytics",
						},
						{
							title: "More information",
							description: 'See my <a href="/privacy">privacy page</a>',
						},
					],
				},
			},
		},
	},
};
