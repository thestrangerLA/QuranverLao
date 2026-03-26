import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { getSurahVerses } from '../services/quranApi';
import { Surah, Verse } from '../types';
import { laoTranslations } from '../data/laoTranslations';

interface SurahDetailProps {
  surah: Surah;
  onBack: () => void;
}

export const SurahDetail: React.FC<SurahDetailProps> = ({ surah, onBack }) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArabic, setShowArabic] = useState(false);
  const [showLao, setShowLao] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showThai, setShowThai] = useState(false);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        // Using English (ID 20) and Thai (ID 51) translations
        const data = await getSurahVerses(surah.id, '20,51');
        setVerses(data);
      } catch (error) {
        console.error('Error fetching verses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVerses();
    window.scrollTo(0, 0);
  }, [surah.id]);

  const filteredVerses = verses.filter(verse => {
    const query = searchQuery.toLowerCase();
    const laoText = laoTranslations[surah.id]?.[verse.verse_number - 1] || '';
    const engText = verse.translations?.find(t => t.resource_id === 20)?.text.replace(/<[^>]*>?/gm, '') || '';
    const thaiText = verse.translations?.find(t => t.resource_id === 51)?.text.replace(/<[^>]*>?/gm, '') || '';
    
    return (
      verse.verse_number.toString().includes(query) ||
      verse.text_uthmani.includes(query) ||
      laoText.toLowerCase().includes(query) ||
      engText.toLowerCase().includes(query) ||
      thaiText.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-emerald-600 font-medium">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="sticky top-0 z-10 bg-app-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-app-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors text-emerald-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="font-bold">{surah.name_simple}</h2>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
              {surah.revelation_place === 'makkah' ? 'MAKKAH' : 'MADINAH'} • {surah.verses_count} VERSES
            </p>
          </div>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search verses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-card border border-app-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <ToggleButton active={showArabic} onClick={() => setShowArabic(!showArabic)} label="Arabic" />
            <ToggleButton active={showLao} onClick={() => setShowLao(!showLao)} label="Lao" />
            <ToggleButton active={showEnglish} onClick={() => setShowEnglish(!showEnglish)} label="English" />
            <ToggleButton active={showThai} onClick={() => setShowThai(!showThai)} label="Thai" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-white shadow-xl shadow-emerald-200 dark:shadow-none"
      >
        <div className="relative z-10 text-center space-y-4">
          <div className="arabic-text text-5xl mb-2">{surah.name_arabic}</div>
          <div className="h-px bg-white/20 w-24 mx-auto" />
          <p className="text-emerald-100 font-medium italic">
            {surah.translated_name?.name}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full -ml-12 -mb-12 blur-xl" />
      </motion.div>

      {surah.id !== 1 && surah.id !== 9 && (
        <div className="text-center py-8">
          <div className="arabic-text text-3xl text-emerald-600">
            بِسْمِ اللَّهِ الرَّحْمَٰນِ الرَّحِيمِ
          </div>
          <p className="text-muted text-sm mt-2">In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>
      )}

      <div className="space-y-12">
        {filteredVerses.length > 0 ? (
          filteredVerses.map((verse) => (
            <motion.div
              key={verse.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-app-border flex items-center justify-center text-xs font-bold text-emerald-600 bg-app-card">
                  {verse.verse_number}
                </div>
                {showArabic && (
                  <div className="flex-1 text-right">
                    <p className="arabic-text text-3xl leading-[2.5] text-app-foreground">
                      {highlightText(verse.text_uthmani, searchQuery)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pl-14 space-y-4">
                {showLao && (
                  <p className="text-app-foreground leading-relaxed text-lg font-medium opacity-90">
                    {laoTranslations[surah.id] && laoTranslations[surah.id][verse.verse_number - 1] 
                      ? highlightText(laoTranslations[surah.id][verse.verse_number - 1], searchQuery)
                      : 'Lao translation not available'}
                  </p>
                )}
                {showEnglish && (
                  <p className="text-muted text-sm italic opacity-70">
                    {verse.translations?.find(t => t.resource_id === 20)
                      ? highlightText(verse.translations.find(t => t.resource_id === 20)!.text.replace(/<[^>]*>?/gm, ''), searchQuery)
                      : 'English translation not available'}
                  </p>
                )}
                {showThai && (
                  <p className="text-muted text-sm italic opacity-70">
                    {verse.translations?.find(t => t.resource_id === 51)
                      ? highlightText(verse.translations.find(t => t.resource_id === 51)!.text.replace(/<[^>]*>?/gm, ''), searchQuery)
                      : 'Thai translation not available'}
                  </p>
                )}
              </div>
              <div className="mt-12 border-b border-app-border w-full opacity-50" />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-muted">
            <p>No verses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
      active 
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none' 
        : 'bg-app-card text-muted border border-app-border hover:border-emerald-500/50'
    }`}
  >
    {label}
  </button>
);
