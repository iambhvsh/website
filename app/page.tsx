import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-4xl sm:text-8xl font-bold mb-6">
        Bhavesh Patil
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px]">
        Hey there! I&apos;m Bhavesh Patil, the web wizard from Chatrapati Sambhajinagar, currently battling the dragons of a BSC in IT at MGM&apos;s Dr. G. Y. Pathrikar. Based in India, I brew web applications like a caffeinated barista. As an introvert, I thrive in my code cave, enjoying the silent symphonies of coding, music, and horror stories.
      </p>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Skills & Technologies
        </h2>
        <div className="flex justify-center">
          <img src="https://skillicons.dev/icons?i=html,css,js,bootstrap,tailwindcss,c,md,react,next,ts&theme=light&perline=5" alt="Languages" />
        </div>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Projects
        </h2>
        <div className="grid gap-8">
          <div>
            <h3 className="text-2xl sm:text-4xl font-bold mb-2">
              1. 🛍️ ThePixelStore
            </h3>
            <p className="text-lg sm:text-2xl mb-2">
              <strong>Description:</strong> An app store inspired by the iOS App Store. Browse apps like a pro, with reviews and everything.
            </p>
            <p className="text-lg sm:text-2xl mb-2">
              <strong>Technologies:</strong> <img src="https://skillicons.dev/icons?i=react&theme=light" alt="React" className="inline-block" />
            </p>
            <p className="text-lg sm:text-2xl">
              <strong><Link href="https://thepixelstore.vercel.app" target="_blank" className="underline">Live Preview ⟩</Link></strong>
            </p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-4xl font-bold mb-2">
              2. 🎥 DarkValor
            </h3>
            <p className="text-lg sm:text-2xl mb-2">
              <strong>Description:</strong> This project is a sleek and minimalist YouTube client, developed using HTML, Tailwind CSS, and JavaScript. It leverages the Invidious API to provide a seamless and privacy-focused video browsing experience.
            </p>
            <p className="text-lg sm:text-2xl mb-2">
              <strong>Technologies:</strong> <img src="https://skillicons.dev/icons?i=html,tailwind,js&theme=light" alt="HTML, Tailwind CSS, JavaScript" className="inline-block" />
            </p>
            <p className="text-lg sm:text-2xl">
              <strong><Link href="https://darkvalor.vercel.app" target="_blank" className="underline">Live Preview ⟩</Link></strong>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          GitHub Stats & Badges
        </h2>
        <div className="flex flex-col items-center">
          <img src="https://github-readme-stats.vercel.app/api?username=iambhvsh&show_icons=true&theme=radical" alt="GitHub Stats" className="mb-4"/>
          <img src="https://github-readme-streak-stats.herokuapp.com/?user=iambhvsh&theme=radical" alt="GitHub Streak"/>
        </div>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Goals
        </h2>
        <p className="text-lg sm:text-2xl">
          Master frontend development and modern tech, Contribute to open-source, Keep up with tech trends, Launch personal projects, Dive into backend development, Tackle coding challenges, Network with tech pros.
        </p>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Bucket List
        </h2>
        <p className="text-lg sm:text-2xl mb-2">
          <strong>Languages to Learn:</strong> 
          <img src="https://skillicons.dev/icons?i=c,cpp,swift,python&theme=light&perline=4" alt="C, C++, Swift, Python" className="inline-block"/>
        </p>
        <p className="text-lg sm:text-2xl mb-2">
          <strong>Technologies to Master:</strong> 
          <img src="https://skillicons.dev/icons?i=next,react&theme=light&perline=2" alt="Next.js, React.js" className="inline-block"/>
        </p>
        <p className="text-lg sm:text-2xl">
          Other Goals: Publish open-source stuff, Play with Node.js and databases, Create a tech blog, Study system design, Contribute to documentation and tutorials, Learn and implement security practices, Try out different state management libraries, Containerize everything with Docker, Build super interactive user experiences, Optimize web performance, Study microservices architecture, Build and deploy multi-platform apps, Master advanced debugging, Help build tools and frameworks for other developers.
        </p>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Contact Me
        </h2>
        <p className="text-lg sm:text-2xl">
          Email: <Link href="mailto:iambhvshh@outlook.com" className="underline">iambhvshh@outlook.com</Link><br />
          GitHub: <Link href="https://github.com/iambhvsh" target="_blank" className="underline">iambhvsh</Link>
        </p>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Education
        </h2>
        <p className="text-lg sm:text-2xl">
          BSC in IT from MGM&apos;s Dr. G. Y. Pathrikar, Chatrapati Sambhajinagar<br />
          SSC from MIT-VGS, Chatrapati Sambhajinagar<br />
          HSC from DES Highschool, Dharangaon, Malkapur, Buldhana
        </p>
      </div>
      <div className="mb-8 sm:text-xl max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          Let’s Connect
        </h2>
        <p className="text-lg sm:text-2xl">
          Always up for a chat about tech, collaboration, or horror stories. Hit me up!
        </p>
      </div>
      <div className="flex items-center justify-center mt-8">
        <Link
          href={`/docs/${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6 rounded-full", size: "lg" })}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
