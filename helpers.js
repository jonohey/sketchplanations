const defaultPageTitle = 'Sketchplanations - A weekly explanation in a sketch'

export const pageTitle = (title) => {
  if (!title) return defaultPageTitle

  return `${title} - Sketchplanations`
}
