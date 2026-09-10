let baseLoaded = false;
let effectCardsLoaded = false;

export async function loadSwiperStyles({ effectCards = false } = {}) {
	if (!baseLoaded) {
		await import("swiper/css");
		baseLoaded = true;
	}

	if (effectCards && !effectCardsLoaded) {
		await import("swiper/css/effect-cards");
		effectCardsLoaded = true;
	}
}
