import { useState, useEffect } from 'react';


export default function useTelemetry(deviceId) {
    const [data, setData] = useState({ value: '--', is_on: false });


    useEffect(() => {
        const subdomain = window.location.hostname.split('.')[0];


        // Get the tenant name from the URL (e.g., willow.localhost -> willow)

        const socket = new WebSocket(
            `ws://${subdomain}.localhost:8000/ws/telemetry/${deviceId}/`
        );


        // Open the persistent phone call (WebSocket)

        socket.onmessage = (event) => {
            const payload = JSON.parse(event.data);

            setData({
                value: payload.value,
                status: payload.status
            });
        };

        socket.onerror = (error) => console.error('WebSocker Error:', error);


        // Clean up when the componenet closes

        return () => socket.close();
    }, [deviceId]);


    return data;
}
