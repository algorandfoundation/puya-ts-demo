import { Contract } from "@algorandfoundation/algorand-typescript";

export class HelloWorldContract extends Contract {
  sayHello(name: string): string {
    return `${this.getHello()} ${name}`;
  }

  private getHello() {
    return "Hello";
  }
}
