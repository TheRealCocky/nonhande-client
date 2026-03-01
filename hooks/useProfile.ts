import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/services/api';
import { UserProfile } from '@/types/profile';

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await profileService.getMe();
            setProfile(data);
        } catch (err) {
            setError('Falha ao carregar o perfil ancestral.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refresh: fetchProfile };
}