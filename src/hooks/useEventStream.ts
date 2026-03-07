import { useEffect, useRef, useCallback, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export interface SSEEvent {
    type: string;
    payload: Record<string, unknown>;
    timestamp: string;
}

interface UseEventStreamOptions {
    /** Event types to filter on (e.g., ['equipment.updated', 'ticket.created']) */
    eventTypes?: string[];
    /** Callback when any matching event arrives */
    onEvent?: (event: SSEEvent) => void;
    /** Callback when SSE reconnects after a disconnect — use to refetch/sync data */
    onReconnect?: () => void;
    /** Auto-connect on mount (default: true) */
    enabled?: boolean;
}

interface UseEventStreamResult {
    /** Whether we are connected to the SSE stream */
    isConnected: boolean;
    /** Last event received */
    lastEvent: SSEEvent | null;
    /** Last error */
    error: string | null;
}

/**
 * React hook for subscribing to real-time SSE events from the backend.
 *
 * Features:
 * - Auto-reconnect (handled by browser's EventSource)
 * - `onReconnect` callback to refetch data after disconnect (fixes Pub/Sub data loss)
 * - Event type filtering
 *
 * Usage:
 * ```tsx
 * useEventStream({
 *   eventTypes: ['equipment.updated', 'equipment.created'],
 *   onEvent: (event) => refetch(),
 *   onReconnect: () => refetch(), // sync after disconnect
 * });
 * ```
 */
export function useEventStream(options: UseEventStreamOptions = {}): UseEventStreamResult {
    const { eventTypes, onEvent, onReconnect, enabled = true } = options;
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Use refs to always call latest callback without causing reconnect
    const onEventRef = useRef(onEvent);
    onEventRef.current = onEvent;
    const onReconnectRef = useRef(onReconnect);
    onReconnectRef.current = onReconnect;

    // Track if we were connected before (to detect reconnect vs first connect)
    const wasConnectedBefore = useRef(false);

    const eventTypesKey = eventTypes?.sort().join(',') ?? '';

    const connect = useCallback(() => {
        if (!enabled) return;

        const params = eventTypesKey ? `?types=${eventTypesKey}` : '';
        const url = `${BASE_URL}/api/events/stream${params}`;

        const eventSource = new EventSource(url);

        eventSource.addEventListener('connected', () => {
            setIsConnected(true);
            setError(null);

            if (wasConnectedBefore.current) {
                // 🔄 RECONNECT: We lost connection and got it back.
                // Redis Pub/Sub is fire-and-forget, so we may have missed events.
                // Trigger a full refetch to sync state.
                console.log('🔄 SSE reconnected — refetching data to sync state');
                onReconnectRef.current?.();
            } else {
                console.log('📡 SSE connected (first time)');
            }

            wasConnectedBefore.current = true;
        });

        // Listen to all typed events we care about
        const typesToListen = eventTypes?.length ? eventTypes : [
            'equipment.created',
            'equipment.updated',
            'equipment.deleted',
            'ticket.created',
            'ticket.updated',
        ];

        typesToListen.forEach((eventType) => {
            eventSource.addEventListener(eventType, (e: MessageEvent) => {
                try {
                    const parsed: SSEEvent = JSON.parse(e.data);
                    setLastEvent(parsed);
                    onEventRef.current?.(parsed);
                } catch (err) {
                    console.error('Failed to parse SSE event:', err);
                }
            });
        });

        eventSource.onerror = () => {
            console.warn('📡 SSE connection lost, will retry...');
            setIsConnected(false);
            setError('Connection lost');
            // Browser's EventSource auto-reconnects, no manual retry needed
        };

        return eventSource;
    }, [enabled, eventTypesKey]);

    useEffect(() => {
        const eventSource = connect();
        return () => {
            if (eventSource) {
                console.log('📡 SSE disconnecting');
                eventSource.close();
            }
        };
    }, [connect]);

    return { isConnected, lastEvent, error };
}

