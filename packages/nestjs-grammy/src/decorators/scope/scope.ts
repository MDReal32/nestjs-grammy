import { META_KEYS } from "../meta-keys";

export const Scope = (name: string) => (target: object) => {
  Reflect.defineMetadata(META_KEYS.SCOPES, [name], target);
};
