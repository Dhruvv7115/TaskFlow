'use client';

import { useEffect, useState } from 'react';

export function MountedContainer({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return children;
}
