// ULID generator. Used in fixture data when stable order matters but ids
// should not collide between modules. The implementation is the standard
// 26-character Crockford base32 layout, with a monotonic counter on the
// random portion so consecutive calls produce sortable ids.

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const TIME_LEN = 10;
const RANDOM_LEN = 16;

export interface UlidFactory {
  next(): string;
}

export function createUlidFactory(now: () => number, random: () => number): UlidFactory {
  let lastTime = -1;
  let lastRandom = '';
  return {
    next(): string {
      const time = Math.trunc(now());
      const timeChars = encodeTime(time);
      let randomChars: string;
      if (time === lastTime) {
        randomChars = incrementBase32(lastRandom);
      } else {
        randomChars = generateRandom(random);
      }
      lastTime = time;
      lastRandom = randomChars;
      return timeChars + randomChars;
    },
  };
}

function encodeTime(time: number): string {
  let out = '';
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    const mod = time % 32;
    out = (ENCODING[mod] as string) + out;
    time = Math.floor(time / 32);
  }
  return out;
}

function generateRandom(random: () => number): string {
  let out = '';
  for (let i = 0; i < RANDOM_LEN; i++) {
    const r = Math.floor(random() * 32);
    out += ENCODING[r];
  }
  return out;
}

function incrementBase32(value: string): string {
  const chars = value.split('');
  for (let i = chars.length - 1; i >= 0; i--) {
    const idx = ENCODING.indexOf(chars[i] as string);
    if (idx < 31) {
      chars[i] = ENCODING[idx + 1] as string;
      for (let j = i + 1; j < chars.length; j++) chars[j] = '0';
      return chars.join('');
    }
  }
  return ENCODING[0]!.repeat(value.length);
}

export function isUlid(value: string): boolean {
  if (value.length !== TIME_LEN + RANDOM_LEN) return false;
  for (const ch of value) if (!ENCODING.includes(ch)) return false;
  return true;
}
