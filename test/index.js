import postcss from 'postcss'
import plugin from '../src'

function format(str) {
  return str.replace(/\s+/g, ' ').trim()
}

const safeAreaInset = ['safe-area-inset-top', 'safe-area-inset-bottom', 'safe-area-inset-left',
  'safe-area-inset-right']

describe('safe-area-inset', () => {
  safeAreaInset.forEach(key => {
    test(key, async () => {
      const input = `
        .test {
          width: constant(${key});
          height: calc(constant(${key}) + 500px);
        }
      `
      const res = await postcss([plugin('html[data-scale]')]).process(input)
      const str = `
        .test {
          width: constant(${key});
          height: calc(constant(${key}) + 500px);
        }
        @media (min-resolution: 2dppx) {
          html[data-scale] .test {
            width: calc(constant(${key}) * 2);
          }
        }
        @media (min-resolution: 3dppx) {
          html[data-scale] .test {
            width: calc(constant(${key}) * 3);
          }
        }
        @media (min-resolution: 2dppx) {
          html[data-scale] .test {
            height: calc(calc(constant(${key}) * 2) + 500px);
          }
        }
        @media (min-resolution: 3dppx) {
          html[data-scale] .test {
            height: calc(calc(constant(${key}) * 3) + 500px);
          }
        }
      `
      expect(format(res.css)).toBe(format(str))
    })
  })
})
