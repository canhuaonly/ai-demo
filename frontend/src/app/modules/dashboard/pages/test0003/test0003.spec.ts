// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AqviewService } from './aqview.api'
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { AqviewComponent } from './aqview.component';
// import { of } from 'rxjs';

// // 模拟服务
// class AqviewServiceMock {
//   // 模拟getQaListApi方法，返回一个Observable
//   // 这里用of来模拟成功的响应
//   getQaListApi() {
//     return of([]);/* 模拟的 QA 列表数据 */
//   }
//   wenxinApi() {
//     return of('模拟的响应');
//   }
// }

// // 使用describe来描述一个测试套件
// describe('AqviewComponent', () => {
//   // 定义组件实例、测试夹具和模拟服务 
//   let component: AqviewComponent;
//   let fixture: ComponentFixture<AqviewComponent>;
//   let mockService: AqviewServiceMock;

//   // 在beforeEach中配置测试模块，并编译组件
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       // declarations: [AqviewComponent],// 声明要测试的组件
//       providers: [{ provide: AqviewService, useClass: AqviewServiceMock }], // 使用模拟服务
//       imports: [HttpClientTestingModule]
//     })
//       .compileComponents(); // 编译组件
//     // 创建组件实例
//     fixture = TestBed.createComponent(AqviewComponent);
//     // 注入模拟的服务
//     component = fixture.componentInstance;
//     // 触发组件的初始渲染和数据绑定
//     fixture.detectChanges();
//   });

//   // 第一个测试用例，测试组件是否创建成功
//   it('should create', () => {
//     // 断言组件实例存在
//     expect(component).toBeTruthy();
//   });

//   // 第二个测试用例，检查ngOnInit方法是否调用了getQaListApi方法并更新了qaList属性
//   it('检查ngOnInit方法是否调用了getQaListApi方法并更新了qaList属性', () => {
//     // 或者一个不同的初始值  
//     component.qaList = [];
//     // 调用ngOnInit方法
//     component.ngOnInit();
//     // 创建spyOn，监视getQaListApi方法的调用
//     spyOn(mockService, 'getQaListApi').and.returnValue(of([]));
//     // 断言getQaListApi方法被调用
//     // expect(mockService.getQaListApi).toHaveBeenCalled();
//     // 断言qaList属性被更新
//     expect(component.qaList).toEqual([]);
//   });

//   // 第三个测试用例，检查wenxinChat方法是否调用了wenxinChat方法，并更新了qaList属性
//   it('检查wenxinChat方法是否调用了wenxinChat方法，并更新了qaList属性', () => {
//     // 假设的响应数据  
//     const fakeResponse = 'Mocked response';
//     // 使用spyOn来监视mockService的wenxinApi方法  
//     // spyOn(mockService, 'wenxinApi').and.returnValue(of(fakeResponse)); // 假设wenxinApi返回成功响应  
//     component.ques = 'Test message'; // 设置ques属性的值  
//     component.wenxinChat(); // 调用wenxinChat方法  
//     // 验证QA列表是否包含了用户发送的消息和模拟的响应  
//     expect(component.qaList).toContain({ role: 'user', content: 'Test message' });
//     // expect(component.qaList).toContain({ role: 'assistant', content: fakeResponse });
//     expect(component.isLoading).toBe(false); // 验证isLoading状态是否重置为false  
//   });

//   // 第四个测试用例，检查sendOrLine是否按预期工作
//   it('检查sendOrLine是否按预期工作', () => {
//     // 创建一个模拟的键盘事件对象  
//     const event = new KeyboardEvent('keydown', { key: 'Enter' });
//     component.ques = 'Hello'; // 设置ques属性的值  
//     component.sendOrLine(event); // 调用sendOrLine方法  
//     expect(component.ques).toBe(''); // 验证ques属性是否被清空（假设Enter键不带Ctrl）  
//   });

// });



// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AqviewService } from './aqview.api'
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { AqviewComponent } from './aqview.component';
// import { of } from 'rxjs';

// class AqviewServiceMock {
//   getQaListApi() {
//     return of([]); // 模拟的 QA 列表数据
//   }
//   wenxinApi() {
//     return of('模拟的响应');
//   }
// }

// describe('AqviewComponent', () => {
//   let component: AqviewComponent;
//   let fixture: ComponentFixture<AqviewComponent>;
//   let mockService: AqviewServiceMock;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       providers: [{ provide: AqviewService, useClass: AqviewServiceMock }],
//       imports: [HttpClientTestingModule]
//     })
//     .compileComponents();
//     fixture = TestBed.createComponent(AqviewComponent);
//     component = fixture.componentInstance;
//     mockService = TestBed.inject(AqviewService) as unknown as AqviewServiceMock;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('检查ngOnInit方法是否调用了getQaListApi方法并更新了qaList属性', () => {
//     component.qaList = [];
//     spyOn(mockService, 'getQaListApi').and.returnValue(of([]));
//     spyOn(component, 'scrollToBottom');
//     component.ngOnInit();
//     expect(mockService.getQaListApi).toHaveBeenCalled();
//     expect(component.scrollToBottom).toHaveBeenCalled();
//     expect(component.qaList).toEqual([]);
//   });

//   it('检查wenxinChat方法是否调用了wenxinChat方法，并更新了qaList属性', () => {
//     const fakeResponse = 'Mocked response';
//     spyOn(mockService, 'wenxinApi').and.returnValue(of(fakeResponse));
//     component.ques = 'Test message';
//     component.wenxinChat();
//     expect(component.qaList).toContain({ role: 'user', content: 'Test message' });
//     expect(component.qaList).toContain({ role: 'assistant', content: fakeResponse });
//     expect(component.isLoading).toBe(false);
//   });

//   it('检查sendOrLine是否按预期工作', () => {
//     const event = new KeyboardEvent('keydown', { key: 'Enter' });
//     component.ques = 'Hello';
//     component.sendOrLine(event);
//     expect(component.ques).toBe('');
//   });

//   it('检查sendOrLine方法对Ctrl+Enter的处理', () => {
//     const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
//     component.ques = 'Hello';
//     component.sendOrLine(event);
//     // 由于Ctrl+Enter不应清空ques而是换行，所以这里检查ques是否为'Hello'+换行
//     expect(component.ques).toBe('Hello\n');
//   });
// });