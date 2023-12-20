type Category = {
  id: number;
};

type Phrase = {
  movie: string;
  movie_image: string;
  phrase: string;
};

export type TSPQuizResponse = {
  id: string;
  word: string;
  description: string;
  last_update: string;
  category_id: number;
  category_slug: string;
  category: string;
  glosa: null | string;
  frequency: null | string;
  type: null | string;
  region: null | string;
  hand_type: "one" | "two" | "unknown";
  right_handform: string;
  right_position: string;
  right_attitude: string;
  movie: string;
  movie_image: string;
  transcription: string;
  left_attitude: string;
  left_handform: string;
  genuine: number;
  also_means: string;
  hidden_also_means: string;
  phrases: Phrase[];
  categories: Category[];
};
