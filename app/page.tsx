import { HeroSection } from '@/components/hero-section';
import { Features } from '@/components/features';
import { Pricing } from '@/components/pricing';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroSection />
      <Features />
      <Pricing />
    </div>
  );
}