import { Engine, Handler, Page } from './model';
import { sleep } from './util';

class Engine1 extends Engine {
  constructor() {
    super(0);
  }
  async init(): Promise<void> {
    console.log(`[Engine1] engine1 init`);
  }
  async next(): Promise<Page> {
    return {
      updatedEntities: [
        {
          id: 'a',
          data: {},
        },
      ],
      deletedEntities: ['b', 'c'],
    } as Page;
  }
}

class SaveToDbHandler extends Handler {
  async handlerRequest(page: Page): Promise<Page> {
    for (const entity of page.updatedEntities) {
      console.log(`[SaveToDbHandler] added entity ${entity.id} to db`);
    }
    for (const entityId of page.deletedEntities) {
      console.log(`[SaveToDbHandler] deleted entity ${entityId} from db`);
    }
    return page;
  }
}

class SendToQ extends Handler {
  async handlerRequest(page: Page): Promise<Page> {
    for (const entity of page.updatedEntities) {
      console.log(
        `[SendToQ] update kafka topic EntityAdded with id ${entity.id}`,
      );
    }
    for (const entityId of page.deletedEntities) {
      console.log(
        `[SendToQ] update kafka topic EntityDeleted with id ${entityId}`,
      );
    }
    return page;
  }
}

(async () => {
  const engine1 = new Engine1();
  const saveToDbHandler = new SaveToDbHandler();
  const sendToQ = new SendToQ();
  saveToDbHandler.setNextHandler(sendToQ);
  await engine1.init();
  while (true) {
    const page = await engine1.next();
    await saveToDbHandler.operation(page);
    await sleep(5000);
  }
})();
