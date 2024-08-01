import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Test0001Component, sum } from "../../../../../../src/app/modules/dashboard/pages/test0001/test0001";
import { of } from 'rxjs';

class AqviewServiceMock {
  getQaListApi() {
    return of([]); // 模拟的 QA 列表数据
  }
  wenxinApi() {
    return of('模拟的响应');
  }
}

describe('Test0001Component', () => {
  let component: Test0001Component;
  let fixture: ComponentFixture<Test0001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: Test0001Component, useClass: AqviewServiceMock }],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
      fixture = TestBed.createComponent(Test0001Component);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should = 3', () => {
    expect(component.sum(1, 2)).toBe(3);
  });

  it('should get data', () => {
    expect(component.getNext()).toBeNull();
  });
  
});

// describe('sum', () => {

//   let component : Test0001Component;

//   beforeEach(() => {
//       component = new Test0001Component();
//   });

//   it('可以做加法', () => {
//     expect(sum(1, 1)).toEqual(2);
//   });
// })

// let component: Test0001Component;
//   let fixture: ComponentFixture<Test0001Component>;
//   let mockService: AqviewServiceMock;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       providers: [{ provide: Test0001Service, useClass: AqviewServiceMock }],
//       imports: [HttpClientTestingModule]
//     })
//     .compileComponents();
//     fixture = TestBed.createComponent(Test0001Component);
//     component = fixture.componentInstance;
//     mockService = TestBed.inject(Test0001Service) as unknown as AqviewServiceMock;
//     fixture.detectChanges();

//     it('should create', () => {
//       expect(component).toBeTruthy();
//     });
//   });

// describe('works', () => {
//   it('returns the expected value', () => {
//     expect(sum(10, 10)).toBe(20);
//   });
// });





// import { Test0001Component } from "../../../../../../src/app/modules/dashboard/pages/test0001/test0001";
// import { ComponentFixture, TestBed } from '@angular/core/testing';

// describe('AppComponent', () => {
//   beforeEach(async() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         Test0001Component
//       ],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(Test0001Component);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it('sum', () => {
//     const fixture = TestBed.createComponent(Test0001Component);
//     const app = fixture.componentInstance;
//     expect(app.sum(1, 2)).toBe(3);
//   });
// });