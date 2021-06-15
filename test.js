const Validator = require('./index').Validator
const Strategies = require('./index').Strategies

const name = ''
const nameConstraints = ['nonEmpty', 'maxLength:2', 'minLength:3']

NameValidator = new Validator({
  target: name,
  constraints: nameConstraints,
  checkAll: true,
  tag: 'name',
  Strategies: new Strategies()
})

console.log(`--- case 1 ---`)
console.table({
  target: name,
  constraints: `[${nameConstraints}]`
})

console.log('result:')
console.log(NameValidator.run())
console.log(`------`)

const email1 = 'e@mail.com'
const email2 = 'email2'
const emailConstraints = ['nonEmpty', 'email']

EmailValidator1 = new Validator({
  target: email1,
  constraints: emailConstraints,
  checkAll: true,
  tag: '@email',
  Strategies: new Strategies()
})

console.log(`--- case 2 ---`)
console.table({
  target: email1,
  constraints: `[${emailConstraints}]`
})

console.log('result:')
console.log(EmailValidator1.run())
console.log('------')

EmailValidator2 = new Validator({
  target: email2,
  constraints: emailConstraints,
  checkAll: true,
  tag: 'email',
  Strategies: new Strategies()
})

console.log(`--- case 3 ---`)
console.table({
  target: email2,
  constraints: `[${emailConstraints}]`
})
console.log('result:')
console.log(EmailValidator2.run())
