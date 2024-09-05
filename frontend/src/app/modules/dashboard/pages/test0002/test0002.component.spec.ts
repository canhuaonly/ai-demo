import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Test0002Component } from './test0002.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageContent, SingleMessage, Test0002Service } from "./test0002.component.api";
import  '../../../../../jestGlobalMocks';
// const test0002Service = require('./test0002.component.api')

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
    const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockResolvedValue(
      [
        {
          user_cd: 'User1',
          user_nm: 'Wang',
          message_order: 0,
          message: 'aaa',
          wenxin_id: 0,
        }, 
        {
          user_cd: 'User2',
          user_nm: 'Wang',
          message_order: 0,
          message: 'bbb',
          wenxin_id: 0,
        },

      ]
    );

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
    const sendInput = 'Hello';
    component.sendInput = sendInput;

    // 模拟调用Send按钮的参数
    const tempReq = {
      user_cd: 'user',
      user_nm: 'Wang',
      message_order: 3,
      message: sendInput,
      wenxin_id: 0,
    }

    // 模拟Send按钮的返回值
    const tempRes = {
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
    jest.spyOn(service, 'getMessageList').mockResolvedValue(
      [
        {
          user_cd: 'User1',
          user_nm: 'Wang',
          message_order: 0,
          message: 'aaa',
          wenxin_id: 0,
        }, 
        {
          user_cd: 'User2',
          user_nm: 'Wang',
          message_order: 0,
          message: 'bbb',
          wenxin_id: 0,
        },
      ]
    );
    
    const scrollToBottomSpy = jest.spyOn(component, 'scrollToBottom');

    await component.getData().then(async () => {

      // 验证函数调用后初期值不为空
      expect(component.messageList.length).not.toBe(0);

      // 初期化后画面消息的长度被设定为2
      const messageListLength = component.messageList.length;

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
  let service: Test0002Service;
  // let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0002Component, HttpClientTestingModule],
      providers: [Test0002Service],
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(Test0002Service);
  });

  it('测试 Dom', () => {
    
    expect(component.contactsList.length).toBe(0);

    // 找到画面的按钮
    const button = fixture.nativeElement.querySelector('#newChats');

    // 监听函数
    const cancelSpy = jest.spyOn(component, 'newChats');
    const createNewChatsSpy = jest.spyOn(service, 'createNewChats')
      // 第一次调用的返回值
      .mockReturnValueOnce({"user_session_aka": "Jest Dom测试", "message": "这是一条Jest的Dom测试内容"})
      // 第二次调用的返回值
      .mockReturnValueOnce({"user_session_aka": "xxxxx", "message": "yyyyy"});
      
    // 按钮按下x1
    button.click();

    // 验证函数已经被调用
    expect(cancelSpy).toHaveBeenCalled();
    expect(createNewChatsSpy).toHaveBeenCalled();

    // 验证调用次数
    expect(component.contactsList.length).toBe(1);

    // 更新视图
    fixture.detectChanges();

    // 找到html的div
    const chats = fixture.nativeElement.querySelector('#contactsList');

    // 子元素的个数等于当前创建的chats的数量
    expect(chats.childElementCount).toBe(1);

    console.log(chats.children);

    // 测试子元素的内容是否正确
    // 获取子元素的子元素的第一个，第二个等，然后进行验证
    expect(chats.children[0].children[1].children[0].innerHTML).toBe('Jest Dom测试');
    expect(chats.children[0].children[1].children[1].innerHTML).toBe('这是一条Jest的Dom测试内容');

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
    expect(chats.children[0].innerHTML.indexOf('测试')).not.toBe(-1);

    // 按钮按下x2
    button.click();

    // createNewChatsSpy.mockClear();
    // createNewChatsSpy.mockRestore();
    // expect(createNewChatsSpy).toHaveBeenCalled();

    // 更新视图
    fixture.detectChanges();

    // 子元素的个数等于当前创建的chats的数量
    expect(chats.childElementCount).toBe(2);

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock内容
    expect(chats.children[1].innerHTML.indexOf('x')).not.toBe(-1);
    expect(chats.children[1].innerHTML.indexOf('y')).not.toBe(-1);
    
  });
});

describe('DOM操作测试', () => {
  it('应该能够创建一个元素并添加到body中', async () => {
    // 创建一个新元素
    const newElement = document.createElement('div');
    newElement.textContent = 'Hello, world!';

    // 将新元素添加到body中
    document.body.appendChild(newElement);

    // 验证元素是否被正确添加
    expect(document.body.textContent).toContain('Hello, world!');

    // 等待数据加载完成
    // await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('Temp', done => {
    const mockFn = jest.fn((scalar: number) => 42 + scalar);

    mockFn(0); // 42
    mockFn(1); // 43
    expect(mockFn(0)).toBe(42);
    expect(mockFn(1)).toBe(43);

    mockFn.mockImplementation(scalar => 36 + scalar);

    mockFn(2); // 38
    mockFn(3); // 39
    expect(mockFn(2)).toBe(38);
    expect(mockFn(3)).toBe(39);

    try {
      // 测试异步
      done();
    } catch(error) {
      // done(error)
      console.log(error)
    }
  });
});


