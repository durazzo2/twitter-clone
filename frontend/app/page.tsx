'use client';
import { useEffect, useState } from 'react';
import { getFeed } from '@/app/lib/api';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        getFeed(token).then(data => setPosts(data));
    }, []);
}
