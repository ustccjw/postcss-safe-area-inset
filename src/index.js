const postcss = require('postcss')

const safeAreaInset = ['safe-area-inset-top', 'safe-area-inset-bottom', 'safe-area-inset-left',
  'safe-area-inset-right']

const plugin = postcss.plugin('postcss-safe-area-inset', prefix => root => {
  const parents = []
  root.walkDecls(decl => {
    const { parent, prop, value } = decl
    const { selector } = parent
    const regexpArr = safeAreaInset.map(key => new RegExp(`constant\\(${key}\\)`, 'g'))
    const regexpArr2 = safeAreaInset.map(key => new RegExp(`env\\(${key}\\)`, 'g'))
    const flag = [...regexpArr, ...regexpArr2].some(regexp => regexp.test(value))
    if (flag) {
      let value2 = decl.value
      let value3 = decl.value
      regexpArr.forEach((regexp, i) => {
        value2 = value2.replace(regexp, `calc(constant(${safeAreaInset[i]}) * 2)`)
        value3 = value3.replace(regexp, `calc(constant(${safeAreaInset[i]}) * 3)`)
      })
      regexpArr2.forEach((regexp, i) => {
        value2 = value2.replace(regexp, `calc(env(${safeAreaInset[i]}) * 2)`)
        value3 = value3.replace(regexp, `calc(env(${safeAreaInset[i]}) * 3)`)
      })
      selector.split(',').forEach(selector2 => {
        selector2 = selector2.trim() // eslint-disable-line no-param-reassign
        if (selector2.indexOf(prefix) !== 0) {
          const atRule2 = postcss.atRule({
            name: 'media',
            params: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx)',
          })
          const atRule3 = postcss.atRule({
            name: 'media',
            params: '(-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx)',
          })
          const rule2 = postcss.rule({ selector: prefix ? `${prefix} ${selector2}` : selector2 })
          const rule3 = postcss.rule({ selector: prefix ? `${prefix} ${selector2}` : selector2 })
          const decl2 = postcss.decl({
            prop,
            value: value2,
          })
          const decl3 = postcss.decl({
            prop,
            value: value3,
          })
          rule2.append(decl2)
          rule3.append(decl3)
          atRule2.append(rule2)
          atRule3.append(rule3)
          if (parents.indexOf(parent) === -1) parents.push(parent)
          parent.rules_x = parent.rules_x || []
          parent.rules_x.push(atRule2, atRule3)
        }
      })
    }
  })
  parents.forEach(parent => {
    const { rules_x } = parent
    for (let i = rules_x.length - 1; i >= 0; i--) parent.parent.insertAfter(parent, rules_x[i])
  })
})

module.exports = plugin
