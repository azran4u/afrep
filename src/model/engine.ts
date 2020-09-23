import { Page } from './page';
import { Sequence } from './sequence';

export abstract class Engine {
  constructor(private seq: Sequence) {}
  abstract async init(): Promise<void>;
  abstract async next(): Promise<Page>;
}
