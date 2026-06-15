import ScanlineOverlay from '@/components/ScanlineOverlay';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-vhs-black relative overflow-hidden">
      <ScanlineOverlay />
      
      <div className="relative z-10">
        <Hero />
        <MovieGrid />
        <Footer />
      </div>
    </div>
  );
}
