export enum ConfigChangeType {
  Move,
  Delete,
  Transform
}

export type TransformFunction = (value: any, config: any) => any;

export interface MigrationRule {
  key?: string;
  change: ConfigChangeType;
  transform?: TransformFunction;
}

export type MigrationMap = Record<string, MigrationRule>;
