import notfound from "@/assets/lotti/404.json";
import Lottie from "lottie-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[50%]">
        <Lottie animationData={notfound} />
      </div>
    </div>
  );
}
