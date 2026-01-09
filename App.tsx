
import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Twitter, 
  ChevronRight, 
  Star, 
  Menu as MenuIcon, 
  X,
  Award,
  Users,
  Utensils
} from 'lucide-react';

// --- Helper Components ---

const CountUp = ({ end, duration = 2000 }: { end: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const targetNumber = parseInt(end.replace(/\D/g, ''));
  const suffix = end.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = targetNumber / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, targetNumber, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Reveal = ({ children, direction = 'up', delay = 0 }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right', delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'left': return 'translateX(-40px)';
      case 'right': return 'translateX(40px)';
      default: return 'translateY(40px)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-coffee-900/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-gold rounded-full group-hover:rotate-12 transition-transform duration-500">
            <Coffee className="text-coffee-900" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">ESPRESSO <span className="text-gold">HAVEN</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-coffee-100 hover:text-gold transition-colors tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-gold hover:bg-gold-dark text-coffee-900 px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-gold/10">
            BOOK A TABLE
          </button>
        </div>

        <button 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-coffee-800 border-t border-coffee-700 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100 visible py-8 px-6' : 'max-h-0 opacity-0 invisible py-0 px-6'
        }`}
      >
        <div className="flex flex-col gap-6">
          {navLinks.map((link, index) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-xl font-medium text-white hover:text-gold transition-all duration-200 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-4'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className={`pt-4 transition-all duration-300 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <button className="w-full bg-gold text-coffee-900 py-4 rounded-xl font-bold shadow-xl shadow-gold/20">
              BOOK A TABLE
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000" 
          alt="Coffee shop interior" 
          className="w-full h-full object-cover opacity-40 scale-110 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-coffee-900/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <div className="inline-block px-4 py-1 border border-gold/30 rounded-full mb-6 bg-gold/10 backdrop-blur-sm animate-fade-in-up">
          <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">Artisan Coffee Roasters</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
          Crafting the Perfect <span className="text-gold italic">Moment</span>
        </h1>
        <p className="text-lg md:text-xl text-coffee-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-300">
          Experience the deep, rich flavors of sustainably sourced beans, roasted to perfection in our cozy corner of the city.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
          <button className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-coffee-900 px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/20 animate-gentle-bounce">
            Discover Our Menu <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto border border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg transition-all animate-gentle-bounce delay-100">
            Our Story
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 rounded-full bg-gold/30 flex items-start justify-center">
          <div className="w-1 h-3 bg-gold rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const stats = [
    { icon: <Award className="text-gold" size={28} />, label: 'Awards Won', value: '12+' },
    { icon: <Users className="text-gold" size={28} />, label: 'Daily Guests', value: '500+' },
    { icon: <Utensils className="text-gold" size={28} />, label: 'Menu Items', value: '45+' },
  ];

  return (
    <section id="about" className="py-32 bg-coffee-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <Reveal direction="left">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-gold z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-gold z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800" 
                alt="Barista at work" 
                className="rounded-lg shadow-2xl relative z-0"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-coffee-900/80 backdrop-blur-md p-8 rounded-lg border border-gold/20 hidden md:block">
                <p className="text-gold text-4xl font-bold mb-1">10</p>
                <p className="text-white uppercase text-xs tracking-widest">Years of Excellence</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal direction="right">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Passionate Roasting, <br/>Expertly Poured.</h2>
              <p className="text-coffee-300 text-lg mb-8 leading-relaxed">
                Founded in 2014, Espresso Haven began with a simple mission: to elevate the daily coffee ritual into an extraordinary experience. We source only the highest grade Arabica beans.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mt-12">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <p className="text-white text-3xl font-bold mb-1">
                      <CountUp end={stat.value} />
                    </p>
                    <p className="text-coffee-400 text-[11px] uppercase tracking-widest font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState('coffee');

  const menuItems = {
    coffee: [
      { name: 'Classic Espresso', price: '$3.50', desc: 'Single shot of our signature house blend.' },
      { name: 'Caffè Latte', price: '$4.50', desc: 'Espresso with steamed milk and light foam.' },
      { name: 'Cappuccino', price: '$4.50', desc: 'Equal parts espresso, steamed milk, and foam.' },
      { name: 'Caramel Macchiato', price: '$5.25', desc: 'Espresso with vanilla syrup, milk, and caramel.' },
      { name: 'Flat White', price: '$4.75', desc: 'Micro-foamed milk poured over double espresso.' },
      { name: 'Mocha Fusion', price: '$5.50', desc: 'Espresso with bittersweet chocolate and milk.' },
    ],
    pastries: [
      { name: 'Almond Croissant', price: '$4.25', desc: 'Buttery, flaky pastry with almond cream.' },
      { name: 'Blueberry Scone', price: '$3.75', desc: 'Freshly baked with local blueberries.' },
      { name: 'Dark Choco Muffin', price: '$3.50', desc: 'Rich chocolate muffin with Belgian chips.' },
    ],
    seasonal: [
      { name: 'Pumpkin Spice Latte', price: '$5.95', desc: 'The autumn classic with real pumpkin.' },
      { name: 'Honey Lavender Latte', price: '$5.95', desc: 'Infused with organic lavender buds.' },
    ]
  };

  return (
    <section id="menu" className="py-24 bg-coffee-900">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal direction="up">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Selection</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Our Signature Menu</h2>
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {Object.keys(menuItems).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-gold text-coffee-900 shadow-lg shadow-gold/20 scale-105' : 'bg-transparent text-white border border-white/10 hover:border-gold/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {menuItems[activeTab as keyof typeof menuItems].map((item, i) => (
            <Reveal key={`${activeTab}-${i}`} direction="up" delay={i * 100}>
              <div className="group p-6 rounded-xl border border-white/5 hover:border-gold/30 hover:bg-white/[0.02] transition-all">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{item.name}</h3>
                  <div className="flex-1 border-b border-white/10 mx-4 border-dotted"></div>
                  <span className="text-gold font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-coffee-400 text-sm italic">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: 'Sarah Jenkins', role: 'Food Critic', text: 'The best espresso in the city, bar none. The atmosphere is sophisticated yet warm.', rating: 5 },
    { name: 'Marcus Chen', role: 'Regular Guest', text: 'I come here every morning for my Flat White. The baristas are true artists.', rating: 5 },
    { name: 'Elena Rodriguez', role: 'Designer', text: 'A perfect place to work or meet friends. The Honey Lavender Latte is a must-try!', rating: 4 },
  ];

  return (
    <section id="testimonials" className="py-32 bg-coffee-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal direction="up">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What Our Guests Say</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Reveal key={i} direction="up" delay={i * 200}>
              <div className="bg-coffee-900 p-10 rounded-2xl border border-white/5 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className={j < review.rating ? 'fill-gold text-gold' : 'text-coffee-700'} />
                  ))}
                </div>
                <p className="text-coffee-200 text-lg italic mb-8 leading-relaxed">"{review.text}"</p>
                <div>
                  <p className="text-white font-bold">{review.name}</p>
                  <p className="text-gold text-xs uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-coffee-900 pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal direction="up">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gold rounded-full">
                  <Coffee className="text-coffee-900" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tighter text-white uppercase">ESPRESSO <span className="text-gold">HAVEN</span></span>
              </div>
              <p className="text-coffee-400 leading-relaxed">
                Your neighborhood sanctuary for premium coffee and artisanal treats. Quality and community in every cup.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-coffee-900 transition-all transform hover:rotate-12">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Visit Us</h4>
              <ul className="space-y-4 text-coffee-400">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-gold shrink-0" />
                  <span className="text-sm">123 Roast Master Blvd,<br/>New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-gold shrink-0" />
                  <span className="text-sm">+1 (555) 987-6543</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Opening Hours</h4>
              <ul className="space-y-4 text-coffee-400">
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="font-bold text-coffee-200 text-sm">Mon - Fri</p>
                    <p className="text-[10px] uppercase tracking-wider">07:00 AM - 08:00 PM</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="font-bold text-coffee-200 text-sm">Sat - Sun</p>
                    <p className="text-[10px] uppercase tracking-wider">08:00 AM - 09:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Newsletter</h4>
              <p className="text-coffee-400 text-xs mb-4">Join our community for brewing tips and exclusive offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-gold transition-colors text-white text-sm"
                />
                <button className="bg-gold text-coffee-900 px-4 py-2 rounded-r-lg font-bold hover:bg-gold-dark transition-colors text-xs">
                  JOIN
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="pt-8 border-t border-white/5 text-center md:flex md:justify-between items-center text-coffee-500 text-[10px] uppercase tracking-[0.1em]">
          <p>© 2026 Espresso Haven. All rights reserved. Created by RashedDevX</p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-gold selection:text-coffee-900">
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default App;
