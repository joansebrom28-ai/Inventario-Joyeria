import React, { useState } from 'react';
import {
  Diamond,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { formatCurrency } from '../utils/exportUtils';
import { ProductCategory } from '../types/jewelry';

interface ShowcaseWebsiteProps {
  onReturnToAdmin: () => void;
  onOpenCMS: () => void;
}

export const ShowcaseWebsite: React.FC<ShowcaseWebsiteProps> = ({
  onReturnToAdmin,
  onOpenCMS,
}) => {
  const { showcase, products, currentUser, theme, formatPrice, currency } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appointmentSent, setAppointmentSent] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    phone: '',
    date: '',
    piece: '',
    notes: '',
  });

  // Filter available products for public display (only items with stock)
  const displayProducts = products
    .filter((p) => p.stock > 0)
    .filter((p) => (selectedCategory === 'all' ? true : p.category === selectedCategory));

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSent(true);
    setTimeout(() => {
      // Create WhatsApp link
      const text = encodeURIComponent(
        `Hola ${showcase.storeName}, deseo agendar una cita privada.\nNombre: ${appointmentData.name}\nFecha deseada: ${appointmentData.date}\nPieza de interés: ${appointmentData.piece || 'Colección General'}\nNotas: ${appointmentData.notes}`
      );
      const cleanPhone = showcase.phoneWhatsApp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    }, 800);
  };

  const handleInquireWhatsApp = (productName: string, sku: string, price: number) => {
    const text = encodeURIComponent(
      `Hola ${showcase.storeName}, deseo consultar sobre la pieza: "${productName}" (Ref: ${sku}) con precio oficial de ${formatPrice(price)}. ¿Tienen disponibilidad para apreciarla en salón?`
    );
    const cleanPhone = showcase.phoneWhatsApp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className={`min-h-screen ${styles.bgMain} font-sans-luxury selection:bg-amber-500/20`}>
      {/* Top Banner Notice */}
      {showcase.showBanner && showcase.bannerNotice && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-neutral-950 font-semibold text-xs py-2 px-4 text-center tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showcase.bannerNotice}</span>
          </div>
        </div>
      )}

      {/* Public Storefront Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-amber-950 text-amber-400">
              <Diamond className="w-5 h-5" />
            </div>
            <div>
              <span className="font-luxury text-xl tracking-[0.25em] font-bold text-white uppercase block">
                {showcase.storeName}
              </span>
              <span className="text-[10px] tracking-widest text-amber-400 uppercase font-sans">
                {showcase.tagline}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase text-neutral-300">
            <a href="#coleccion" className="hover:text-amber-400 transition-colors">
              Colección
            </a>
            <a href="#atelier" className="hover:text-amber-400 transition-colors">
              El Atelier
            </a>
            <a href="#garantias" className="hover:text-amber-400 transition-colors">
              Certificaciones
            </a>
            <a href="#citas" className="hover:text-amber-400 transition-colors">
              Citas VIP
            </a>
          </nav>

          {/* Control bar buttons */}
          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenCMS}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all"
                title="Abrir editor CMS para modificar esta página"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Editar Web (CMS)</span>
              </button>
            )}

            <button
              onClick={onReturnToAdmin}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${styles.buttonPrimary}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Volver al Inventario</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={showcase.heroImage}
            alt="Alta Joyería"
            className="w-full h-full object-cover filter brightness-[0.38] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección de Alta Joyería & Bóveda Privada</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-luxury font-extrabold text-white tracking-tight leading-tight">
            {showcase.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed font-light">
            {showcase.heroSubtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#coleccion"
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold ${styles.buttonPrimary} flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40`}
            >
              <span>Ver Catálogo en Línea</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#citas"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold border border-neutral-600 bg-neutral-900/60 backdrop-blur-md text-neutral-200 hover:text-white hover:border-amber-400 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Agendar Cita Privada</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="border-y border-neutral-800 bg-neutral-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <ShieldCheck className="w-6 h-6 mx-auto text-amber-400 mb-2" />
            <h4 className="font-luxury font-bold text-xs uppercase tracking-wider text-neutral-100">
              Certificación GIA & IGI
            </h4>
            <p className="text-[11px] text-neutral-400">Diamantes trazables con garantía internacional</p>
          </div>

          <div className="space-y-1">
            <Award className="w-6 h-6 mx-auto text-amber-400 mb-2" />
            <h4 className="font-luxury font-bold text-xs uppercase tracking-wider text-neutral-100">
              Metales Nobles Puros
            </h4>
            <p className="text-[11px] text-neutral-400">Oro 18k, 24k ético y Platino 950 macizo</p>
          </div>

          <div className="space-y-1">
            <Sparkles className="w-6 h-6 mx-auto text-amber-400 mb-2" />
            <h4 className="font-luxury font-bold text-xs uppercase tracking-wider text-neutral-100">
              Diseño de Autor
            </h4>
            <p className="text-[11px] text-neutral-400">Piezas hechas a mano por maestros orfebres</p>
          </div>

          <div className="space-y-1">
            <Clock className="w-6 h-6 mx-auto text-amber-400 mb-2" />
            <h4 className="font-luxury font-bold text-xs uppercase tracking-wider text-neutral-100">
              Atención Personalizada
            </h4>
            <p className="text-[11px] text-neutral-400">Showroom VIP y asesoría gemológica privada</p>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="coleccion" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            Piezas Disponibles en Salón
          </span>
          <h2 className="text-3xl font-luxury font-bold text-white tracking-wide">
            Colección Selecta de Joyería Fina
          </h2>
          <p className="text-xs text-neutral-400">
            Cada creación refleja el equilibrio entre la pureza mineral y la maestría artesanal.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'Todas las Joyas' },
              { id: 'anillos', label: 'Anillos & Solitarios' },
              { id: 'collares', label: 'Collares & Gargantillas' },
              { id: 'pulseras', label: 'Pulseras Tennis' },
              { id: 'relojes', label: 'Relojes de Platino' },
              { id: 'aretes', label: 'Aretes & Perlas' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 overflow-hidden hover:border-amber-500/50 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-950">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    {product.metal}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/80 text-neutral-300 backdrop-blur-md">
                    {product.weightGrams}g {product.carat ? `• ${product.carat}ct` : ''}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-luxury font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-[11px] text-amber-500/80 font-mono mt-1">
                    Ref: {product.sku} • {product.certification}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono block">
                      Precio Oficial ({currency})
                    </span>
                    <span className="text-xl font-luxury font-bold text-amber-400">
                      {formatPrice(product.salePrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleInquireWhatsApp(product.name, product.sku, product.salePrice)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
                    title="Consultar disponibilidad por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Consultar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Atelier / Story Section */}
      <section id="atelier" className="py-20 bg-neutral-900/30 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                {showcase.aboutTitle}
              </span>
              <h2 className="text-3xl sm:text-4xl font-luxury font-bold text-white tracking-wide leading-tight">
                El Legado de la Alta Joyería Hecha a Mano
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {showcase.aboutText}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className="text-2xl font-luxury font-bold text-amber-400 block">+35</span>
                  <span className="text-xs text-neutral-400">Años de orfebrería de alta gama</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className="text-2xl font-luxury font-bold text-amber-400 block">100%</span>
                  <span className="text-xs text-neutral-400">Gemas éticas y certificadas</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                <img
                  src={showcase.aboutImage}
                  alt="Orfebrería en Taller"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <Diamond className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-xs font-luxury font-bold text-white">Atelier Privado AURA</p>
                    <p className="text-[11px] text-neutral-400 font-mono">Maestría artesanal en metales preciosos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment / Concierge Booking Section */}
      <section id="citas" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
              Experiencia Privada
            </span>
            <h2 className="text-3xl font-luxury font-bold text-white">
              Agende una Cita en Nuestro Salón Exclusivo
            </h2>
            <p className="text-xs text-neutral-300">
              Reserve una sesión privada con nuestro gemólogo jefe para diseñar su joya a medida o apreciar nuestra colección en un entorno de máxima discreción y seguridad.
            </p>
          </div>

          {appointmentSent ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3 max-w-lg mx-auto">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-luxury font-bold text-lg text-white">
                Solicitud Recibida con Distinción
              </h3>
              <p className="text-xs text-neutral-300">
                Nos comunicaremos con usted en los próximos minutos vía WhatsApp o llamada para confirmar el horario de su cita privada.
              </p>
              <button
                onClick={() => setAppointmentSent(false)}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-200 hover:text-white"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-300">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sr./Sra. Nombre y Apellidos"
                    value={appointmentData.name}
                    onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-300">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={appointmentData.phone}
                    onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-300">
                    Fecha Deseada
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-300">
                    Pieza o Servicio de Interés
                  </label>
                  <select
                    value={appointmentData.piece}
                    onChange={(e) => setAppointmentData({ ...appointmentData, piece: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Anillos de Compromiso">Anillos de Compromiso & Solitarios</option>
                    <option value="Collares de Esmeralda / Alta Joyería">Collares de Alta Gemología</option>
                    <option value="Relojería de Platino">Relojería de Platino & Colección</option>
                    <option value="Diseño de Joya a Medida">Diseño Personalizado a Medida</option>
                    <option value="Otra Consulta">Otra Consulta Especial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-300">
                  Peticiones Especiales (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre quilates deseados, presupuesto o asesoramiento específico"
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest ${styles.buttonPrimary} flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40`}
              >
                <Send className="w-4 h-4" />
                <span>Confirmar Solicitud de Cita VIP</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-luxury text-lg font-bold text-white tracking-widest uppercase block mb-2">
              {showcase.storeName}
            </span>
            <p className="text-neutral-400 leading-relaxed font-light text-xs">
              {showcase.tagline}
            </p>
            <p className="mt-3 text-[11px] text-neutral-500">
              © {new Date().getFullYear()} {showcase.storeName}. Todos los derechos reservados.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-luxury font-bold text-white uppercase tracking-wider text-xs mb-3">
              Información de Salón
            </h4>
            <div className="flex items-start gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{showcase.address}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{showcase.phoneWhatsApp}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{showcase.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-luxury font-bold text-white uppercase tracking-wider text-xs mb-3">
              Horario de Atención
            </h4>
            <div className="flex items-start gap-2 text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{showcase.schedule}</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onReturnToAdmin}
                className="text-xs text-amber-400 underline underline-offset-4 hover:text-amber-300"
              >
                Acceso al Sistema Interno de Inventario →
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
