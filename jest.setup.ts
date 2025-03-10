import { beforeAll, expect } from "@jest/globals";
import { addEqualityTesters } from "@algorandfoundation/algorand-typescript-testing";

beforeAll(() => {
  addEqualityTesters({ expect });
});
