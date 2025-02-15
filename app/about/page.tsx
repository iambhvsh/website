import { SITE_DATA, AUTHOR } from '../../lib/shared'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FiMail, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

const skills = {
  frontend: [
    'Next.js',
    'React.js',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'HTML5',
    'CSS3',
  ],
  other: [
    'Python',
    'C',
    'Git',
    'VS Code',
  ]
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <div className="flex-shrink-0">
          <Image
            src={AUTHOR.image}
            alt={AUTHOR.name}
            width={150}
            height={150}
            className="rounded-full"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl text-white md:text-4xl font-bold mb-4">{AUTHOR.name}</h1>
          <p className="text-xl text-gray-400 mb-4">Frontend Developer</p>
          <div className="flex items-center gap-2 text-gray-400">
            <FiMapPin className="w-4 h-4" />
            <span>{AUTHOR.location}</span>
          </div>
          <div className="flex gap-4 mt-6">
            <Link 
              href={SITE_DATA.social.find(s => s.name === 'GitHub')?.url || '#'}
              className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
            <Link 
              href={SITE_DATA.social.find(s => s.name === 'LinkedIn')?.url || '#'}
              className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </Link>
            <Link 
              href={`mailto:${AUTHOR.email}`}
              className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all hover:scale-110"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-16">
        <h2 className="text-2xl text-white font-bold">About Me</h2>
        <p className="text-lg text-gray-300">
          I&apos;ve worked as a passionate Frontend Developer focused on creating clean, efficient, and user-friendly web applications. 
          My journey in web development started with curiosity and has evolved into a deep love for crafting beautiful user interfaces.
        </p>
        <p className="text-lg text-gray-300">
          I specialize in modern web technologies like Next.js and React.js, and I enjoy building responsive and performant web applications. 
          When I&apos;m not coding, you can find me exploring new technologies or contributing to open-source projects.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl text-white font-bold mb-8">Skills & Technologies</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Frontend Development</h3>
            <div className="flex flex-wrap gap-2">
              {skills.frontend.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Other Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.other.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

