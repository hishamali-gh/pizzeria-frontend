import { useState, useEffect } from 'react';


export default function useTelemetry(deviceId) {
    const [data, setData] = useState({ value: '--', is_on: false });


    useEffect(() => {
        const { hostname } = window.location;
        const subdomain = hostname.split('.')[0];

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let wsHost;

        if (hostname.endsWith('localhost')) {
            wsHost = `${subdomain}.localhost:8000`;
        } else {
            wsHost = `${subdomain}.pizzeriavdcs.duckdns.org`;
        }

        const socket = new WebSocket(
            `${wsProtocol}//${wsHost}/ws/telemetry/${deviceId}/`
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
