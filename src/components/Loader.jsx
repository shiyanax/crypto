import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-zinc-700" />
    </div>
  );
};

export default Loader;
