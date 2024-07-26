import { add } from "@app/modules/dashboard/test/sum";

//写一个add的测试用例
it("test a + b = 3?", () => {
  expect(add(1, 2)).toBe(3);
});


it("测试用例ADD2", () => {
  expect(add(2, 3)).toBe(5);
});

it("测试用例ADD3", () => {
  expect(add(2, 2)).toBe(4);
});
