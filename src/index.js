import postcss from 'postcss'

const atRule2 = postcss.atRule({
  name: 'media',
  params: '(min-resolution: 2dppx)',
})

const atRule3 = postcss.atRule({
  name: 'media',
  params: '(min-resolution: 3dppx)',
})

const plugin = postcss.plugin('postcss-safe-area-inset', prefix => root => {
  root.walkDecls(decl => {
    const { parent, prop, value } = decl
    const { selector } = parent
    if (/constant\(safe-area-inset-top\)/.test(value)) {
      const rule2 = postcss.rule({ selector: prefix ? `${prefix} ${selector}` : selector })
      const rule3 = postcss.rule({ selector: prefix ? `${prefix} ${selector}` : selector })
      const decl2 = postcss.decl({
        prop,
        value: decl.value.replace(/constant\(safe-area-inset-top\)/g, 'calc(constant(safe-area-inset-top) * 2)'),
      })
      const decl3 = postcss.decl({
        prop,
        value: decl.value.replace(/constant\(safe-area-inset-top\)/g, 'calc(constant(safe-area-inset-top) * 3)'),
      })

      rule2.append(decl2)
      rule3.append(decl3)
      atRule2.append(rule2)
      atRule3.append(rule3)
    }
  })
  root.append(atRule2)
  root.append(atRule3)
})

export default plugin
