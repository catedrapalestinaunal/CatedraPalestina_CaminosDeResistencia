CREATE TABLE IF NOT EXISTS events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  place TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  organizer TEXT,
  category TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events public read" ON events
  FOR SELECT USING (true);

CREATE POLICY "Events admin insert" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events admin update" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Events admin delete" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX idx_events_event_date ON events (event_date);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
