import { add, subtract, multiply, divide } from "../../../../../src/app/modules/dashboard/test/calc";

it("test a + b = 3?", () => {
  expect(add(1, 2)).toBe(3);
});

it("test a - b = 5?", () => {
  expect(subtract(8, 3)).toBe(5);
});

it("test a * b = 8?", () => {
  expect(multiply(2, 4)).toBe(8);
});

it("test a / b = 2?", () => {
  expect(divide(8, 4)).toBe(2);
});

test('异步测试', async () => {
  const data = await add(3, 4);
  expect(data).toEqual(7);
});