// sum.test.ts

import { sum } from "@/src/lib/utils";

describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
});