const Header = ({ top,  header, content }: { top: string; header: string; content: string }) => {
  return (
    <div className="mx-auto flex flex-col gap-8 justify-center items-center text-center">
      <div className="text-xs text-primary max-w-max rounded-2xl py-1 px-4 bg-primary-foreground hover:bg-primary-foreground border border-primary/10">
        {top}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-2xl lg:text-3xl">{header}</h1>
        <p className="text-sm xl:text-base">{content}</p>
      </div>
    </div>
  );
};
export default Header;
