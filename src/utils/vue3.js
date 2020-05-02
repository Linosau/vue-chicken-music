// vue3响应式原理：利用Proxy对象对数据拦截
const toProxy = new WeakMap() // 形如 obj：observed
const toRaw = new WeakMap() // 形如 observed：obj

function isObject (obj) {
  return typeof obj === 'object' || obj === null
}

function reactive (obj) {
  if (!isObject(obj)) {
    return obj
  }

  // 查找缓存
  if (toProxy.has(obj)) {
    return toProxy.get(obj)
  }
  // 传入obj就是代理对象，此时不用反复代理
  if (toRaw.has(obj)) {
    return obj
  }

  const observed = new Proxy(obj, {
    get (target, key, receiver) {
      // 访问
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}：${res}`)

      // 依赖收集
      track(target, key)

      return isObject(res) ? reactive(res) : res
    },
    set (target, key, value, receiver) {
      // 新增和更新
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}：${res}`)
      trigger(target, 'SET', key)
      return res
    },
    deleteProperty (target, key) {
      // 删除
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}`)
      return res
    }
  })

  toProxy.set(obj, observed)
  toRaw.set(observed, obj)

  return observed
}

const activeReactiveEffectStack  = []

// 依赖收集执行
// 基本结构{ target: { key: [] } }
let targetsMap = new WeakMap()

function track (target, key) {
  // 从栈中获取响应函数
  const effect = activeReactiveEffectStack[activeReactiveEffectStack.length - 1]
  if (effect) {
    let depsMap = targetsMap.get(target)
    if (!depsMap) {
      // 首次访问target
      depsMap = new Map()
      targetsMap.set(target, depsMap)
    }

    // 存放key
    let deps = depsMap.get(key)
    if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
    }
    if (!deps.has(effect)) {
      deps.add(effect)
    }
  }
}

function trigger () {
  
}

function effect (fn) {
  // 1.异常处理
  // 2.执行函数
  // 3.放置到activeReactiveEffectStack
  const rxEffect = function (...args) {
    try {
      activeReactiveEffectStack.push(rxEffect)
      return fn(...args) // 执行函数触发依赖收集
    } finally {
      activeReactiveEffectStack.pop()
    }
  }

  rxEffect() // 默认立即执行
  return rxEffect
}

const react = reactive({ foo: 'foo', bar: { a: 1 } })
react.foo = 'foooooooo'

/**
 * 依赖收集
 */
// 副作用函数或者响应函数
// 响应效果 reactiveEffect
// 依赖收集：创建getter里面的key和响应函数之间的映射关系
// 1.