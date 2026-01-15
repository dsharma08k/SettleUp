-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
-- Policy: Allow authenticated users to upload their own avatar
-- We use a folder structure: avatars/{user_id}/filename
DROP POLICY IF EXISTS "Avatar Uploads" ON storage.objects;
CREATE POLICY "Avatar Uploads" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name)) [1] = auth.uid()::text
    );
-- Policy: Allow users to update their own avatar
DROP POLICY IF EXISTS "Avatar Updates" ON storage.objects;
CREATE POLICY "Avatar Updates" ON storage.objects FOR
UPDATE TO authenticated USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name)) [1] = auth.uid()::text
    );
-- Policy: Allow users to delete their own avatar
DROP POLICY IF EXISTS "Avatar Deletes" ON storage.objects;
CREATE POLICY "Avatar Deletes" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name)) [1] = auth.uid()::text
);
-- Policy: Allow public to view avatars
DROP POLICY IF EXISTS "Avatar Public View" ON storage.objects;
CREATE POLICY "Avatar Public View" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'avatars');