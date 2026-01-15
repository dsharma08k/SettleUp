'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface AvatarUploadProps {
    uid: string;
    url: string | null;
    size?: number;
    onUpload: (url: string) => void;
    editable?: boolean;
}

export default function AvatarUpload({
    uid,
    url,
    size = 150,
    onUpload,
    editable = true,
}: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${uid}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Fix: Ensure URL follows the public pattern if getPublicUrl omits it
            let publicUrl = data.publicUrl;
            if (!publicUrl.includes('/public/')) {
                publicUrl = publicUrl.replace('/object/', '/object/public/');
            }


            onUpload(publicUrl);
            toast.success('Avatar uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group">
            <div
                className="relative overflow-hidden rounded-full bg-surface-light border-2 border-border"
                style={{ width: size, height: size }}
            >
                {url ? (
                    <Image
                        src={url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        unoptimized // For external Supabase URLs
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-primary/10">
                        <User className="text-primary" style={{ width: size * 0.5, height: size * 0.5 }} />
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            {editable && (
                <>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-background rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                        disabled={uploading}
                        title="Upload new avatar"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </>
            )}
        </div>
    );
}
