import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { ArrowRight } from 'lucide-react';

export function GlowEffectButton({children}: React.PropsWithChildren) {
  return (
    <div className='relative max-w-max'>
      <GlowEffect
        colors={['#33ffbd', '#33FF57', '#3357FF', '#95a8ff']}
        mode='colorShift'
        blur='soft'
        duration={3}
        scale={0.9}
      />
      <button className='relative inline-flex items-center gap-1 rounded-xl bg-zinc-950 px-5 py-2 text-lg text-zinc-50 outline outline-[#fff2f21f] hover:cursor-pointer'>
        {children} <ArrowRight className='h4 w-4' />
      </button>
    </div>
  );
}
