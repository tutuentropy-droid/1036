import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import MisalignmentLadder from '@/components/MisalignmentLadder';
import Footer from '@/components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vhs-black relative overflow-hidden">
      <ScanlineOverlay />
      
      <div className="relative z-10">
        <Hero />
        <MovieGrid />

        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <button
              onClick={() => navigate('/hot-reviews')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-pixel text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)' }}
            >
              <Flame className="w-5 h-5 group-hover:animate-pulse" />
              进入热评墙
              <Flame className="w-5 h-5 group-hover:animate-pulse" />
            </button>
            <p className="font-terminal text-sm text-gray-500 mt-3">
              按点赞数排列所有电影的错位短评
            </p>
          </div>
        </section>

        <MisalignmentLadder />
        <Footer />
      </div>
    </div>
  );
}
