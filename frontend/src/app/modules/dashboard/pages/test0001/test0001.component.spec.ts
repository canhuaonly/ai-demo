import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Test0001Component } from './test0001.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Test0001Service, fetchData2, getData, all } from "./test0001.component.api";
import axios from 'axios';
// const test0001Service = require('./test0001.component.api')

describe('画面 Test0001 初期化', () => {

  let httpTestingController: HttpTestingController;
  let component: Test0001Component;
  let service: Test0001Service;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Test0001Component, Test0001Service],
    }).compileComponents();
    
    // 创建组件实例
    httpTestingController = TestBed.inject(HttpTestingController);
    component = TestBed.inject(Test0001Component);
    service = TestBed.inject(Test0001Service);

    httpTestingController.verify();
  });

  afterEach(() => {
    // httpTestingController.verify();
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(service).toBeTruthy();
    expect(component).toBeTruthy();
  });

});

describe('画面 Test0001 Dom', () => {
  let component: Test0001Component;
  let fixture: ComponentFixture<Test0001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0001Component, HttpClientTestingModule]
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('测试 创建组件实例 是否成功', () => {
    expect(component).toBeTruthy();
  });

});

test("测试 模拟请求fetchData", async () => {
  // 调用模拟的请求
  const analogData = await fetchData2();
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

  console.log(dataList1);
  console.log(resp);

  jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ id: 3, name: 'Bob' }] })

  expect(await all()).toEqual(dataList2);

  jest.unmock('axios');
});

describe('DOM操作测试', () => {
  it('应该能够创建一个元素并添加到body中', () => {
    // 创建一个新元素
    const newElement = document.createElement('div');
    newElement.textContent = 'Hello, world!';

    // 将新元素添加到body中
    document.body.appendChild(newElement);

    // 验证元素是否被正确添加
    expect(document.body.textContent).toContain('Hello, world!');
  });
});
