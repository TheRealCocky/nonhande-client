export interface WordExample {
    text: string;
    translation: string;
}

export interface WordResponse {
    id: string;
    term: string;
    infinitive?: string;
    meaning: string;
    audioUrl?: string;
    language: string;
    imageUrl?: string;
    category?: string;
    grammaticalType?: string;
    culturalNote?: string;
    tags?: string[];
    searchTags?: string[];
    examples: WordExample[];
}
