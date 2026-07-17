import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readComponent = (fileName) => readFileSync(new URL(`../../components/${fileName}`, import.meta.url), 'utf8')

describe('Footer', () => {
  it('keeps its important navigation links and includes the scene', () => {
    const footer = readComponent('Footer.js')

    expect(footer).toMatch(/aria-label=['"]Footer['"]/)
    expect(footer).toMatch(/href=['"]\/search['"]/)
    expect(footer).toMatch(/href=['"]\/categories['"]/)
    expect(footer).toMatch(/href=['"]\/about['"]/)
    expect(footer).toMatch(/href=['"]\/licence['"]/)
    expect(footer).toContain('<FooterScene />')
  })

  it('defines one assistive-technology-hidden boat image', () => {
    const scene = readComponent('FooterScene.js')

    expect(scene).toMatch(/data-testid=['"]footer-scene['"]/)
    expect(scene).toMatch(/aria-hidden=['"]true['"]/)
    expect(scene.match(/\/images\/footer\/boat\.png/g)).toHaveLength(1)
    expect(scene).toMatch(/alt=(['"])\1/)
    expect(scene).toMatch(/fetchPriority=['"]low['"]/)
    expect(scene).not.toMatch(/loading=['"]lazy['"]/)
  })

  it('disables decorative motion when reduced motion is preferred', () => {
    const css = readComponent('FooterScene.module.css')

    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toMatch(/\.boat\s*\{\s*animation: none;/)
    expect(css).toMatch(/will-change: auto;/)
  })
})
