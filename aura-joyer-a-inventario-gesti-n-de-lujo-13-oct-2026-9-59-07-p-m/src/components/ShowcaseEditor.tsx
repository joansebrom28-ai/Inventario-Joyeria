import React, { useState } from 'react';
import {
  Globe,
  Save,
  RotateCcw,
  Eye,
  Sparkles,
  Lock,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { INITIAL_SHOWCASE } from '../data/initialData';

interface ShowcaseEditorProps {
  onPreviewPublicSite: () => void;
}

const HERO_IMAGE_PRESETS = [
  { label: 'Diamante en Bóveda', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Taller de Orfebre Suizo', url: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Exhibición de Lujo', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Salón Noble de Joyas', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=85' },
];

export const ShowcaseEditor: React.FC<ShowcaseEditorProps> = ({ onPreviewPublicSite }) => {
  const { showcase, updateShowcase, currentUser, theme } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [formData, setFormData] = useState(showcase);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If standard user, show locked message
  if (!currentUser.permissions.canEditShowcaseWebsite) {
    return (
      <div className={`p-8 rounded-2xl border text-center space-y-3 ${styles.bgCard}`}>
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-luxury font-bold">
          Acceso Restringido a Administradores
        </h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          El usuario actual <strong>{currentUser.name}</strong> tiene permisos de <em>{currentUser.roleTitle}</em> (estándar). Solo el usuario administrativo puede modificar los textos, imágenes e identidad de la página web de presentación.
        </p>
        <p className="text-xs text-amber-400/90 font-mono">
          Puede cambiar a Usuario Administrador desde el menú superior para realizar modificaciones.
        </p>
      </div>
    );
  }

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShowcase(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer la configuración de la web a los valores iniciales de fábrica?')) {
      setFormData(INITIAL_SHOWCASE);
      updateShowcase(INITIAL_SHOWCASE);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badgeAccent}`}>
              CMS • Editor de Contenido Web
            </span>
          </div>
          <h1 className="text-2xl font-luxury font-bold tracking-tight">
            Personalizar Página Web de Presentación
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${styles.textMuted}`}>
            Modifique en tiempo real los textos, banners de promoción, datos de contacto e imágenes de la vitrina digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreviewPublicSite}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-500 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Web en Vivo</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Cambios guardados con éxito! Los visitantes de la web verán los nuevos contenidos de inmediato.</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Brand & Announcement */}
        <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
          <h2 className="text-base font-luxury font-bold flex items-center gap-2 text-amber-400">
            <Sparkles className="w-4 h-4" />
            1. Identidad de Marca & Barra de Anuncios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Nombre Comercial de la Joyería
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Slogan / Tagline
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-400">
                Barra de Aviso / Promoción Superior
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showBanner}
                  onChange={(e) => handleChange('showBanner', e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
                />
                <span>Mostrar barra dorada superior</span>
              </label>
            </div>
            <input
              type="text"
              value={formData.bannerNotice}
              onChange={(e) => handleChange('bannerNotice', e.target.value)}
              placeholder="Ej. Nueva Colección Otoño-Invierno 2026 disponible..."
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
            />
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
          <h2 className="text-base font-luxury font-bold flex items-center gap-2 text-amber-400">
            <Globe className="w-4 h-4" />
            2. Portada Principal (Hero Banner)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Título Principal de la Portada
              </label>
              <input
                type="text"
                required
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Subtítulo / Manifiesto de Lujo
              </label>
              <textarea
                rows={2}
                required
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Imagen de Fondo de Portada (URL)
                </label>
                <span className="text-[11px] text-neutral-500">Presets disponibles:</span>
              </div>
              <input
                type="url"
                required
                value={formData.heroImage}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {HERO_IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleChange('heroImage', p.url)}
                    className={`text-[10px] px-2.5 py-1 rounded border transition-colors ${
                      formData.heroImage === p.url
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Story & Atelier */}
        <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
          <h2 className="text-base font-luxury font-bold flex items-center gap-2 text-amber-400">
            <Sparkles className="w-4 h-4" />
            3. Sección "El Atelier & Nuestra Historia"
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Título de la Sección de Orfebrería
              </label>
              <input
                type="text"
                required
                value={formData.aboutTitle}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Narrativa del Taller & Filosofía de Calidad
              </label>
              <textarea
                rows={3}
                required
                value={formData.aboutText}
                onChange={(e) => handleChange('aboutText', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Fotografía del Taller / Artesano (URL)
              </label>
              <input
                type="url"
                required
                value={formData.aboutImage}
                onChange={(e) => handleChange('aboutImage', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Concierge */}
        <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
          <h2 className="text-base font-luxury font-bold flex items-center gap-2 text-amber-400">
            <Globe className="w-4 h-4" />
            4. Canales de Contacto, Salón & WhatsApp
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Teléfono Directo / WhatsApp Oficial
              </label>
              <input
                type="text"
                required
                value={formData.phoneWhatsApp}
                onChange={(e) => handleChange('phoneWhatsApp', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Correo Concierge / Atención VIP
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Dirección del Showroom / Joyería
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Horario de Atención y Citas
              </label>
              <input
                type="text"
                required
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Textos Iniciales</span>
          </button>

          <button
            type="submit"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold ${styles.buttonPrimary} shadow-lg`}
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios en la Web</span>
          </button>
        </div>
      </form>
    </div>
  );
};
