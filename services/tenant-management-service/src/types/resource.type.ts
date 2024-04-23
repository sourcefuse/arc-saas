/**
 * Represents the data of a resource.
 */
export type ResourceData = BucketResourceType;

/**
 * Enum for resource types.
 */
export enum ResourceTypes {
  BUCKET = 'bucket',
}

export type BucketResourceType = {
  type: ResourceTypes.BUCKET;
  externalIdentifier: string;
  metadata: {
    bucket: string;
    path: string;
  };
};
