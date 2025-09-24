-- Create table for CS rotation state management
-- This table will store the current rotation counter globally

CREATE TABLE IF NOT EXISTS cs_rotation_state (
    id SERIAL PRIMARY KEY,
    current_index INTEGER NOT NULL DEFAULT 0,
    total_cs_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial state
INSERT INTO cs_rotation_state (current_index, total_cs_count) 
VALUES (0, 3) 
ON CONFLICT DO NOTHING;

-- Create function to get next CS index atomically
CREATE OR REPLACE FUNCTION get_next_cs_index()
RETURNS INTEGER AS $$
DECLARE
    current_idx INTEGER;
    total_count INTEGER;
BEGIN
    -- Get current state
    SELECT current_index, total_cs_count 
    INTO current_idx, total_count
    FROM cs_rotation_state 
    WHERE id = 1;
    
    -- If no record exists, create one
    IF current_idx IS NULL THEN
        INSERT INTO cs_rotation_state (id, current_index, total_cs_count) 
        VALUES (1, 0, (SELECT COUNT(*) FROM customer_services WHERE status = true))
        ON CONFLICT (id) DO NOTHING;
        
        SELECT current_index, total_cs_count 
        INTO current_idx, total_count
        FROM cs_rotation_state 
        WHERE id = 1;
    END IF;
    
    -- Calculate next index
    current_idx := (current_idx + 1) % total_count;
    
    -- Update the state atomically
    UPDATE cs_rotation_state 
    SET 
        current_index = current_idx,
        last_updated = NOW()
    WHERE id = 1;
    
    -- Return the previous index (the one to use now)
    RETURN (current_idx - 1 + total_count) % total_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get current CS index without updating
CREATE OR REPLACE FUNCTION get_current_cs_index()
RETURNS INTEGER AS $$
DECLARE
    current_idx INTEGER;
BEGIN
    SELECT current_index 
    INTO current_idx
    FROM cs_rotation_state 
    WHERE id = 1;
    
    -- If no record exists, return 0
    IF current_idx IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN current_idx;
END;
$$ LANGUAGE plpgsql;

-- Create function to reset rotation state
CREATE OR REPLACE FUNCTION reset_cs_rotation()
RETURNS VOID AS $$
BEGIN
    UPDATE cs_rotation_state 
    SET 
        current_index = 0,
        total_cs_count = (SELECT COUNT(*) FROM customer_services WHERE status = true),
        last_updated = NOW()
    WHERE id = 1;
    
    -- If no record exists, create one
    IF NOT FOUND THEN
        INSERT INTO cs_rotation_state (id, current_index, total_cs_count) 
        VALUES (1, 0, (SELECT COUNT(*) FROM customer_services WHERE status = true));
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_next_cs_index() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_cs_index() TO authenticated;
GRANT EXECUTE ON FUNCTION reset_cs_rotation() TO authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_cs_rotation_state_id ON cs_rotation_state(id);

-- Add RLS policies
ALTER TABLE cs_rotation_state ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read rotation state
CREATE POLICY "Allow authenticated users to read rotation state" ON cs_rotation_state
    FOR SELECT TO authenticated
    USING (true);

-- Allow authenticated users to update rotation state
CREATE POLICY "Allow authenticated users to update rotation state" ON cs_rotation_state
    FOR UPDATE TO authenticated
    USING (true);

-- Allow authenticated users to insert rotation state
CREATE POLICY "Allow authenticated users to insert rotation state" ON cs_rotation_state
    FOR INSERT TO authenticated
    WITH CHECK (true);
