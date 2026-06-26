import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudRain, Heart, Search, Share2, Users, Package, Gift,
  ArrowRight, Star, MapPin, Twitter, Instagram, Facebook, Linkedin,
} from 'lucide-react';
import Button from '../../components/Button';
import GearCard from './GearCard';
import api from '../../api/axios';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

// ── Stats item ───────────────────────────────────────────────────────────────
function StatItem({ value, label, suffix = '+' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(value, 1600, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-white/70 text-sm font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Landing() {
  const [featured, setFeatured]       = useState([]);
  const [featuredLoading, setFL]      = useState(true);
  const [stats, setStats]             = useState({ gear: 0, donations: 0, renters: 0 });

  useEffect(() => {
    // Featured gear
    api.get('/rain_gear?status=available&_limit=4')
      .then(r => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setFL(false));

    // Stats: count users, gear, donations
    Promise.all([
      api.get('/rain_gear'),
      api.get('/donations'),
      api.get('/users?role=renter'),
    ]).then(([g, d, u]) => {
      setStats({
        gear:      g.data.length,
        donations: d.data.length,
        renters:   u.data.length,
      });
    }).catch(() => {});
  }, []);

  const steps = [
    {
      icon: Package,
      step: '01',
      title: 'List Your Gear',
      desc:  'Donors post rain gear they no longer need — umbrellas, jackets, boots, ponchos and more.',
      color: 'from-teal-400 to-cyan-500',
    },
    {
      icon: Search,
      step: '02',
      title: 'Match & Browse',
      desc:  'Renters filter by category, condition, price and location to find exactly what they need.',
      color: 'from-sky-400 to-blue-500',
    },
    {
      icon: Share2,
      step: '03',
      title: 'Share & Return',
      desc:  'Rent for your rainy days, return when done, or donate your gear for good.',
      color: 'from-violet-400 to-purple-500',
    },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-[#0369A1] text-white overflow-hidden">
        {/* Rain drop decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 rounded-full bg-white/10"
              style={{
                left:   `${8 + i * 8}%`,
                top:    `${(i * 37) % 100}%`,
                height: `${40 + (i * 13) % 60}px`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Community rain gear sharing — now live
          </div>

          <CloudRain size={64} className="mx-auto mb-6 opacity-90 drop-shadow-lg" />

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Share the Rain,<br />
            <span className="text-yellow-300">Spread the Warmth</span>
          </h1>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            A community platform for donating, renting and reusing rain gear.
            Because nobody should get soaked when help is just around the corner.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl px-8"
              >
                <Gift size={18} className="mr-2" /> Donate Gear
              </Button>
            </Link>
            <Link to="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 font-semibold px-8 backdrop-blur-sm"
              >
                <Search size={18} className="mr-2" /> Find Gear
              </Button>
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-8 justify-center text-white/60 text-sm">
            {['Free to join', 'Verified donors', 'Safe transactions', 'Community driven'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Star size={13} className="text-yellow-300 fill-yellow-300" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary-light text-primary text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-4">
              How It Works
            </span>
            <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Three simple steps
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              RainShare makes it easy to give, find, and keep rain gear circulating in your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal-200 via-sky-200 to-violet-200 dark:from-teal-800 dark:via-sky-800 dark:to-violet-800" />

            {steps.map(({ icon: Icon, step, title, desc, color }) => (
              <div
                key={step}
                className="relative bg-surface dark:bg-slate-800 rounded-3xl p-8 text-center group hover:-translate-y-1 transition-transform duration-300 shadow-card hover:shadow-card-hover"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-slate-400">{step}</span>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center mx-auto mb-5 shadow-md`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Gear ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-surface dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-secondary-light text-secondary text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-3">
                Featured
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                Available Right Now
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden sm:flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card">
                  <div className="h-44 bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(gear => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/browse">
              <Button variant="outline" className="w-full">
                View All Gear <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-primary via-secondary to-primary-dark">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 sm:gap-12">
          <StatItem value={stats.gear}      label="Gear Items"     />
          <StatItem value={stats.donations} label="Donations Made" />
          <StatItem value={stats.renters}   label="Active Renters" />
        </div>
      </section>

      {/* ── Volunteer CTA ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-3xl bg-accent-light text-accent flex items-center justify-center mx-auto mb-6 shadow-md">
            <Users size={36} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            Become a Volunteer
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Help us coordinate gear distribution in your city. Volunteers are the
            backbone of RainShare — join us on weekends, evenings, or whenever you can.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/volunteer/register">
              <Button size="lg" className="px-10 shadow-lg">
                <Heart size={18} className="mr-2" /> Join as Volunteer
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="px-10">
                Browse Gear First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <CloudRain size={24} className="text-primary" />
                RainShare
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                A community platform making rain gear accessible to everyone. Share the rain, spread the warmth.
              </p>
              <div className="flex gap-3 mt-6">
                {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                {['Browse Gear', 'Donate Gear', 'Volunteer', 'How It Works'].map(l => (
                  <li key={l}>
                    <Link to="/" className="hover:text-white transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} RainShare — Share the Rain, Spread the Warmth.
            </p>
            <div className="flex items-center gap-1 text-sm">
              <MapPin size={13} /> Made with ❤️ for rainy day communities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
