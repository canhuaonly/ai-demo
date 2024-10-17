import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Test0005Component } from "./test0005.component";
import { Test0005Service } from "./test0005.component.api";
import { of } from "rxjs";

describe('测试画面: 0005', () => {
  let component: Test0005Component;
  let fixture: ComponentFixture<Test0005Component>;
  let service: Test0005Service;
  // let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0005Component, HttpClientTestingModule],
      providers: [Test0005Service],
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(Test0005Service);
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(service).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('测试 初期化 正常场合1', async () => {

    // 模拟调用后台，设置返回值
    const getUserSpy = jest.spyOn(service, 'getUser').mockImplementation(() => {return of([{id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}])});
    const getContactsListSpy = jest.spyOn(service, 'getContacts').mockImplementation(() => {
      return of([
        { id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0' }
      ])
    });

    // 函数没有被调用
    expect(getUserSpy).not.toHaveBeenCalled();
    expect(getContactsListSpy).not.toHaveBeenCalled();

    // 初期化方法执行
    return component.getData().then(() => {
      // 函数被调用
      expect(getUserSpy).toHaveBeenCalled();
      expect(getContactsListSpy).toHaveBeenCalled();

      // 函数被调用1次
      expect(getUserSpy).toHaveBeenCalledTimes(1);
      expect(getContactsListSpy).toHaveBeenCalledTimes(1);

      // expect(component.userNm1).toBe('aaa')

      // 更新视图
      fixture.detectChanges();

      /* ==================== 当前用户 ==================== */
      // 找到显示User的组件
      const userNmDiv = fixture.nativeElement.querySelector('#userNm');

      // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
      expect(userNmDiv.innerHTML.indexOf('xxx4')).not.toBe(-1);
      
      /* ==================== 联系人列表 ==================== */
      // 找到显示联系人列表的组件
      const contactsListDiv = fixture.nativeElement.querySelector('#contactsList');

      // 子元素的个数等于当前mock返回值的数量(新增会话按钮1+模拟返回值1 = 2)
      expect(contactsListDiv.childElementCount).toBe(2);

      // 测试子元素的内容是否正确
      // 获取子元素的子元素的第一个，第二个等，然后进行验证
      expect(contactsListDiv.children[1].children[0].children[1].children[0].innerHTML).toContain('xxxNm');
      expect(contactsListDiv.children[1].children[0].children[1].children[1].innerHTML).toContain('hello');

      /* ==================== 聊天消息 ==================== */
      // 找到显示聊天消息的组件
      const contactDiv = fixture.nativeElement.querySelector('#contentContainer');
      expect(contactDiv.innerHTML).toContain('开始聊天');

      // 还原mock之前的状态
      getUserSpy.mockRestore();
      getContactsListSpy.mockRestore();
    });
  });

  it('测试 点击左侧会话列表 按下', async () => {

    // 模拟调用后台，设置返回值
    const getUserSpy = jest.spyOn(service, 'getUser').mockImplementation(() => {return of([{id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}])});
    const getContactsListSpy = jest.spyOn(service, 'getContacts').mockImplementation(() => {
      return of([
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0'},
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm2', last_msg: 'helloEveryOne', del_flg: '0'},
      ])
    });
    const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockImplementation(() => {
      return of([
        {chat_id: 'chatId1', message_q: 'q1', message_a: 'a1', del_flg: '0'},
        {chat_id: 'chatId2', message_q: 'q2', message_a: 'a2', del_flg: '0'},
      ])
    });

    // 初期化方法执行
    return component.getData().then(() => {

      // 调用切换方法
      component.changeTab(0);

      // 更新视图
      fixture.detectChanges();

      // 函数被调用
      expect(getMessageListSpy).toHaveBeenCalled();

      // 函数被调用1次
      expect(getMessageListSpy).toHaveBeenCalledTimes(1);

      // 找到显示聊天消息的组件
      const messageListDiv = fixture.nativeElement.querySelector('#messageList');

      // 子元素的个数等于当前mock返回值的数量
      expect(messageListDiv.childElementCount).toBe(4);

      // 测试子元素(问)的内容是否正确
      expect(messageListDiv.children[0].innerHTML.indexOf('q1')).not.toBe(-1);
      // 测试子元素(答)的内容是否正确
      expect(messageListDiv.children[1].innerHTML.indexOf('a1')).not.toBe(-1);

      // 选择的会话窗口
      const current_contact = fixture.nativeElement.querySelector('#contactNm0');

      current_contact.contentEditable = 'true'
      // 调用切换方法
      component.changeTab(1);

      // 更新视图
      fixture.detectChanges();

      // 子元素的个数等于当前mock返回值的数量
      expect(messageListDiv.childElementCount).toBe(4);

      // 测试子元素(问)的内容是否正确
      expect(messageListDiv.children[0].innerHTML.indexOf('q1')).not.toBe(-1);
      // 测试子元素(答)的内容是否正确
      expect(messageListDiv.children[1].innerHTML.indexOf('a1')).not.toBe(-1);

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

    // 按钮按下x1
    button.click();
      
    // 更新视图
    fixture.detectChanges();

    // 找到显示联系人列表的组件
    const contactsListDiv = fixture.nativeElement.querySelector('#contactsList');

    // 子元素的个数等于当前mock返回值的数量(新增会话按钮1+按钮按下新增1 = 2)
    expect(contactsListDiv.childElementCount).toBe(2);

    // 验证调用次数
    expect(component.contactsList.length).toBe(1);

    // 找到html的div
    const chats = fixture.nativeElement.querySelector('#contactsList');

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
    expect(chats.children[1].innerHTML.indexOf('点击开始聊天')).not.toBe(-1);

    // 按钮按下x2
    button.click();

    // 更新视图
    fixture.detectChanges();

    // 子元素的个数等于当前创建的chats的数量
    expect(chats.childElementCount).toBe(2);
    expect(chats.children[1].childElementCount).toBe(2);

    // 测试按钮按下后画面发生变化，追加出的内容是否包含mock的返回值内容
    expect(chats.children[1].innerHTML.indexOf('点击开始聊天')).not.toBe(-1);
  });

  it('测试 发送消息 正常场合1', async () => {

    // // 模拟调用后台，设置返回值
    // const getUserSpy = jest.spyOn(service, 'getUser').mockImplementation(() => {return of([{id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}])});
    // const getContactsListSpy = jest.spyOn(service, 'getContacts').mockImplementation(() => {
    //   return of([
    //     {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0'},
    //     {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm2', last_msg: 'helloEveryOne', del_flg: '0'},
    //   ])
    // });
    // const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockImplementation(() => {
    //   return of([
    //     {chat_id: 'chatId1', message_q: 'q1', message_a: 'a1', del_flg: '0'},
    //     {chat_id: 'chatId2', message_q: 'q2', message_a: 'a2', del_flg: '0'},
    //   ])
    // });

    // // 初期化方法执行
    // return component.getData().then(() => {

    //   // 调用切换方法
    //   component.changeTab(0);

    //   // 更新视图
    //   fixture.detectChanges();

    //   // 要传递的参数
    //   const sendInput = '你会说英文吗';

    //   // 模拟调用Send按钮的参数
    //   const tempReq: HttpParam = {user: 'userx', data: sendInput, chat_id: 'xxx'}

    //   const resp_message_a = '是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。'

      // const mockResponse1: Response = {
      //   body: JSON.stringify(tempReq), // must match 'Content-Type' header
      //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //   credentials: 'same-origin', // include, same-origin, *omit
      //   headers: new Headers(),
      //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
      //   mode: 'cors', // no-cors, cors, *same-origin
      //   redirect: 'follow', // manual, *follow, error
      //   referrer: 'no-referrer', // *client, no-referrer
      // }

      // const resp = new Response(JSON.stringify(tempReq), {headers: { 'Content-Type': 'application/json' }})

      // const mockJsonPromise = Promise.resolve({ name: 'test' });
      // // const mockResponse = { json: () => mockJsonPromise };
      // const mockResponse: Response = {
      //   json: () => Promise.resolve({ name: 'test' }),
      //   bodyUsed: false,
      //   headers: new Headers(),
      //   ok: true,
      //   redirected: false,
      //   status: 200,
      //   statusText: 'OK',
      //   type: 'basic',
      //   url: 'http://localhost:4200/api/cosmos_api/test0005/send_message_stream',
      //   clone() {
      //     return this;
      //   },
      //   body: null, // 或者是一个合适的值
      //   arrayBuffer() {return new Promise<ArrayBuffer>(this.json)}, // 或者是一个合适的值
      //   blob() {return new Promise<Blob>(this.json)}, // 或者是一个合适的值
      //   formData() {return new Promise<FormData>(this.json)}, // 或者是一个合适的值
      //   text() {return new Promise<string>(this.json)}, // 或者是一个合适的值
      // };

      // const myBlob = new Blob();
      // const init = { status: 200, statusText: "SuperSmashingGreat!" };
      // const myResponse = new Response(myBlob, init);

      // // 模拟调用后台，设置返回值
      // jest.spyOn(service, 'sendMessageStream').mockImplementation(() => {
      //   // const resp = new Response('4')
      //   return Promise.resolve(myResponse)
      // });
      

      // const resp = new Response('{data: "xxxx"}')
      // console.log(resp)

      
      // // 模拟调用后台，设置返回值
      // jest.spyOn(service, 'sendMessageStream').mockImplementation(() => {
      //   // const resp = new Response('4')
      //   return Promise.resolve(resp)
      // });

      // service.sendMessageStream(tempReq).then(response => {

      //   console.log(response)

      // })
      // console.log(myResponse)

      // service.sendMessageStream(tempReq).then(response => {

      //   console.log(response)
      //   console.log(response.text())

      //   response.text().then(value => {
      //     console.log(value)
      //   })
      // })

      // 模拟Send按钮的返回值
      // const tempRes: SendSingleMessage = {
      //   status: '666', 
      //   entity: {chat_id: 'xxx', message_q: sendInput, message_a: resp_message_a, del_flg: '0'} }
      
      // const sendSpy = jest.spyOn(component, 'temp_send');
      // expect(sendSpy).not.toHaveBeenCalled();

      // // 函数未被调用
      // expect(sendSingleMessageSpy).not.toHaveBeenCalled();

      // // 找到发送消息的输入框
      // const sendInputText = fixture.nativeElement.querySelector('#sendInput');

      // // 找到画面的发送按钮
      // const sendBtn = fixture.nativeElement.querySelector('#temp_send');

      // // 设置要发送的消息
      // sendInputText.value = sendInput;
      // sendBtn.disabled = false

      // // 按钮按下
      // sendBtn.click();
      // expect(sendSpy).toHaveBeenCalled();

      // // 函数被调用
      // expect(sendSingleMessageSpy).toHaveBeenCalled();

      // // 函数被mock的参数调用
      // expect(sendSingleMessageSpy).toHaveBeenCalledWith(tempReq)
      // expect(sendSingleMessageSpy).toBeNaN();
      // expect(sendSingleMessageSpy).not.toBeNaN();

      // // 当前要修改的会话
      // const current_edit_chat = fixture.nativeElement.querySelector('#contact0');

      // // 更新视图
      // fixture.detectChanges();

      // // 验证发送消息后左侧聊天列表的最近聊天记录是否会被更新
      // expect(current_edit_chat.innerHTML).toContain(resp_message_a);

      // // 验证函数已经被调用
      // expect(sendSingleMessageSpy).toHaveBeenCalled();

      // // 验证函数被调用的次数
      // expect(sendSingleMessageSpy).toHaveBeenCalledTimes(1);

      // // 验证函数被特定参数调用
      // expect(sendSingleMessageSpy).toHaveBeenCalledWith(tempReq);

      // // 找到显示聊天消息的组件
      // const messageListDiv = fixture.nativeElement.querySelector('#messageList');

      // // 子元素的个数等于当前mock返回值的数量
      // expect(messageListDiv.childElementCount).toBe(6);

      // // 测试子元素(问)的内容是否正确
      // expect(messageListDiv.children[4].innerHTML.indexOf('英文')).not.toBe(-1);
      // // 测试子元素(答)的内容是否正确
      // expect(messageListDiv.children[5].innerHTML.indexOf('英文')).not.toBe(-1);

      // // 还原mock之前的状态
      // getUserSpy.mockRestore();
      // getContactsListSpy.mockRestore();
      // getMessageListSpy.mockRestore();
    });
  });

  it('测试 发送消息 异常场合1', async () => {

  //   // 模拟调用后台，设置返回值
  //   const getUserSpy = jest.spyOn(service, 'getUser').mockImplementation(() => {return of([{id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}])});
  //   const getContactsListSpy = jest.spyOn(service, 'getContacts').mockImplementation(() => {
  //     return of([
  //       {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0'},
  //       {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm2', last_msg: 'helloEveryOne', del_flg: '0'},
  //     ])
  //   });
  //   const getMessageListSpy = jest.spyOn(service, 'getMessageList').mockImplementation(() => {
  //     return of([
  //       {chat_id: 'chatId1', message_q: 'q1', message_a: 'a1', del_flg: '0'},
  //       {chat_id: 'chatId2', message_q: 'q2', message_a: 'a2', del_flg: '0'},
  //     ])
  //   });

  //   // 初期化方法执行
  //   return component.getData().then(() => {

  //     // 调用切换方法
  //     component.changeTab(0);

  //     // 更新视图
  //     fixture.detectChanges();

  //     // 要传递的参数
  //     const sendInput = 'テスト';

  //     // 模拟调用Send按钮的参数
  //     // const tempReq: HttpParam = {user: 'userx', data: sendInput, chatId: 'xxx'}

  //     // 模拟Send按钮的返回值
  //     const tempRes: SingleMessage = { status: '666', entity: {chatId: 'xxx', message_q: sendInput, message_a: '是的，我会说英文。除了中文，我也可以为您提供英文交流的服务。'} }
      
  //     // 模拟调用后台，设置返回值
  //     const sendSingleMessageSpy = jest.spyOn(service, 'sendSingleMessage').mockImplementation(() => { return of(tempRes) });
      
  //     const sendSpy = jest.spyOn(component, 'send');
  //     expect(sendSpy).not.toHaveBeenCalled();

  //     // 函数未被调用
  //     expect(sendSingleMessageSpy).not.toHaveBeenCalled();

  //     // 找到发送消息的输入框
  //     const sendInputText = fixture.nativeElement.querySelector('#sendInput');

  //     // 找到画面的发送按钮
  //     const sendBtn = fixture.nativeElement.querySelector('#send');

  //     // 设置要发送的消息
  //     sendInputText.value = sendInput;
  //     sendBtn.disabled = false

  //     // 按钮按下
  //     sendBtn.click();
  //     expect(sendSpy).toHaveBeenCalled();

  //     // 更新视图
  //     fixture.detectChanges();

  //     // 验证函数没有被调用
  //     expect(sendSingleMessageSpy).not.toHaveBeenCalled();

  //     // 找到显示聊天消息的组件
  //     const messageListDiv = fixture.nativeElement.querySelector('#messageList');

  //     // 子元素的个数等于当前mock返回值的数量
  //     expect(messageListDiv.childElementCount).toBe(4);

  //     // 还原mock之前的状态
  //     getUserSpy.mockRestore();
  //     getContactsListSpy.mockRestore();
  //     getMessageListSpy.mockRestore();
  //   });
  // });
});

describe('画面 Test0005 修改会话名称', () => {

  let component: Test0005Component;
  let fixture: ComponentFixture<Test0005Component>;
  let service: Test0005Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test0005Component, HttpClientTestingModule],
      providers: [Test0005Service],
    })
    .compileComponents();
    
    // 创建组件实例
    fixture = TestBed.createComponent(Test0005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(Test0005Service);
  });

  it('测试 创建组件实例 是否成功', () => {
    expect(service).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('测试 修改会话名称 正确场合1', () => {

    // 模拟调用后台，设置返回值
    const editContactNmSpy = jest.spyOn(component, 'editContactNm')
    jest.spyOn(service, 'getUser').mockImplementation(() => {
      return of([
        {id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}
      ])
    });
    jest.spyOn(service, 'getContacts').mockImplementation(() => {
      return of([
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0'},
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm2', last_msg: 'helloEveryOne', del_flg: '0'},
      ])
    });
    jest.spyOn(service, 'getMessageList').mockImplementation(() => {
      return of([
        {chat_id: 'chatId1', message_q: 'q1', message_a: 'a1', del_flg: '0'},
        {chat_id: 'chatId2', message_q: 'q2', message_a: 'a2', del_flg: '0'},
      ])
    });
    const updateContactNmSpy = jest.spyOn(service, 'updateContactNm').mockImplementation(() => {
      return of(
        {
          status: '666', 
          entity: {id: 'xxx1', user_id: 'xxx2', contact_nm: 'xxx3', last_msg: 'xxx4', del_flg: '0'}
        }
      )
    });

    // 初期化方法执行
    return component.getData().then(() => {

      // 更新视图
      fixture.detectChanges();

      // 当前要修改的会话
      const current_edit_chat = fixture.nativeElement.querySelector('#contactNm0');

      //设置不可编辑
      current_edit_chat.contentEditable = 'false'

      // 方法调用
      component.editContactNm(0);

      // 更新视图
      fixture.detectChanges();

      expect(current_edit_chat.contentEditable).toBe('true');

      // 找到html的div
      const contactsList = fixture.nativeElement.querySelector('#contactsList');

      // 更新当前会话名称
      current_edit_chat.innerHTML = '测试修改';

      // 更新视图
      fixture.detectChanges();

      // 测试子元素的内容是否正确
      expect(contactsList.children[1].innerHTML).toContain('测试修改');

      //设置可编辑
      // current_edit_chat.contentEditable = 'false'

      // 方法调用
      component.editContactNm(0);

      // 更新视图
      fixture.detectChanges();

      expect(current_edit_chat.contentEditable).toBe('false');

      // 当前要修改的会话
      const current_edit_chat1 = fixture.nativeElement.querySelector('#contactNm0');

      expect(current_edit_chat1.innerHTML).toBe('测试修改');

      expect(component.current_contact_nm).toBe('xxx3');

      expect(updateContactNmSpy).toHaveBeenCalled();
      // 判断调用的参数
      expect(editContactNmSpy).toHaveBeenCalledWith(0);

    });


    // const contactsList = fixture.nativeElement.querySelector('#contactsList');


    // const button = fixture.nativeElement.querySelector('#newChats');

    // const cancelSpy = jest.spyOn(component, 'newChats');

    // // const editContactNmSpy = jest.spyOn(component, 'editContactNm');

    // // 按钮按下x1
    // button.click();
    // // 验证函数已经被调用
    // expect(cancelSpy).toHaveBeenCalled();

    // // 更新视图
    // fixture.detectChanges();

    // // 找到html的div
    // const chats = fixture.nativeElement.querySelector('#contactsList');

    // // 子元素的个数等于当前创建的chats的数量(固定1+新增的1 = 2)
    // expect(chats.childElementCount).toBe(2);

    // // 测试子元素的内容是否正确
    // // 获取子元素的子元素的第一个，第二个等，然后进行验证
    // expect(chats.children[1].children[1].innerHTML).toContain('点击开始聊天')

    // // 新增的会话
    // // const current_contact = fixture.nativeElement.querySelector('#contactNm0');

    // // 新增的会话
    // const current_edit_btn = fixture.nativeElement.querySelector('#contactEe0');
    // current_edit_btn.dispatchEvent(new Event('blur'));

    // 更新视图
    // fixture.detectChanges();


    // 验证函数已经被调用
    // expect(editContactNmSpy).toHaveBeenCalled();
    
  });

  it('测试 修改会话名称 异常场合1', () => {

    // 模拟调用后台，设置返回值
    // const editContactNmSpy = jest.spyOn(component, 'editContactNm')
    jest.spyOn(service, 'getUser').mockImplementation(() => {
      return of([
        {id: 'xxx1', userId: 'xxx2', userCd: 'xxx3', userNm: 'xxx4', partitionKey: 'xxx5', delFlg: '0'}
      ])
    });
    jest.spyOn(service, 'getContacts').mockImplementation(() => {
      return of([
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm', last_msg: 'hello', del_flg: '0'},
        {id: 'xxx', user_id: 'userx', contact_nm: 'xxxNm2', last_msg: 'helloEveryOne', del_flg: '0'},
      ])
    });
    jest.spyOn(service, 'getMessageList').mockImplementation(() => {
      return of([
        {chat_id: 'chatId1', message_q: 'q1', message_a: 'a1', del_flg: '0'},
        {chat_id: 'chatId2', message_q: 'q2', message_a: 'a2', del_flg: '0'},
      ])
    });
    const updateContactNmSpy = jest.spyOn(service, 'updateContactNm').mockImplementation(() => {
      return of(
        {
          status: '888', 
          entity: {id: 'xxx1', user_id: 'xxx2', contact_nm: 'xxx3', last_msg: 'xxx4', del_flg: '0'}
        }
      )
    });

    // 初期化方法执行
    return component.getData().then(() => {

      // 更新视图
      fixture.detectChanges();

      // 当前要修改的会话
      const current_edit_chat = fixture.nativeElement.querySelector('#contactNm0');

      //设置不可编辑
      current_edit_chat.contentEditable = 'true'

      // 方法调用
      component.editContactNm(0);

      // 更新视图
      fixture.detectChanges();

      expect(current_edit_chat.contentEditable).toBe('false');
      expect(component.contactsList[0].contact_nm).toBe(current_edit_chat.innerHTML);
      expect(updateContactNmSpy).toHaveBeenCalled();
      expect(updateContactNmSpy).toHaveBeenCalledWith({"chat_id": "xxx", "data": undefined, "user": "userx"})
    });
    
  });

  it('测试 初期化值 是否正确', () => {


  });
})