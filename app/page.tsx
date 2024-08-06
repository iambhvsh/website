import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <h1 className="text-3xl font-bold mb-4 sm:text-7xl">
        Bhavesh Patil
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
      Hello! I am a Frontend Web Developer. This is not just any documentation site—here, you'll find a wealth of important information and insights. 🌟
      </p>
      <div className="flex items-center justify-center">
        <Link
          href={`/docs/${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
