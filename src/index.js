import postcss from 'postcss'

const atRule2 = postcss.atRule({
  name: 'media',
  params: '(min-resolution: 2dppx)',
})

const atRule3 = postcss.atRule({
  name: 'media',
  params: '(min-resolution: 3dppx)',
})

const safeAreaInset = ['safe-area-inset-top', 'safe-area-inset-bottom', 'safe-area-inset-left',
  'safe-area-inset-right']

const plugin = postcss.plugin('postcss-safe-area-inset', prefix => root => {
  let flag = false
  root.walkDecls(decl => {
    const { parent, prop, value } = decl
    const { selector } = parent
    safeAreaInset.forEach(key => {
      const regexp = new RegExp(`constant\\(${key}\\)`, 'g')
      if (regexp.test(value)) {
        const rule2 = postcss.rule({ selector: prefix ? `${prefix} ${selector}` : selector })
        const rule3 = postcss.rule({ selector: prefix ? `${prefix} ${selector}` : selector })
        const decl2 = postcss.decl({
          prop,
          value: decl.value.replace(regexp, `calc(constant(${key}) * 2)`),
        })
        const decl3 = postcss.decl({
          prop,
          value: decl.value.replace(regexp, `calc(constant(${key}) * 3)`),
        })

        rule2.append(decl2)
        rule3.append(decl3)
        atRule2.append(rule2)
        atRule3.append(rule3)
        flag = true
      }
    })
  })
  if (flag) {
    root.append(atRule2)
    root.append(atRule3)
  }
})

export default plugin
