import Vue from "vue"
import { isObject, isArray } from "util"

function Vur() {

}

/**
 * $on、$emit方法
 */
Vue.prototype._event = []

Vue.prototype.$on = function (event, fn) {
  var vm = this
  if (Array.isArray(event)) {
    for (var i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = []).push(fn)
    if (hookRE.test(event)) {
      vm.hasHookEvent = true
    }
  }
  return vm
}

Vue.prototype.$emit = function (event) {
  var vm = this
  var cbs = _event[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    var args = toArray(arguments, 1)
    for (var i = 0, l = cbs.length; i < l; i++) {
      invokeWithErrorHandling(cbs[i], vm)
    }
  }
  return vm
}

/**
 * Vue.component
 */


/**
 * Vue.use
 */
Vue.use = function (plugin) {
  var installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  // additional parameters
  var args = toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return this
}

/**
 * Vue.observable
 */
// 监测数据的变化
// observe 方法的作用就是给非VNode的对象类型数据添加一个Observer，
// 如果已经添加过则直接返回，否则在满足一定条件下去实例化一个Observer对象实例。
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (/* 判断 */) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
// def 函数把自身实例添加到数据对象 value 的 __ob__ 属性上
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

// Observer是一个类，它的作用是给对象的属性添加getter和setter，用于依赖收集和派发更新
var Observer = function Observer (value) {
  this.value = value
  this.dep = new Dep()
  this.vmCount = 0
  def(value, '__ob__', this)
  if (Array,isArray(value)) {
    // xxxxx
    this.observeArray(value)
  } else {
    this.walk(value)
  }
}
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]) // 核心---创建响应式对象
  }
}
Observer.prototype.observeArray = function observeArray (items) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
}


Vue.observable = function (obj) {
  observe(obj)
  return obj
}