/* ============================== Test Component Dom ============================== */
describe('测试画面: 0002', () => {
  let component: Test0002Component;
  let fixture: ComponentFixture<Test0002Component>;
  let service: Test0002Service;
  // let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0002Component, HttpClientTestingModule],
      providers: [Test0002Service],
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(Test0002Service);
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(service).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('测试 初期化 正常场合1', async () => {

    // 模拟调用后台，设置返回值
    const getUserSpy = jest.spyOn(service, 'getUser').mockResolvedValue([{user_nm: 'User01'}]);
    const getContactsListSpy = jest.spyOn(service, 'getContactsList').mockResolvedValue([{user_session_aka: 'Jest Dom测试', message: '这是一条Jest的Dom测试内容'}]);
    const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockResolvedValue([
      { user_cd: "user", user_nm: "Wang", message: "你会说英文吗", wenxin_id: 34, message_order: 21 },
      { user_cd: "assistant", user_nm: "文心一言", message: "是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。", wenxin_id: 35, message_order: 22 }
    ]);

    // 函数没有被调用
    expect(getUserSpy).not.toHaveBeenCalled();
    expect(getContactsListSpy).not.toHaveBeenCalled();
    expect(getMessageListSpy).not.toHaveBeenCalled();

    // 初期化方法执行
    return component.getData().then(() => {
      // 函数被调用
      expect(getUserSpy).toHaveBeenCalled();
      expect(getContactsListSpy).toHaveBeenCalled();
      expect(getMessageListSpy).toHaveBeenCalled();

      // 函数被调用1次
      expect(getUserSpy).toHaveBeenCalledTimes(1);
      expect(getContactsListSpy).toHaveBeenCalledTimes(1);
      expect(getMessageListSpy).toHaveBeenCalledTimes(1);

      // 更新视图
      fixture.detectChanges();

      /* ==================== 当前用户 ==================== */
      // 找到显示User的组件
      const userNmDiv = fixture.nativeElement.querySelector('#userNm');

      // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
      expect(userNmDiv.innerHTML.indexOf('User01')).not.toBe(-1);
      
      /* ==================== 联系人列表 ==================== */
      // 找到显示联系人列表的组件
      const contactsListDiv = fixture.nativeElement.querySelector('#contactsList');

      // 子元素的个数等于当前mock返回值的数量
      expect(contactsListDiv.childElementCount).toBe(1);

      // 测试子元素的内容是否正确
      // 获取子元素的子元素的第一个，第二个等，然后进行验证
      expect(contactsListDiv.children[0].children[1].children[0].innerHTML).toBe('Jest Dom测试');
      expect(contactsListDiv.children[0].children[1].children[1].innerHTML).toBe('这是一条Jest的Dom测试内容');

      // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
      expect(contactsListDiv.children[0].innerHTML.indexOf('测试')).not.toBe(-1);
      
      /* ==================== 聊天消息 ==================== */
      // 找到显示聊天消息的组件
      const messageListDiv = fixture.nativeElement.querySelector('#messageList');

      // 子元素的个数等于当前mock返回值的数量
      expect(messageListDiv.childElementCount).toBe(2);

      // 测试子元素(问)的内容是否正确
      expect(messageListDiv.children[0].innerHTML.indexOf('英文')).not.toBe(-1);
      // 测试子元素(答)的内容是否正确
      expect(messageListDiv.children[1].innerHTML.indexOf('英文')).not.toBe(-1);

      // 还原mock之前的状态
      getUserSpy.mockRestore();
      getContactsListSpy.mockRestore();
      getMessageListSpy.mockRestore();
    });
  });

  it('测试 创建新的聊天 正常场合1', async () => {

    // 没有执行初期化方法，默认为0
    expect(component.contactsList.length).toBe(0);

    // 找到画面的按钮
    const button = fixture.nativeElement.querySelector('#newChats');

    // 监听函数
    const cancelSpy = jest.spyOn(component, 'newChats');
    const createNewChatsSpy = jest.spyOn(service, 'createNewChats')
      // 第一次调用的返回值
      .mockReturnValueOnce({"user_session_aka": "Jest Dom测试", "message": "这是一条Jest的Dom测试内容"})
      // 第二次调用的返回值
      .mockReturnValueOnce({"user_session_aka": "xxxxx", "message": "yyyyy"});
      
    // 按钮按下x1
    button.click();

    // 验证函数已经被调用
    expect(cancelSpy).toHaveBeenCalled();
    expect(createNewChatsSpy).toHaveBeenCalled();

    // 验证调用次数
    expect(component.contactsList.length).toBe(1);

    // 更新视图
    fixture.detectChanges();

    // 找到html的div
    const chats = fixture.nativeElement.querySelector('#contactsList');

    // 子元素的个数等于当前创建的chats的数量
    expect(chats.childElementCount).toBe(1);

    // 测试子元素的内容是否正确
    // 获取子元素的子元素的第一个，第二个等，然后进行验证
    expect(chats.children[0].children[1].children[0].innerHTML).toBe('Jest Dom测试');
    expect(chats.children[0].children[1].children[1].innerHTML).toBe('这是一条Jest的Dom测试内容');

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
    expect(chats.children[0].innerHTML.indexOf('测试')).not.toBe(-1);

    // 按钮按下x2
    button.click();

    // 更新视图
    fixture.detectChanges();

    // 子元素的个数等于当前创建的chats的数量
    expect(chats.childElementCount).toBe(2);

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock内容
    expect(chats.children[0].innerHTML.indexOf('x')).not.toBe(-1);
    expect(chats.children[0].innerHTML.indexOf('y')).not.toBe(-1);
    expect(chats.children[0].children[1].children[0].innerHTML).toBe('xxxxx');
    expect(chats.children[0].children[1].children[1].innerHTML).toBe('yyyyy');

    // 还原mock之前的状态
    cancelSpy.mockRestore();
    createNewChatsSpy.mockRestore();
  });

  it('测试 发送消息 正常场合1', async () => {

    // 要传递的参数
    const sendInput = '你会说英文吗';

    // 模拟调用Send按钮的参数
    const tempReq: MessageContent = { user_cd: 'user', user_nm: 'Wang', message_order: 3, message: sendInput, wenxin_id: 0 }

    // 模拟聊天内容
    const messageList: Array<MessageContent> = [
      tempReq,
      // { user_cd: "user", user_nm: "Wang", message: "你会说英文吗", wenxin_id: 34, message_order: 21 },
      { user_cd: "assistant", user_nm: "文心一言", message: "是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。", wenxin_id: 35, message_order: 22 }
    ]

    // 模拟Send按钮的返回值
    const tempRes: SingleMessage = { status: '666', entity: messageList }
    
    // 模拟调用后台，设置返回值
    const sendSingleMessageSpy = jest.spyOn(service, 'sendSingleMessage').mockResolvedValue(tempRes);

    // 函数未被调用
    expect(sendSingleMessageSpy).not.toHaveBeenCalled();

    // 找到发送消息的输入框
    const sendInputText = fixture.nativeElement.querySelector('#sendInput');
    // 设置要发送的消息
    sendInputText.value = sendInput;

    // 找到画面的按钮
    const sendBtn = fixture.nativeElement.querySelector('#send');

    // 按钮按下
    sendBtn.click();

    // 更新视图
    fixture.detectChanges();

    // 验证函数已经被调用
    expect(sendSingleMessageSpy).toHaveBeenCalled();

    // 验证函数被调用的次数
    expect(sendSingleMessageSpy).toHaveBeenCalledTimes(1);

    // 验证函数被特定参数调用
    expect(sendSingleMessageSpy).toHaveBeenCalledWith(tempReq);

    // 找到显示聊天消息的组件
    const messageListDiv = fixture.nativeElement.querySelector('#messageList');

    // 子元素的个数等于当前mock返回值的数量
    expect(messageListDiv.childElementCount).toBe(2);

    // 测试子元素(问)的内容是否正确
    expect(messageListDiv.children[0].innerHTML.indexOf('英文')).not.toBe(-1);
    // 测试子元素(答)的内容是否正确
    expect(messageListDiv.children[1].innerHTML.indexOf('英文')).not.toBe(-1);
  });

  it('测试 发送消息 异常场合1', async () => {

    // 要传递的参数
    const sendInput = 'テスト';

    // 模拟调用Send按钮的参数
    const tempReq: MessageContent = { user_cd: 'user', user_nm: 'Wang', message_order: 3, message: sendInput, wenxin_id: 0 }

    // 模拟聊天内容
    const messageList: Array<MessageContent> = [
      tempReq,
      // { user_cd: "user", user_nm: "Wang", message: "你会说英文吗", wenxin_id: 34, message_order: 21 },
      { user_cd: "assistant", user_nm: "文心一言", message: "是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。", wenxin_id: 35, message_order: 22 }
    ]

    // 模拟Send按钮的返回值
    const tempRes: SingleMessage = { status: '666', entity: messageList }
    
    // 模拟调用后台，设置返回值
    const sendSingleMessageSpy = jest.spyOn(service, 'sendSingleMessage').mockResolvedValue(tempRes);

    // 函数未被调用
    expect(sendSingleMessageSpy).not.toHaveBeenCalled();

    // 找到发送消息的输入框
    const sendInputText = fixture.nativeElement.querySelector('#sendInput');
    // 设置要发送的消息
    sendInputText.value = sendInput;

    // 找到画面的按钮
    const sendBtn = fixture.nativeElement.querySelector('#send');

    // 按钮按下
    sendBtn.click();

    // 更新视图
    fixture.detectChanges();

    // 验证函数已经没有被调用
    expect(sendSingleMessageSpy).not.toHaveBeenCalled();

    // 验证函数被调用的次数
    expect(sendSingleMessageSpy).toHaveBeenCalledTimes(0);

    // 找到显示聊天消息的组件
    const messageListDiv = fixture.nativeElement.querySelector('#messageList');

    // 异常场合，没有返回值，子元素数量为0
    expect(messageListDiv.childElementCount).toBe(0);
  });

});