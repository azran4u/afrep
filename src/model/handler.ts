import { Page } from './page';

export abstract class Handler {
  private nextHandler: Handler | undefined;

  constructor(handler?: Handler) {
    if (handler) {
      this.setNextHandler(handler);
    }
  }

  public setNextHandler(handler: Handler): void {
    this.nextHandler = handler;
  }

  public async operation(page: Page): Promise<Page> {
    let newPage: Page;
    try {
      newPage = await this.handlerRequest(page);
    } catch (error) {
      throw new Error(`error handling page`);
    }

    if (this.nextHandler !== null && this.nextHandler !== undefined) {
      this.nextHandler.operation(newPage);
    }
    return newPage;
  }

  abstract async handlerRequest(page: Page): Promise<Page>;
}
