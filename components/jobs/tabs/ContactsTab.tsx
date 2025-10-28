'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createContact, deleteContact, getContactsByJob } from '@/lib/actions/contacts';

export function ContactsTab({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    noEmail: false,
    noPhone: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [jobId]);

  const loadContacts = async () => {
    try {
      const data = await getContactsByJob(jobId);
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.role.trim()) return;

    setSubmitting(true);
    try {
      await createContact({
        jobId,
        name: newContact.name,
        role: newContact.role,
        email: newContact.noEmail ? undefined : newContact.email || undefined,
        phone: newContact.noPhone ? undefined : newContact.phone || undefined,
      });
      setNewContact({
        name: '',
        role: '',
        email: '',
        phone: '',
        noEmail: false,
        noPhone: false,
      });
      await loadContacts();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke legge til kontakt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne kontakten?')) return;

    try {
      await deleteContact(contactId);
      await loadContacts();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette kontakt');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Laster kontakter...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Contact Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legg til kontaktperson</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Navn *
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="F.eks. Ola Nordmann"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tittel *
              </label>
              <input
                type="text"
                value={newContact.role}
                onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                placeholder="F.eks. Rekrutteringsansvarlig"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="ola@firma.no"
              disabled={newContact.noEmail}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                checked={newContact.noEmail}
                onChange={(e) => setNewContact({ ...newContact, noEmail: e.target.checked, email: '' })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">
                Ikke oppgitt i utlysningen
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="+47 123 45 678"
              disabled={newContact.noPhone}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                checked={newContact.noPhone}
                onChange={(e) => setNewContact({ ...newContact, noPhone: e.target.checked, phone: '' })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-600">
                Ikke oppgitt i utlysningen
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !newContact.name.trim() || !newContact.role.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Lagrer...' : 'Legg til kontakt'}
            </button>
          </div>
        </form>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Ingen kontakter ennå. Legg til din første kontakt ovenfor!</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{contact.role}</p>
                  <div className="mt-3 space-y-1">
                    {contact.email ? (
                      <p className="text-sm text-gray-700">
                        📧 <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700">
                          {contact.email}
                        </a>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">📧 Ikke oppgitt</p>
                    )}
                    {contact.phone ? (
                      <p className="text-sm text-gray-700">
                        📞 <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700">
                          {contact.phone}
                        </a>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">📞 Ikke oppgitt</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Slett
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
