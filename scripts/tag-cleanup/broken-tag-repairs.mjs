/**
 * Optional replacements when stripping orphaned (broken) tag links.
 *
 * Broken links are always removed by `fix-broken-tags`. addSlugs are applied
 * on top for sketches that would otherwise lose useful categorisation.
 *
 * Leave empty when there is nothing pending; add rows when an audit finds
 * orphaned links that need replacement tags.
 */
export const BROKEN_TAG_REPAIRS = [];
