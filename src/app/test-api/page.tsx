"use client";

import { useEffect, useState } from 'react';

export default function TestAPIPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/wallpapers/with-offerings');
                const json = await res.json();
                setData(json);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">API Test: Wallpapers with Offerings</h1>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(data, null, 2)}
            </pre>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Parsed Data:</h2>
                {Array.isArray(data) && data.map((wp: any) => (
                    <div key={wp.id} className="mb-6 p-4 border rounded">
                        <h3 className="font-bold text-lg">{wp.title}</h3>
                        <p>ID: {wp.id}</p>
                        <p>Price: {wp.price}</p>
                        <p>Is Offering: {wp.isOffering ? 'Yes' : 'No'}</p>

                        {wp.offerings && wp.offerings.length > 0 && (
                            <div className="mt-4 ml-4 border-l-2 border-amber-500 pl-4">
                                <h4 className="font-bold text-amber-700">Offerings ({wp.offerings.length}):</h4>
                                {wp.offerings.map((offering: any) => (
                                    <div key={offering.id} className="mt-2 p-2 bg-amber-50 rounded">
                                        <p className="font-semibold">{offering.title}</p>
                                        <p className="text-sm">ID: {offering.id}</p>
                                        <p className="text-sm">Price: {offering.price}</p>
                                        <p className="text-sm">Related to: {offering.relatedWallpaperId}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
