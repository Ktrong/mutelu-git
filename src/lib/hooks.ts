import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
    const { data, error, isLoading } = useSWR('/api/categories', fetcher);

    return {
        categories: data,
        isLoading,
        isError: error
    };
}

export function useWallpapers(categoryId?: string, isPopular?: boolean) {
    let url = '/api/wallpapers?';
    const params = new URLSearchParams();

    if (categoryId && categoryId !== 'All' && categoryId !== 'ทั้งหมด') {
        params.append('categoryId', categoryId);
    }
    if (isPopular) {
        params.append('isPopular', 'true');
    }

    const { data, error, isLoading } = useSWR(url + params.toString(), fetcher);

    return {
        wallpapers: data,
        isLoading,
        isError: error
    };
}

export function useSlideshows() {
    const { data, error, isLoading } = useSWR('/api/slideshows', fetcher);

    return {
        slideshows: data,
        isLoading,
        isError: error
    };
}
