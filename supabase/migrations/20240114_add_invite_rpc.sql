-- Secure function to find a group by invite code
-- This bypasses RLS policies specifically for invite code lookups
CREATE OR REPLACE FUNCTION get_group_by_invite_code(code text) RETURNS SETOF groups LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN RETURN QUERY
SELECT *
FROM groups
WHERE invite_code = code;
END;
$$;