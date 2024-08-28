import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Test0002Component } from './test0002.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fetchData, getData, all } from "./test0002.component.api";
import axios from 'axios';
const test0002Service = require('./test0002.component.api')

describe('Test0002Component', () => {
  let component: Test0002Component;
  let fixture: ComponentFixture<Test0002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0002Component, HttpClientTestingModule]
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(component).toBeTruthy();
  });

  it('测试 是否可以调用到组件内的方法', () => {
    expect(component.getData).toBeTruthy();
  });

  it('测试 变成可监听的函数 spyOn', () => {
  
    // 创建一个被监视的函数 test0002Service.add
    const spy = jest.spyOn(test0002Service, 'add');

    // 验证函数没有被调用
    expect(spy).not.toHaveBeenCalled();
  
    // 调用test0002Service的add方法
    console.log(test0002Service.add(1, 2));

    // 验证函数已经被调用
    expect(spy).toHaveBeenCalled();
  
    // 验证函数被调用的次数
    expect(spy).toHaveBeenCalledTimes(1);

    // 验证函数被特定参数调用
    expect(spy).toHaveBeenCalledWith(1, 2);

    // 验证函数的返回值是否正确
    expect(test0002Service.add(1, 2)).toBe(3);
  });

});


test("测试 模拟请求fetchData", async () => {
  // 调用模拟的请求
  const analogData = await fetchData();
  // 是否有值
  expect(analogData).toBeTruthy();
  // 是否相等
  expect(analogData).toEqual({ success: true });

  // 调用真实的请求
  const realData: any = await getData();
  // 是否有值
  expect(realData).toBeTruthy();
  // 是否相等
  expect(realData.data).toEqual({ success: true })
});

test('测试 模拟请求 axios', async () => {

  // mock axios
  jest.mock('axios');

  const dataList1 = [
    { id: 1, name: 'Tom' },
    { id: 2, name: 'Jerry' },
  ];

  const dataList2 = [
    {id: 3, name: 'Bob'}
  ];
  const resp = {data: dataList2};

  jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ id: 3, name: 'Bob' }] })

  expect(await all()).toEqual(dataList2);

  jest.unmock('axios');
});