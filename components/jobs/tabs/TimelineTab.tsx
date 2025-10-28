'use client';

import { useState, useEffect } from 'react';
import { getEventsByJob } from '@/lib/actions/events';

export function TimelineTab({ jobId }: { jobId: string }) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, [jobId]);

    const loadEvents = async () => {
        try {
            const data = await getEventsByJob(jobId);
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const eventLabels: Record<string, string> = {
        STATUS_CHANGED: 'Status endret',
        NOTE_ADDED: 'Notat lagt til',
        TASK_ADDED: 'Oppgave lagt til',
        TASK_DONE: 'Oppgave fullført',
        FILE_ATTACHED: 'Fil lagt til',
    };

    const eventIcons: Record<string, string> = {
        STATUS_CHANGED: '🔄',
        NOTE_ADDED: '📝',
        TASK_ADDED: '✅',
        TASK_DONE: '✔️',
        FILE_ATTACHED: '📎',
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Laster tidslinje...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Historikk</h3>

            {events.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Ingen hendelser ennå</p>
            ) : (
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div key={event._id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                    {eventIcons[event.type] || '📌'}
                                </div>
                                {index < events.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                )}
                            </div>

                            <div className="flex-1 pb-8">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-medium text-gray-900">
                                        {eventLabels[event.type] || event.type}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(event.at).toLocaleDateString('nb-NO', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>

                                {event.payload && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        {event.type === 'STATUS_CHANGED' && event.payload.from && (
                                            <p>Fra: {event.payload.from} → Til: {event.payload.to}</p>
                                        )}
                                        {event.type === 'STATUS_CHANGED' && !event.payload.from && (
                                            <p>Status satt til: {event.payload.to}</p>
                                        )}
                                        {(event.type === 'TASK_ADDED' || event.type === 'TASK_DONE') && event.payload.title && (
                                            <p>{event.payload.title}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
