export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full flex items-center justify-center">{children}</div>
      <div className="h-full w-full position absolute overflow-hidden top-0 left-0 -z-50">
      <div className="absolute h-full w-full bg-slate-950 -z-50"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div></div>
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
          <div className="absolute left-[50%] size-100 rounded-full bg-radial from-teal-300/20 from-40% to-indigo-900/50 mix-blend-soft-light filter blur-xl animate-moveInCircle origin-center"></div>
          <div className="absolute left-[20%] size-200 rounded-full bg-radial from-sky-300/20 from-40% to-sky-900/50 mix-blend-soft-light filter blur-xl animate-moveVertical origin-center"></div>
          <div className="absolute left-[20%] top-[50%] size-80 rounded-full bg-radial from-slate-400/50 from-40% to-indigo-900/50 mix-blend-soft-light filter blur-xl animate-moveVertical origin-center"></div>
          <div className="absolute left-[70%] top-[65%] size-25 rounded-full bg-radial from-indigo-200/50 from-40% to-indigo-900/50 mix-blend-soft-light filter blur-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
