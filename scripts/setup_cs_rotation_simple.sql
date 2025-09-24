-- Simple CS Rotation Setup
-- Run this in Supabase SQL Editor

-- Step 1: Create rotation state table
CREATE TABLE IF NOT EXISTS cs_rotation_state (
    id INTEGER PRIMARY KEY DEFAULT 1,
    current_index INTEGER NOT NULL DEFAULT 0,
    total_cs_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert initial state
INSERT INTO cs_rotation_state (id, current_index, total_cs_count) 
VALUES (1, 0, 3) 
ON CONFLICT (id) DO UPDATE SET
    current_index = EXCLUDED.current_index,
    total_cs_count = EXCLUDED.total_cs_count;

-- Step 3: Create simple rotation function
CREATE OR REPLACE FUNCTION get_next_cs_index()
RETURNS INTEGER AS $$
DECLARE
    current_idx INTEGER;
    total_count INTEGER;
    next_idx INTEGER;
BEGIN
    -- Get current state
    SELECT current_index, total_cs_count 
    INTO current_idx, total_count
    FROM cs_rotation_state 
    WHERE id = 1;
    
    -- If no record, create default
    IF current_idx IS NULL THEN
        current_idx := 0;
        total_count := 3;
        INSERT INTO cs_rotation_state (id, current_index, total_cs_count) 
        VALUES (1, 0, 3) 
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    -- Calculate next index
    next_idx := (current_idx + 1) % total_count;
    
    -- Update state
    UPDATE cs_rotation_state 
    SET 
        current_index = next_idx,
        last_updated = NOW()
    WHERE id = 1;
    
    -- Return the current index (before update)
    RETURN current_idx;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create get current index function
CREATE OR REPLACE FUNCTION get_current_cs_index()
RETURNS INTEGER AS $$
DECLARE
    current_idx INTEGER;
BEGIN
    SELECT current_index 
    INTO current_idx
    FROM cs_rotation_state 
    WHERE id = 1;
    
    RETURN COALESCE(current_idx, 0);
END;
$$ LANGUAGE plpgsql;

-- Step 5: Grant permissions
GRANT EXECUTE ON FUNCTION get_next_cs_index() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_cs_index() TO authenticated;

-- Step 6: Enable RLS
ALTER TABLE cs_rotation_state ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
CREATE POLICY "Allow authenticated users to read rotation state" ON cs_rotation_state
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to update rotation state" ON cs_rotation_state
    FOR UPDATE TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert rotation state" ON cs_rotation_state
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Step 8: Test the functions
SELECT 'Testing CS rotation functions:' as test_info;
SELECT get_current_cs_index() as current_index;
SELECT get_next_cs_index() as next_cs_index;
SELECT get_next_cs_index() as next_cs_index_2;
SELECT get_next_cs_index() as next_cs_index_3;
SELECT get_current_cs_index() as final_current_index;
