import { Entity, EntityId } from './entity';

export interface Page {
  updatedEntities: Entity[];
  deletedEntities: EntityId[];
}
