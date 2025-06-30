const Header = ({ header, content }: { header: string; content: string }) => {
  return (
    <div className="mx-auto flex flex-col gap-5 text-center">
      <h1 className="font-medium text-xl lg:text-2xl">{header}</h1>
      <p className="text-sm 2xl:text-md">{content}</p>
    </div>
  );
};
export default Header;
