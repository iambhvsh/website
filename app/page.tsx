import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-12 px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold">
    Bhavesh Patil
  </h1>
  <p className="mt-4 text-base sm:text-lg lg:text-xl">
    Hey there! I&apos;m Bhavesh Patil, the web wizard from Chatrapati Sambhajinagar, currently battling the dragons of a BSC in IT at MGM&apos;s Dr. G. Y. Pathrikar. Based in India, I brew web applications like a caffeinated barista. As an introvert, I thrive in my code cave, enjoying the silent symphonies of coding, music, and horror stories.
  <div className="mt-4">
  <Link href={`/docs/${page_routes[0].href}`} className="text-blue-500">Get Started ⟩</Link>
  </div>
  </p>
</header>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Skills & Technologies
        </h2>
        <div className="w-full max-w-lg mx-auto">
  <img src="https://skillicons.dev/icons?i=html,css,js,bootstrap,tailwind,md,c,react,next,ts&theme=light&perline=5" alt="Languages" className="w-full h-auto" />
</div>

      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Projects
        </h2>
        <div className="grid gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              1. 🛍️ ThePixelStore
            </h3>
            <p className="text-lg sm:text-xl mb-2">
              <strong>Description:</strong> An app store inspired by the iOS App Store. Browse apps like a pro, with reviews and everything.
            </p>
            <p className="text-lg sm:text-xl mb-2">
              <strong>Technologies:</strong>
              <div>
               <img src="https://skillicons.dev/icons?i=react" alt="React" width={32} height={32} className="inline-block mt-2" />
              </div>
            </p>
            <p className="text-lg sm:text-xl">
              <strong><Link href="https://thepixelstore.vercel.app" target="_blank" className="text-blue-500 no-underline">Live Preview ⟩</Link></strong>
            </p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              2. 🎥 DarkValor
            </h3>
            <p className="text-lg sm:text-xl mb-2">
              <strong>Description:</strong> This project is a sleek and minimalist YouTube client, developed using HTML, Tailwind CSS, and JavaScript. It leverages the Invidious API to provide a seamless and privacy-focused video browsing experience.
            </p>
            <p className="text-lg sm:text-xl mb-2">
              <strong>Technologies:</strong>
              
              <div>
                <img src="https://skillicons.dev/icons?i=html,tailwind,js" alt="HTML, Tailwind CSS, JavaScript" width={96} height={32} className="inline-block mt-2" />
                </div>
            </p>
            <p className="text-lg sm:text-xl">
              <strong><Link href="https://darkvalor.vercel.app" target="_blank" className="text-blue-500 no-underline">Live Preview ⟩</Link></strong>
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          GitHub Stats & Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <img src="https://github-readme-stats.vercel.app/api?username=iambhvsh&show_icons=true&theme=radical" alt="GitHub Stats"/>
          <img src="https://github-readme-streak-stats.herokuapp.com/?user=iambhvsh&theme=radical" alt="GitHub Streak"/>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Goals
        </h2>
        <p className="text-lg sm:text-xl">
          Master frontend development and modern tech, Contribute to open-source, Keep up with tech trends, Launch personal projects, Dive into backend development, Tackle coding challenges, Network with tech pros.
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Bucket List
        </h2>
        <p className="text-lg sm:text-xl mb-2">
          <strong>Languages to Learn:</strong> 
          <div><img src="https://skillicons.dev/icons?i=c,cpp,swift,python" alt="C, C++, Swift, Python" width={128} height={32} className="inline-block mt-2"/>
          </div>
        </p>
        <p className="text-lg sm:text-xl mb-2">
          <strong>Technologies to Master:</strong> 
          <div>
            <img src="https://skillicons.dev/icons?i=next,react" alt="Next.js, React.js" width={64} height={32} className="inline-block mt-2"/>
          </div>
        </p>
        <p className="text-lg sm:text-xl">
          Other Goals: Publish open-source stuff, Play with Node.js and databases, Create a tech blog, Study system design, Contribute to documentation and tutorials, Learn and implement security practices, Try out different state management libraries, Containerize everything with Docker, Build super interactive user experiences, Optimize web performance, Study microservices architecture, Build and deploy multi-platform apps, Master advanced debugging, Help build tools and frameworks for other developers.
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Contact Me
        </h2>
        <p className="text-lg sm:text-xl">
          Email: <Link href="mailto:iambhvshh@outlook.com" className="text-blue-500 no-underline">iambhvshh@outlook.com</Link><br />
          GitHub: <Link href="https://github.com/iambhvsh" target="_blank" className="text-blue-500 no-underline">iambhvsh</Link>
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Education
        </h2>
        <p className="text-lg sm:text-xl">
          - BSC in IT from MGM&apos;s Dr. G. Y. Pathrikar, Chatrapati Sambhajinagar - 2024<br /><br />
          
          - HSC from DES Highschool, Dharangaon, Malkapur, Buldhana - 2024<br /><br />
          
          - SSC from MIT-VGS, Chhatrapati Sambhajinagar - 2022
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Let’s Connect
        </h2>
        <p className="text-lg sm:text-xl">
          Always up for a chat about tech, collaboration, or horror stories. Hit me up!
        </p>
      </section>
    </div>
  );
}
