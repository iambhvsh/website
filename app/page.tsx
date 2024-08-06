import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <h1 className="text-3xl font-bold mb-4 sm:text-7xl">
        Bhavesh Patil
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        Hey there! I&apos;m Bhavesh Patil, the web wizard from Chatrapati Sambhajinagar, currently battling the dragons of a BSC in IT at MGM&apos;s Dr. G. Y. Pathrikar. Based in India, I brew web applications like a caffeinated barista. As an introvert, I thrive in my code cave, enjoying the silent symphonies of coding, music, and horror stories.
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Skills & Technologies</strong>
      </p>
      <div className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground text-center">
        <Image src="https://skillicons.dev/icons?i=html,css,js,bootstrap,tailwindcss,c,md,react,next,ts&theme=light&perline=5" alt="Languages" height="300" width="300" />
      </div>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Projects & Experience</strong>
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        🛍️ <Link href="https://thepixelstore.vercel.app" target="_blank">ThePixelStore</Link>: An app store inspired by the iOS App Store. (React, Framework7)<br />
        🎥 <Link href="https://darkvalor.vercel.app" target="_blank">DarkValor</Link>: A YouTube client that&apos;s super minimal. (HTML, Tailwind CSS, JavaScript)<br />
        🔍 <Link href="https://stackx.vercel.app" target="_blank">StackX</Link>: Google&apos;s search engine, my way. (HTML, CSS, JavaScript)<br />
        📖 <Link href="https://forwordin.vercel.app" target="_blank">ForWord</Link>: A dictionary app. (Ionic React)<br />
        🌾 <Link href="https://sanjaypatil.vercel.app" target="_blank">Sanjay Patil&apos;s Website</Link>: My dad&apos;s website. (Information about fertilizers)
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>GitHub Stats & Badges</strong><br />
        Check out my GitHub bling:
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Goals</strong><br />
        Master frontend development and modern tech, Contribute to open-source, Keep up with tech trends, Launch personal projects, Dive into backend development, Tackle coding challenges, Network with tech pros.
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Bucket List</strong><br />
        Languages to Learn: C, C++, Swift, Python<br />
        Technologies to Master: Next.js, React.js<br />
        Other Goals: Publish open-source stuff, Play with Node.js and databases, Create a tech blog, Study system design, Contribute to documentation and tutorials, Learn and implement security practices, Try out different state management libraries, Containerize everything with Docker, Build super interactive user experiences, Optimize web performance, Study microservices architecture, Build and deploy multi-platform apps, Master advanced debugging, Help build tools and frameworks for other developers.
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Contact Me</strong><br />
        Email: <Link href="mailto:iambhvshh@outlook.com">iambhvshh@outlook.com</Link><br />
        GitHub: <Link href="https://github.com/iambhvsh" target="_blank">iambhvsh</Link>
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Education</strong><br />
        BSC in IT from MGM&apos;s Dr. G. Y. Pathrikar, Chatrapati Sambhajinagar<br />
        SSC from MIT-VGS, Chatrapati Sambhajinagar<br />
        HSC from DES Highschool, Dharangaon, Malkapur, Buldhana
      </p>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
        <strong>Let’s Connect</strong><br />
        Always up for a chat about tech, collaboration, or horror stories. Hit me up!
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
