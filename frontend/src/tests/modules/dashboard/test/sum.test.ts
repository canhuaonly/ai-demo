import { add } from "../../../../app/modules/dashboard/test/sum";

//写一个add的测试用例
it("test a + b = 3?", () => {
  expect(add(1, 2)).toBe(3);
});
