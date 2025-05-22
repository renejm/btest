-- Create table for drivers
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create table for loads
CREATE TABLE loads (
    id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES drivers(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price NUMERIC NOT NULL,
    eta DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for GPT summaries
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    load_id INT REFERENCES loads(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast filtering on loads
CREATE INDEX idx_loads_created_at ON loads(created_at DESC);
CREATE INDEX idx_summaries_load_id ON summaries(load_id);

-- Materialized view to join loads with summaries
CREATE MATERIALIZED VIEW load_summary_view AS
SELECT
    l.id AS load_id,
    l.origin,
    l.destination,
    l.price,
    l.eta,
    s.summary_text,
    s.created_at AS summarized_at
FROM loads l
JOIN summaries s ON l.id = s.load_id;

-- Example query: Top 5 most valuable loads with summaries
-- (can be reused in application layer)
-- SELECT * FROM load_summary_view ORDER BY price DESC LIMIT 5;
