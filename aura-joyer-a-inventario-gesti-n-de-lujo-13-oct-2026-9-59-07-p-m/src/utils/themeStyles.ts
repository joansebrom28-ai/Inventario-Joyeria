import { AccentColor, ThemeMode } from '../types/jewelry';

export function getThemeClasses(mode: ThemeMode, accent: AccentColor) {
  const isDark = mode === 'dark';

  // Base background & cards
  const bgMain = isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-[#faf8f5] text-stone-900';
  const bgCard = isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-stone-200 shadow-sm';
  const bgCardHover = isDark ? 'hover:border-neutral-700' : 'hover:border-stone-300';
  const textMuted = isDark ? 'text-neutral-400' : 'text-stone-500';
  const textSubtle = isDark ? 'text-neutral-500' : 'text-stone-400';
  const borderSubtle = isDark ? 'border-neutral-800' : 'border-stone-200';
  const inputBg = isDark 
    ? 'bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500/60'
    : 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-stone-600';

  // Accent specific classes
  let accentName = 'Dorado Imperial';
  let accentHex = '#D4AF37';
  let badgeAccent = 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
  let textAccent = 'text-amber-400';
  let borderAccent = 'border-amber-500/40';
  let bgAccentGlow = 'from-amber-500/10 via-amber-500/5 to-transparent';
  let buttonPrimary = 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 font-semibold shadow-md shadow-amber-950/30 hover:brightness-110 active:scale-[0.98] transition-all';
  let buttonOutline = isDark 
    ? 'border border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
    : 'border border-amber-600/50 text-amber-700 hover:bg-amber-50';
  let ringAccent = 'focus:ring-2 focus:ring-amber-500/50';

  if (accent === 'silver') {
    accentName = 'Plateado Platino';
    accentHex = '#CBD5E1';
    badgeAccent = isDark 
      ? 'bg-slate-300/15 text-slate-200 border border-slate-400/30'
      : 'bg-slate-100 text-slate-800 border border-slate-300';
    textAccent = isDark ? 'text-slate-200' : 'text-slate-800';
    borderAccent = 'border-slate-400/40';
    bgAccentGlow = 'from-slate-400/10 via-slate-400/5 to-transparent';
    buttonPrimary = 'bg-gradient-to-r from-slate-200 via-white to-slate-300 text-neutral-950 font-semibold shadow-md shadow-slate-900/20 hover:brightness-105 active:scale-[0.98] transition-all';
    buttonOutline = isDark 
      ? 'border border-slate-400/40 text-slate-200 hover:bg-slate-400/10'
      : 'border border-slate-400 text-slate-800 hover:bg-slate-100';
    ringAccent = 'focus:ring-2 focus:ring-slate-300/50';
  } else if (accent === 'copper') {
    accentName = 'Cobre / Oro Rosa';
    accentHex = '#E07A5F';
    badgeAccent = isDark 
      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
      : 'bg-rose-50 text-rose-800 border border-rose-300';
    textAccent = isDark ? 'text-[#E07A5F]' : 'text-[#C25B3F]';
    borderAccent = 'border-[#E07A5F]/40';
    bgAccentGlow = 'from-[#E07A5F]/10 via-[#E07A5F]/5 to-transparent';
    buttonPrimary = 'bg-gradient-to-r from-[#D96B50] via-[#E07A5F] to-[#CD7F32] text-neutral-950 font-semibold shadow-md shadow-rose-950/30 hover:brightness-110 active:scale-[0.98] transition-all';
    buttonOutline = isDark 
      ? 'border border-[#E07A5F]/40 text-[#E07A5F] hover:bg-[#E07A5F]/10'
      : 'border border-[#C25B3F]/50 text-[#C25B3F] hover:bg-rose-50';
    ringAccent = 'focus:ring-2 focus:ring-[#E07A5F]/50';
  }

  return {
    isDark,
    accentName,
    accentHex,
    bgMain,
    bgCard,
    bgCardHover,
    textMuted,
    textSubtle,
    borderSubtle,
    inputBg,
    badgeAccent,
    textAccent,
    borderAccent,
    bgAccentGlow,
    buttonPrimary,
    buttonOutline,
    ringAccent,
  };
}
