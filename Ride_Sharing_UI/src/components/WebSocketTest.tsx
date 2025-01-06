import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';

export const WebSocketTest = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');

    useEffect(() => {
        // Create STOMP client
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {},
            debug: (str) => {
                console.log('STOMP: ' + str);
                setMessages(prev => [...prev, `Debug: ${str}`]);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
        });

        // Add to window for testing
        (window as any).__STOMP_CLIENT__ = stompClient;

        // Connect handlers
        stompClient.onConnect = (frame) => {
            setConnectionStatus('Connected');
            console.log('Connected: ' + frame);
            setMessages(prev => [...prev, 'Connected to WebSocket']);

            // Subscribe to test topics
            try {
                // Test message subscription
                stompClient.subscribe('/topic/test', (message) => {
                    console.log('Received test message:', message);
                    setMessages(prev => [...prev, `Test response: ${message.body}`]);
                });

                // Order status subscription
                stompClient.subscribe('/topic/orders/1/status', (message) => {
                    console.log('Received order status:', message);
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, `Order Status: ${newMessage.status} - ${newMessage.message}`]);
                });

                // Driver location subscription
                stompClient.subscribe('/topic/drivers/1/location', (message) => {
                    console.log('Received location:', message);
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev,
                        `Driver Location: ${newMessage.latitude}, ${newMessage.longitude}`
                    ]);
                });

                // Chat message subscription
                stompClient.subscribe('/topic/chat/1', (message) => {
                    console.log('Received chat:', message);
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev,
                        `Chat from ${newMessage.senderType}: ${newMessage.content}`
                    ]);
                });
            } catch (error) {
                console.error('Error subscribing:', error);
                setMessages(prev => [...prev, `Error subscribing: ${error.message}`]);
            }
        };

        stompClient.onStompError = (frame) => {
            setConnectionStatus('Error');
            console.error('STOMP error:', frame);
            setMessages(prev => [...prev, `STOMP error: ${frame.headers['message']}`]);
        };

        stompClient.onDisconnect = () => {
            setConnectionStatus('Disconnected');
            setMessages(prev => [...prev, 'Disconnected from WebSocket']);
        };

        // Activate the client
        try {
            stompClient.activate();
            setClient(stompClient);
        } catch (error) {
            console.error('Error activating client:', error);
            setMessages(prev => [...prev, `Error activating client: ${error.message}`]);
        }

        // Cleanup on unmount
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendTestMessages = () => {
        if (!client) {
            setMessages(prev => [...prev, 'Client not connected']);
            return;
        }

        try {
            // Send test message
            client.publish({
                destination: '/app/websocket.test.message',
                body: 'Hello from client!'
            });
            setMessages(prev => [...prev, 'Sent test message']);

            // Send test order notification
            client.publish({
                destination: '/app/order.notification/1',
                body: JSON.stringify({
                    orderId: 1,
                    status: 'ACCEPTED',
                    message: 'Test order notification',
                    timestamp: Date.now()
                })
            });
            setMessages(prev => [...prev, 'Sent order notification']);

            // Send test location update
            client.publish({
                destination: '/app/driver.location/1',
                body: JSON.stringify({
                    driverId: 1,
                    orderId: 1,
                    latitude: 44.4268,
                    longitude: 26.1025,
                    timestamp: Date.now()
                })
            });
            setMessages(prev => [...prev, 'Sent location update']);

            // Send test chat message
            client.publish({
                destination: '/app/chat.message/1',
                body: JSON.stringify({
                    orderId: 1,
                    senderId: 'driver1',
                    senderType: 'DRIVER',
                    content: 'Test chat message',
                    timestamp: Date.now()
                })
            });
            setMessages(prev => [...prev, 'Sent chat message']);
        } catch (error) {
            console.error('Error sending messages:', error);
            setMessages(prev => [...prev, `Error sending messages: ${error.message}`]);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>WebSocket Test</h2>
            <div style={{ marginBottom: '10px' }}>
                Status: <span style={{
                    color: connectionStatus === 'Connected' ? 'green' :
                           connectionStatus === 'Error' ? 'red' : 'orange'
                }}>{connectionStatus}</span>
            </div>
            <button
                onClick={sendTestMessages}
                disabled={connectionStatus !== 'Connected'}
            >
                Send Test Messages
            </button>
            <div style={{ marginTop: '20px' }}>
                <h3>Messages:</h3>
                <div style={{ 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    padding: '10px'
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ 
                            padding: '5px',
                            borderBottom: '1px solid #eee'
                        }}>
                            {msg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 