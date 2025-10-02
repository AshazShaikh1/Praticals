import { supabase } from '../supabase';

export const STORAGE_BUCKET_NAME = 'local-notes';

export function getStoragePathFromPublicUrl(url) {
    try {
        if (!url) return null;
        const marker = `/storage/v1/object/public/${STORAGE_BUCKET_NAME}/`;
        const idx = url.indexOf(marker);
        if (idx === -1) return null;
        return url.substring(idx + marker.length);
    } catch (_) {
        return null;
    }
}

export async function removeFromStorageIfPublicUrl(publicUrl) {
    const storagePath = getStoragePathFromPublicUrl(publicUrl || '');
    if (!storagePath) return { error: null };
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([storagePath]);
    return { error };
}


