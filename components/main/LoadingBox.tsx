import Loading from "@/app/loading";

const LoadingBox = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mx-auto">
      <div className="loader  opacity-50"></div>
      <Loading cn="w-full max-h-[50px]" />
    </div>
  );
};
export default LoadingBox;
