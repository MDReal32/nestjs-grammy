import { META_KEYS } from "../meta-keys";

export const Scopes = (names: readonly string[]) => (target: object) => {
  Reflect.defineMetadata(META_KEYS.SCOPES, [...names], target);
};
