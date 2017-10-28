import postcss from 'postcss'
import plugin from '../src'

function format(str) {
  return str.replace(/\s+/g, ' ').trim()
}

describe('safe-area-inset', () => {
  test('safe-area-inset-top', async () => {
    const input = `
      .test {
        margin-top: constant(safe-area-inset-top);
        top: calc(constant(safe-area-inset-top) + 550px);
      }
    `
    const res = await postcss([plugin('html[data-scale]')]).process(input)
    const str = `
      .test {
        margin-top: constant(safe-area-inset-top);
        top: calc(constant(safe-area-inset-top) + 550px);
      }
      @media (min-resolution: 2dppx) {
        html[data-scale] .test {
          margin-top: calc(constant(safe-area-inset-top) * 2);
        }
        html[data-scale] .test {
          top: calc(calc(constant(safe-area-inset-top) * 2) + 550px);
        }
      }
      @media (min-resolution: 3dppx) {
        html[data-scale] .test {
          margin-top: calc(constant(safe-area-inset-top) * 3);
        }
        html[data-scale] .test {
          top: calc(calc(constant(safe-area-inset-top) * 3) + 550px);
        }
      }
    `
    expect(format(res.css)).toBe(format(str))
  })
})
