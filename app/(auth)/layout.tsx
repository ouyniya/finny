export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex items-center justify-center">{children}</div>
      <div className="h-full w-full position absolute overflow-hidden top-0 left-0 bg-radial-[at_50%_75%] from-indigo-950  to-slate-950 to-90% -z-50">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="w-[100%] h-[100%]">
          <div className="absolute left-[50%] size-100 rounded-full bg-radial from-teal-300/100 from-40% to-indigo-900/100 mix-blend-soft-light filter blur-xl animate-moveInCircle origin-center"></div>
          <div className="absolute left-[20%] size-200 rounded-full bg-radial from-sky-300/50 from-40% to-sky-900/50 mix-blend-soft-light filter blur-xl animate-moveVertical origin-center"></div>
          <div className="absolute left-[20%] top-[50%] size-80 rounded-full bg-radial from-pink-400 from-40% to-indigo-900 mix-blend-soft-light filter blur-xl animate-moveVertical origin-center"></div>
          <div className="absolute left-[70%] top-[65%] size-25 rounded-full bg-radial from-indigo-200 from-40% to-indigo-900 mix-blend-soft-light filter blur-xl animate-pulse"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>
    </div>
  );
}
