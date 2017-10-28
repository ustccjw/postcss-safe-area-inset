import postcss from 'postcss'
import plugin from '../src'

function format(str) {
  return str.replace(/\s+/g, ' ').trim()
}

describe('box-flex', () => {
  test('box-flex', async () => {
    const input = `
      .test {
        margin-top: constant(safe-area-inset-top);
        top: calc(constant(safe-area-inset-top) + 550px);
      }
    `
    const res = await postcss([plugin()]).process(input)
    const str = `
      .test {
        margin-top: constant(safe-area-inset-top);
        top: calc(constant(safe-area-inset-top) + 550px);
      }
      @media (min-resolution: 2dppx) {
        .test {
          margin-top: calc(constant(safe-area-inset-top) * 2);
        }
        .test {
          top: calc(calc(constant(safe-area-inset-top) * 2) + 550px);
        }
      }
      @media (min-resolution: 3dppx) {
        .test {
          margin-top: calc(constant(safe-area-inset-top) * 3);
        }
        .test {
          top: calc(calc(constant(safe-area-inset-top) * 3) + 550px);
        }
      }
    `
    expect(format(res.css)).toBe(format(str))
  })
})
