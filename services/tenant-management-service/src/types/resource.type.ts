/**
 * Represents the data of a resource.
 */
export type ResourceData = {
  type: ResourceTypes.BUCKET;
  externalIdentifier: string;
  metadata: {
    bucket: string;
    path: string;
  };
};

/**
 * Enum for resource types.
 */
export enum ResourceTypes {
  BUCKET = 'bucket',
}
