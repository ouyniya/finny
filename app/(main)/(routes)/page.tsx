import Hero from "@/components/main/Hero";
import { InView } from '@/components/ui/in-view';

export default async function Home() {
  return (
    <>
      <Hero />

        <InView
          variants={{
            hidden: {
              opacity: 0,
              y: 30,
              scale: 0.95,
              filter: 'blur(4px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          viewOptions={{ margin: '0px 0px -350px 0px' }}
        >
          <div className='max-w-96 bg-primary-foreground p-4'>
            <p>
              <strong className='font-medium text-zinc-900'>Athletics.</strong>{' '}
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
              Watch running, jumping, and throwing events. Athletes compete in
              fuga odit earum tempore accusantium blanditiis eius labore sequi pariatur quod libero 
            </p>
          </div>
        </InView>
     
      
        <InView
          variants={{
            hidden: {
              opacity: 0,
              x: 100,
            },
            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          viewOptions={{ margin: '0px 0px -350px 0px' }}
        >
          <div className='max-w-96 bg-zinc-900 p-4'>
            <p className='text-zinc-400'>
              <strong className='font-medium text-zinc-50'>Swimming.</strong>{' '}
              See swimmers race in water. They use different styles to swim fast
              and win medals.
            </p>
          </div>
        </InView>

      
        <InView
          variants={{
            hidden: {
              opacity: 0,
              scale: 1.5,
            },
            visible: {
              opacity: 1,
              scale: 1,
            },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          viewOptions={{ margin: '0px 0px -350px 0px' }}
        >
          <div className='max-w-96 bg-zinc-100 p-4'>
            <p className='text-zinc-600'>
              <strong className='font-medium'>Gymnastics.</strong> Gymnasts
              perform amazing flips and jumps. They show strength and balance in
              their routines.
            </p>
          </div>
        </InView>
    </>
  );
}
