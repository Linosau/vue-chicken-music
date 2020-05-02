// vue2对象响应式原理：Object.defineProperty()
// vue2数组响应式原理：覆盖可以修改数组的7个方法
// 从数组原型中获取这7个方法，并覆盖为可以发送更新通知的函数实现
const originalProto = Array.prototype
const arrayProto = Object.create(originalProto)
['push', 'pop', 'shift', 'unshift'].forEach(method => {
  arrayProto[method] = function () {
    //
    originalProto[method].apply(this, arguments)
    // 通知更新
    notifyUpdate()
  }
})

// 思想：递归遍历传入的obj，定义每个属性的拦截
function observe (obj) {
  if (typeof obj !== 'object' && obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    Object.setPrototypeOf(obj, arrayProto)
  } else {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = key[i]
      defineReactive(obj, key, obj[key])
    }
  }
}

// 具体定义指定的key拦截器
function defineReactive (obj, key, val) {
  // 递归遍历
  observe(val)

  // val实际上是一个必包
  Object.defineProperty(obj, key, {
    get () {
      return val
    },
    set (newVal) {
      if (newVal !== val) {
        // val可能是对象
        observe(newVal)
        notifyUpdate()
        val = newVal
      }
    }
  })
}

function notifyUpdate () {
  console.log('页面更新')
}

const data = {
  foo: 'foo'
}
observe(data)
data.foo = 'fooooooo'

// 问题分析：
// 1.需要响应化的数据较大，递归遍历性能不好、消耗较大
// 2.新增或删除属性无法监听
// 3.数组响应化需要额外实现
// 4.修改语法有限制