export type JokeCategory = 'all' | 'dad' | 'tech' | 'clever' | 'oneliners' | 'animals';

export interface Joke {
  id: string;
  setup: string;
  punchline: string;
  category: JokeCategory;
  tags?: string[];
}

export interface SavedJoke extends Joke {
  savedAt: number;
}

export type ReactionType = 'laugh' | 'skull' | 'dad' | 'fire';
