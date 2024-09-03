Object.defineProperty(window, 'CSS', {value: null});
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
// 设置属性变换
Object.defineProperty(document.body.style, 'transform', {
  // 表示属性的值
  value: () => {
    return {
      // 表示属性是否可以被删除或修改特性
      enumerable: true,
      // 表示属性是否可以通过 for...in 循环或 Object.keys() 方法进行枚举
      configurable: true,
      // 表示属性是否可以被赋值运算符修改
      writable: true
    };
  },
});
