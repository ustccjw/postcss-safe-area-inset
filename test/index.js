import postcss from 'postcss'
import plugin from '../src'

function format(str) {
  return str.replace(/\s+/g, ' ').trim()
}

describe('safe-area-inset', () => {
  test('safe-area-inset', async () => {
    const input = `
      .test {
        top: constant(safe-area-inset-top);
        bottom: constant(safe-area-inset-bottom);
        left: constant(safe-area-inset-left);
        right: constant(safe-area-inset-right);
      }
    `
    const res = await postcss([plugin('html[data-scale]')]).process(input)
    const str = `
      .test {
        top: constant(safe-area-inset-top);
        bottom: constant(safe-area-inset-bottom);
        left: constant(safe-area-inset-left);
        right: constant(safe-area-inset-right);
      }
      @media (min-resolution: 2dppx) {
        html[data-scale] .test {
          top: calc(constant(safe-area-inset-top) * 2);
        }
        html[data-scale] .test {
          bottom: calc(constant(safe-area-inset-bottom) * 2);
        }
        html[data-scale] .test {
          left: calc(constant(safe-area-inset-left) * 2);
        }
        html[data-scale] .test {
          right: calc(constant(safe-area-inset-right) * 2);
        }
      }
      @media (min-resolution: 3dppx) {
        html[data-scale] .test {
          top: calc(constant(safe-area-inset-top) * 3);
        }
        html[data-scale] .test {
          bottom: calc(constant(safe-area-inset-bottom) * 3);
        }
        html[data-scale] .test {
          left: calc(constant(safe-area-inset-left) * 3);
        }
        html[data-scale] .test {
          right: calc(constant(safe-area-inset-right) * 3);
        }
      }
    `
    expect(format(res.css)).toBe(format(str))
  })
})
