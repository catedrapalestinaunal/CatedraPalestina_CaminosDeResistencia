export const VALID_KINDS = [
  'ensayo', 'cartografia', 'video', 'podcast',
  'fanzine', 'mural', 'collage', 'grabado', 'otro',
] as const;

export type ValidKind = typeof VALID_KINDS[number];
