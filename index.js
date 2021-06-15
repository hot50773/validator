const { array } = require('joi')
class ValidateError extends Error {
  constructor (message) {
    super(message)

    Error.captureStackTrace(this, this.constructor)
  }
}
class Strategies {
  constructor () {
    this._methods = {
      'nonEmpty': this._nonEmpty,
      'email': this._email,
      'maxLength': this._maxLength,
      'minLength': this._minLength
    }

    this._cache = []
  }

  _checkConstraint ({ constraint = '', target, tag }) {
    var args, key, res, method, methods, methodNames, result

    methods = this._methods
    methodNames = Object.keys(methods)
    args = constraint.split(':')

    key = args.splice(0, 1)[0] // take the first element out form 'args'

    if (!methodNames.includes(key)) {
      throw new Error(
        `Validation fail: the constraint name is invalid, should be one of [ ${methodNames} ]`, this
      )
    }

    method = methods[key]

    if (args.length > 0) {
      result = method(target, tag, args)
    } else {
      result = method(target, tag)
    }

    if (result !== true) {
      this._cache.push(result)
    }
  }

  run ({ constraints, target, tag, interruptWhenError }) {
    var errors

    for (let constraint of constraints) {
      this._checkConstraint({ constraint, target, tag })

      if (interruptWhenError && this._cache.length > 0) break
    }

    if (this._cache === []) return

    errors = this._cache.map(error => error.message) // copy cache message to errors
    this._cache = [] // reset cache

    return errors
  }

  _nonEmpty (target, tag) {
    const message = `Parameter "${tag}" should be non-empty`

    if (typeof target === 'undefined' || target === null || target === '') {
      return new ValidateError(message)
    }

    return true
  }

  _email (target, tag) {
    const message = `Parameter "${tag}" should be valid email format`
    const regex = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/

    if (!regex.test(target)) {
      return new ValidateError(message)
    }

    return true
  }

  _maxLength (target, tag, length) {
    const message = `length of parameter "${tag}" should be smaller than or equal to ${length}`
    if (target.length > Number(length)) {
      return new ValidateError(message)
    }

    return true
  }

  _minLength (target, tag, length) {
    const message = `length of parameter "${tag}" should be larger than or equal to ${length}`
    if (target.length < Number(length)) {
      return new ValidateError(message)
    }

    return true
  }

  _alphaNum (target, tag) {
    const message = `Parameter "${tag}" should only include alphabets or digits`
    const regex = /[a-z0-9]*$/

    if (!regex.test(target)) {
      return new ValidateError(message)
    }

    return true
  }
}

class Validator {
  constructor ({ target, checkAll, constraints, tag, Strategies }) {
    // 綁定參數並給預設值
    this.target = target
    this.constraints = constraints || []
    this.checkAll = checkAll || false
    this.tag = tag || ''
    this.Strategies = Strategies

    this._checkParam({
      target: this.target,
      constraints: this.constraints,
      checkAll: this.checkAll,
      tag: this.tag
    })
  }

  run () {
    return this.Strategies.run({
      constraints: this.constraints,
      target: this.target,
      tag: this.tag,
      interruptWhenError: this.checkAll ? false : true
    })
  }

  _checkParam ({ target, constraints, checkAll, tag }) {
    if (target === null || typeof target === 'undefined')
      throw new Error('validation fail: parameter "target" is required')
    if (!Array.isArray(constraints)) {
      throw new Error(
        'validation fail: parameter "constraints" should be an Array'
      )
    }

    if (!typeof tag === 'string') {
      throw new Error('validation fail: parameter "tag" should be String')
    }
    if (!typeof checkAll === 'boolean') {
      throw new Error('validation fail: parameter "checkAll" should be Boolean')
    }
  }
}

module.exports = { Validator, Strategies }
