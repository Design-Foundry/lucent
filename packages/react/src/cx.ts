/** Tiny classname joiner — filters out falsy values. Keeps the kit dependency-free for class building. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
