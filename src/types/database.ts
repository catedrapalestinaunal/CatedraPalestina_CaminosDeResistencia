export interface ProjectRow {
  id: number;
  kind: string;
  title: string;
  author: string;
  year: string;
  n: string;
  tags: string[];
  description: string | null;
  url: string | null;
  url_alt: string | null;
  links: { label: string; url: string }[] | null;
  link_label: string | null;
  thumbnail: string | null;
  ai_thumbnail: boolean;
  members: string[];
  group_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: number;
  title: string;
  description: string | null;
  place: string | null;
  event_date: string;
  event_time: string | null;
  organizer: string | null;
  category: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      events: {
        Row: EventRow;
        Insert: Omit<EventRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventRow, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
