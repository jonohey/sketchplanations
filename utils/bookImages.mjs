// Utility to load all book page images from the big-ideas-pages folder
// This creates a mapping of image names to their imported paths

// Import all images from the big-ideas-pages folder
import bigIdeasBookSpreadAwkwardnessVortex from '../images/big-ideas-pages/big-ideas-book-spread-Awkwardness-Vortex.png';
import bigIdeasBookSpreadCoastlineParadox from '../images/big-ideas-pages/big-ideas-book-spread-coastline-paradox.png';
import bigIdeasBookSpreadDaysOfTheWeek from '../images/big-ideas-pages/big-ideas-book-spread-Days-of-the-week.png';
import bigIdeasBookSpreadFlow from '../images/big-ideas-pages/big-ideas-book-spread-Flow.png';
import bigIdeasBookSpreadGoldilocksZone from '../images/big-ideas-pages/big-ideas-book-spread-Goldilocks-zone.png';
import bigIdeasBookSpreadHope from '../images/big-ideas-pages/big-ideas-book-spread-Hope.png';
import bigIdeasBookSpreadHowToWinAtMonopoly from '../images/big-ideas-pages/big-ideas-book-spread-How-to-win-at-Monopoly.png';
import bigIdeasBookSpreadRACI from '../images/big-ideas-pages/big-ideas-book-spread-RACI.png';
import bigIdeasBookSpreadSeasons from '../images/big-ideas-pages/big-ideas-book-spread-Seasons.png';
import bigIdeasBookSpreadSolarSystemSizes from '../images/big-ideas-pages/big-ideas-book-spread-Solar-system-sizes.png';
import bigIdeasBookSpreadStartingACompany from '../images/big-ideas-pages/big-ideas-book-spread-Starting-a-company.png';
import bigIdeasBookSpreadSurvivorshipBias from '../images/big-ideas-pages/big-ideas-book-spread-Survivorship-bias.png';
import bigIdeasBookSpreadSwissCheeseModel from '../images/big-ideas-pages/big-ideas-book-spread-Swiss-cheese-model.png';
import bigIdeasBookSpreadTheDopplerEffect from '../images/big-ideas-pages/big-ideas-book-spread-the-Doppler-effect.png';
import bigIdeasBookSpreadTheParadoxOfChoice from '../images/big-ideas-pages/big-ideas-book-spread-the-paradox-of-choice.png';
import bigIdeasBookSpreadThePotatoRadius from '../images/big-ideas-pages/big-ideas-book-spread-The-potato-radius.png';
import bigIdeasBookSpreadTsundoku from '../images/big-ideas-pages/big-ideas-book-spread-Tsundoku.png';

// Create a mapping of image names to their imported paths
const bookImages = {
  'big-ideas-book-spread-Awkwardness-Vortex.png': bigIdeasBookSpreadAwkwardnessVortex,
  'big-ideas-book-spread-coastline-paradox.png': bigIdeasBookSpreadCoastlineParadox,
  'big-ideas-book-spread-Days-of-the-week.png': bigIdeasBookSpreadDaysOfTheWeek,
  'big-ideas-book-spread-Flow.png': bigIdeasBookSpreadFlow,
  'big-ideas-book-spread-Goldilocks-zone.png': bigIdeasBookSpreadGoldilocksZone,
  'big-ideas-book-spread-Hope.png': bigIdeasBookSpreadHope,
  'big-ideas-book-spread-How-to-win-at-Monopoly.png': bigIdeasBookSpreadHowToWinAtMonopoly,
  'big-ideas-book-spread-RACI.png': bigIdeasBookSpreadRACI,
  'big-ideas-book-spread-Seasons.png': bigIdeasBookSpreadSeasons,
  'big-ideas-book-spread-Solar-system-sizes.png': bigIdeasBookSpreadSolarSystemSizes,
  'big-ideas-book-spread-Starting-a-company.png': bigIdeasBookSpreadStartingACompany,
  'big-ideas-book-spread-Survivorship-bias.png': bigIdeasBookSpreadSurvivorshipBias,
  'big-ideas-book-spread-Swiss-cheese-model.png': bigIdeasBookSpreadSwissCheeseModel,
  'big-ideas-book-spread-the-Doppler-effect.png': bigIdeasBookSpreadTheDopplerEffect,
  'big-ideas-book-spread-the-paradox-of-choice.png': bigIdeasBookSpreadTheParadoxOfChoice,
  'big-ideas-book-spread-The-potato-radius.png': bigIdeasBookSpreadThePotatoRadius,
  'big-ideas-book-spread-Tsundoku.png': bigIdeasBookSpreadTsundoku,
};

// Create an array of image objects with metadata
export const bookPageImages = Object.entries(bookImages).map(([filename, src]) => {
  // Extract the concept name from the filename
  const conceptName = filename
    .replace('big-ideas-book-spread-', '')
    .replace('.png', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return {
    src,
    alt: `${conceptName} - Book page spread from Big Ideas Little Pictures`,
    filename,
    conceptName
  };
});

export default bookPageImages;
