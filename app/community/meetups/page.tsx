import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, CalendarDays, MapPin, Video } from 'lucide-react';

export const metadata = {
  title: 'Meetups & Events - HackForge',
  description: 'Community calls, workshops and build sessions.',
};

const events = [
  {
    name: 'Monthly Community Call',
    cadence: 'First Thursday of every month',
    format: 'Online',
    description:
      'Roadmap updates, a short demo, and open questions. Recordings are shared afterwards for anyone in a different timezone.',
  },
  {
    name: 'Prompt Engineering Workshop',
    cadence: 'Every other Tuesday',
    format: 'Online',
    description:
      'A working session on turning vague requirements into prompts that generate reviewable code. Bring a real feature you are stuck on.',
  },
  {
    name: 'Build Night',
    cadence: 'Last Saturday of the month',
    format: 'Online',
    description:
      'A few hours of focused building with others present. No agenda beyond finishing something you have been putting off.',
  },
  {
    name: 'Local Chapters',
    cadence: 'Varies by city',
    format: 'In person',
    description:
      'Informal in-person meetups organised by community members. Chapters run on their own schedule.',
  },
];

export default function MeetupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/community"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Link>

        <div className="flex items-center mb-6">
          <CalendarDays className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">Meetups &amp; Events</h1>
        </div>

        <p className="text-lg text-gray-300 mb-10">
          Recurring sessions run by the HackForge community. Everything online is
          free to join and open to all experience levels.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.name}
              className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-foreground mb-3">{event.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {event.cadence}
                </span>
                <span className="flex items-center">
                  {event.format === 'Online' ? (
                    <Video className="h-4 w-4 mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {event.format}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{event.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 glass-effect border border-primary/30 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Want to run a chapter?
          </h2>
          <p className="text-gray-300 mb-4">
            Local chapters are organised by community members. Read the{' '}
            <Link href="/community/guidelines" className="text-primary hover:text-accent">
              community guidelines
            </Link>{' '}
            first, then reach out on the community channels.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
