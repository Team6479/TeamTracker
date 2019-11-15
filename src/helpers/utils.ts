/**
 * From https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 */
export function hash(str: string): number {
  let h: number = 0;

  for(let i = 0; i < str.length; i++)
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;

  return h;
}
