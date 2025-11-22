/**
 * Entity Type ID mappings
 * These IDs are used on-chain to identify facility types
 */
export const ENTITY_TYPE_IDS = {
  gravityhill: 1,
  dynamo: 2,
  residence: 3,
} as const;

export type EntityTypeName = keyof typeof ENTITY_TYPE_IDS;

/**
 * Reverse mapping from ID to entity name
 */
export const ENTITY_TYPE_NAMES = Object.entries(ENTITY_TYPE_IDS).reduce(
  (acc, [name, id]) => {
    acc[id] = name as EntityTypeName;
    return acc;
  },
  {} as Record<number, EntityTypeName>
);

/**
 * Get entity type ID by name
 */
export function getEntityTypeId(name: EntityTypeName): number {
  return ENTITY_TYPE_IDS[name];
}

/**
 * Get entity type name by ID
 */
export function getEntityTypeName(id: number): EntityTypeName | undefined {
  return ENTITY_TYPE_NAMES[id];
}
