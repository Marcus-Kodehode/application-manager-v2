'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createContact, deleteContact, getContactsByJob } from '@/lib/actions/contacts';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

    setDeletingId(contactId);
    try {
      await deleteContact(contactId);
      await loadContacts();
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke slette kontakt');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted">Laster kontakter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Contact Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          👤 Legg til kontaktperson
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Navn *
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="F.eks. Ola Nordmann"
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tittel *
              </label>
              <input
                type="text"
                value={newContact.role}
                onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                placeholder="F.eks. Rekrutteringsansvarlig"
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              📧 E-post
            </label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="ola@firma.no"
              disabled={newContact.noEmail}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="mt-3 flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <input
                type="checkbox"
                checked={newContact.noEmail}
                onChange={(e) => setNewContact({ ...newContact, noEmail: e.target.checked, email: '' })}
                className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
              <label className="text-sm text-muted">
                Ikke oppgitt i utlysningen
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              📞 Telefon
            </label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="+47 123 45 678"
              disabled={newContact.noPhone}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="mt-3 flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <input
                type="checkbox"
                checked={newContact.noPhone}
                onChange={(e) => setNewContact({ ...newContact, noPhone: e.target.checked, phone: '' })}
                className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
              <label className="text-sm text-muted">
                Ikke oppgitt i utlysningen
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || !newContact.name.trim() || !newContact.role.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {submitting ? '⏳ Lagrer...' : '💾 Legg til kontakt'}
            </button>
          </div>
        </form>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 transition-colors">
            <EmptyState
              emoji="👥"
              heading="Ingen kontakter ennå"
              description="Legg til kontaktpersoner ovenfor for å holde oversikt over hvem du snakker med i søknadsprosessen."
            />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              👥 Kontaktpersoner ({contacts.length})
            </h3>
            {contacts.map((contact) => (
              <div key={contact._id} className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-foreground">{contact.name}</h4>
                        <p className="text-sm text-muted mt-0.5">{contact.role}</p>
                      </div>
                    </div>
                    <div className="ml-15 space-y-2">
                      {contact.email ? (
                        <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg">
                          <span className="text-sm">📧</span>
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                          >
                            {contact.email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
                          <span className="text-sm">📧</span>
                          <span className="text-sm text-muted">Ikke oppgitt</span>
                        </div>
                      )}
                      {contact.phone ? (
                        <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg">
                          <span className="text-sm">📞</span>
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
                          <span className="text-sm">📞</span>
                          <span className="text-sm text-muted">Ikke oppgitt</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    disabled={deletingId === contact._id}
                    className="text-sm text-destructive hover:text-destructive/80 font-medium opacity-0 group-hover:opacity-100 transition-colors duration-200 px-3 py-1 rounded hover:bg-destructive/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  >
                    {deletingId === contact._id && <Spinner size="sm" />}
                    {deletingId === contact._id ? 'Sletter...' : '🗑️ Slett'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
