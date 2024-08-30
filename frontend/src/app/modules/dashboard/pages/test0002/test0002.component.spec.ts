import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Test0002Component } from './test0002.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Test0002Service, fetchData, getData, all } from "./test0002.component.api";
import axios from 'axios';
const test0002Service = require('./test0002.component.api')

describe('画面 Test0002 初期化', () => {

  let httpTestingController: HttpTestingController;
  let component: Test0002Component;
  let service: Test0002Service;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Test0002Component, Test0002Service],
    }).compileComponents();
    
    // 创建组件实例
    httpTestingController = TestBed.inject(HttpTestingController);
    component = TestBed.inject(Test0002Component);
    service = TestBed.inject(Test0002Service);

    httpTestingController.verify();
  });

  afterEach(() => {
    // httpTestingController.verify();
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(service).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('测试 初期化值 是否正确', () => {

    // 验证默认值全部为空
    expect(component.userNm).toBe('');
    expect(component.contactsList.length).toBe(0);
    expect(component.sendInput).toBe('');
    expect(component.messageList.length).toBe(0);
    
    // 模拟调用后台，设置返回值
    const getUserSpy = jest.spyOn(service, 'getUser').mockResolvedValue([{user_nm: 'aaa'}]);
    const getContactsListSpy = jest.spyOn(service, 'getContactsList').mockResolvedValue([{user_session_aka: 'aaa', message: 'bbb'}]);
    const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockResolvedValue([{message: 'aaa'}, {message: 'bbb'}]);

    // 验证函数没有被调用
    expect(getUserSpy).not.toHaveBeenCalled();
    expect(getContactsListSpy).not.toHaveBeenCalled();
    expect(getMessageListSpy).not.toHaveBeenCalled();

    component.getData().then(() => {

      // 验证函数调用后初期值不为空
      expect(component.userNm).not.toBe('');
      expect(component.contactsList.length).not.toBe(0);
      expect(component.messageList.length).not.toBe(0);

      // 验证函数被调用的次数
      expect(getUserSpy).toHaveBeenCalledTimes(1);
      expect(getContactsListSpy).toHaveBeenCalledTimes(1);
      expect(getMessageListSpy).toHaveBeenCalledTimes(1);
    });

    // 验证函数已经被调用
    expect(getUserSpy).toHaveBeenCalled();
    expect(getContactsListSpy).toHaveBeenCalled();
    expect(getMessageListSpy).toHaveBeenCalled();

    // 验证函数被调用的次数
    expect(getUserSpy).toHaveBeenCalledTimes(1);
    expect(getContactsListSpy).toHaveBeenCalledTimes(1);
    expect(getMessageListSpy).toHaveBeenCalledTimes(1);
  });
});

describe('画面 Test0002 Send', () => {

  let httpTestingController: HttpTestingController;
  let component: Test0002Component;
  let service: Test0002Service;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Test0002Component, Test0002Service],
    }).compileComponents();
    
    // 创建组件实例
    httpTestingController = TestBed.inject(HttpTestingController);
    component = TestBed.inject(Test0002Component);
    service = TestBed.inject(Test0002Service);

    httpTestingController.verify();
  });

  it('测试 Send按钮 按下', async () => {

    // 要传递的参数
    let sendInput = 'Hello';
    component.sendInput = sendInput;

    // 模拟调用Send按钮的参数
    let tempReq = {
      user_cd: 'user',
      user_nm: 'Wang',
      message_order: 3,
      message: sendInput,
      wenxin_id: 0,
    }

    // 模拟Send按钮的返回值
    let tempRes = {
      status: '666', 
      entity: [
        {
          "user_cd": "user",
          "user_nm": "Wang",
          "message": "你会说英文吗",
          "wenxin_id": 34,
          "message_order": 21
        },
        {
          "message": "是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。",
          "user_cd": "assistant",
          "user_nm": "文心一言",
          "wenxin_id": 35,
          "message_order": 22
        }
      ]
    }
    
    // 模拟调用后台，设置返回值
    jest.spyOn(service, 'getMessageList').mockResolvedValue([{message: 'aaa'}, {message: 'bbb'}]);
    const scrollToBottomSpy = jest.spyOn(component, 'scrollToBottom');

    await component.getData().then(async () => {

      // 验证函数调用后初期值不为空
      expect(component.messageList.length).not.toBe(0);

      // 初期化后画面消息的长度被设定为2
      let messageListLength = component.messageList.length;

      // 模拟调用后台，设置返回值
      const sendSingleMessageSpy = jest.spyOn(service, 'sendSingleMessage').mockResolvedValue(tempRes);

      // 验证函数没有被调用
      expect(sendSingleMessageSpy).not.toHaveBeenCalled();

      // 直接调用
      await service.sendSingleMessage(tempReq).then(async res => {
        console.log(res);

        // 验证函数被调用的次数
        expect(sendSingleMessageSpy).toHaveBeenCalledTimes(1);
      });

      // 模拟按下Send按钮
      await component.send().then(() => {
        // 发送消息后并获得回复后，长度+2
        expect(component.messageList.length).toBe(messageListLength + 2);

        // 验证函数已经被调用
        expect(sendSingleMessageSpy).toHaveBeenCalled();
        expect(scrollToBottomSpy).toHaveBeenCalled();
  
        // 验证函数被调用的次数
        expect(sendSingleMessageSpy).toHaveBeenCalledTimes(2);

        // 验证函数被特定参数调用
        expect(sendSingleMessageSpy).toHaveBeenCalledWith(tempReq);

        // 还原
        scrollToBottomSpy.mockRestore();
        sendSingleMessageSpy.mockRestore();
      });
    });
  });
});

describe('Test0002Component Dom', () => {
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

  it('测试 Dom', () => {
    // 找到画面的按钮
    const button = fixture.nativeElement.querySelector('button');
    const sendSpy = jest.spyOn(component, 'send');
    // 按钮按下
    button.click();
    // 验证函数已经被调用
    expect(sendSpy).toHaveBeenCalled();
  });

  it('测试 初期化是否正确 1', async () => {
  
    // 创建一个被监视的函数 test0002Service.getData
    const spy = jest.spyOn(component, 'getData');

    // 验证函数没有被调用
    expect(spy).not.toHaveBeenCalled();
  
    // 调用test0002Service的add方法
    console.log('----------------------------');
    await component.getData();

    // 验证函数已经被调用
    expect(spy).toHaveBeenCalled();
  
    // 验证函数被调用的次数
    expect(spy).toHaveBeenCalledTimes(1);

    // 验证函数被特定参数调用
    expect(spy).toHaveBeenCalledWith();

    // 验证函数的返回值是否正确
    expect(component.userNm).toBe('');
  });

  it('测试 初期化是否正确 2', () => {
  
    // 创建一个被监视的函数 test0002Service.getData
    const spy = jest.spyOn(component, 'getData1');

    // 验证函数没有被调用
    expect(spy).not.toHaveBeenCalled();
  
    // 调用test0002Service的add方法
    component.getData1();

    // 验证函数已经被调用
    expect(spy).toHaveBeenCalled();
  
    // 验证函数被调用的次数
    expect(spy).toHaveBeenCalledTimes(1);

    // 验证函数被特定参数调用
    expect(spy).toHaveBeenCalledWith();

    jest.mock('./test0002.component.ts', () => {
      return {
        getData1: jest.fn(() => 'bbb')
      }
    });

    component.getData1();

    // 验证函数的返回值是否正确
    expect(component.sendInput).toBe('aaa');
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