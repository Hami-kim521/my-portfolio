const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/** 방명록 프로필로 쓰이는 유명 캐릭터 목록 (이미지 로딩 실패 시 emoji 로 대체) */
export const CHARACTERS = [
  { name: '피카츄', pokedexId: 25, emoji: '⚡' },
  { name: '파이리', pokedexId: 4, emoji: '🔥' },
  { name: '꼬부기', pokedexId: 7, emoji: '💧' },
  { name: '이상해씨', pokedexId: 1, emoji: '🌱' },
  { name: '이브이', pokedexId: 133, emoji: '🦊' },
  { name: '잠만보', pokedexId: 143, emoji: '😴' },
  { name: '푸린', pokedexId: 39, emoji: '🎤' },
  { name: '고라파덕', pokedexId: 54, emoji: '🦆' },
  { name: '나옹', pokedexId: 52, emoji: '🪙' },
  { name: '뮤', pokedexId: 151, emoji: '✨' },
];

/**
 * 방명록 id 로 캐릭터를 고릅니다.
 * 같은 글은 새로고침해도 같은 캐릭터가 보이고, 글마다는 골고루 섞여 보입니다.
 *
 * @param {number} id - 방명록 ID
 * @returns {{ name: string, emoji: string, imageUrl: string }}
 */
export function pickCharacter(id) {
  const index = Math.abs((Number(id) * 2654435761) % CHARACTERS.length);
  const { name, pokedexId, emoji } = CHARACTERS[index];
  return { name, emoji, imageUrl: `${SPRITE_URL}/${pokedexId}.png` };
}
