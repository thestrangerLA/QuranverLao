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

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        // Using English translation (ID 20 - Saheeh International)
        const data = await getSurahVerses(surah.id, 20);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-emerald-600 font-medium">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="sticky top-0 z-10 bg-app-background/80 backdrop-blur-md py-4 -mx-4 px-4 flex items-center justify-between border-b border-app-border">
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
        <div className="w-10" /> {/* Spacer */}
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
        {verses.map((verse) => (
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
              <div className="flex-1 text-right">
                <p className="arabic-text text-3xl leading-[2.5] text-app-foreground">
                  {verse.text_uthmani}
                </p>
              </div>
            </div>
            <div className="pl-14 space-y-3">
              <p className="text-app-foreground leading-relaxed text-lg font-medium opacity-90">
                {laoTranslations[surah.id] && laoTranslations[surah.id][verse.verse_number - 1] 
                  ? laoTranslations[surah.id][verse.verse_number - 1]
                  : (verse.translations && verse.translations[0] 
                      ? verse.translations[0].text.replace(/<[^>]*>?/gm, '')
                      : 'Translation not available')}
              </p>
              {laoTranslations[surah.id] && (
                <p className="text-muted text-sm italic opacity-70">
                  {verse.translations && verse.translations[0] 
                    ? verse.translations[0].text.replace(/<[^>]*>?/gm, '')
                    : ''}
                </p>
              )}
            </div>
            <div className="mt-12 h-px bg-app-border w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
