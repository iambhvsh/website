import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'
import { generateMetadata } from './metadata'

export const metadata = generateMetadata({
  params: {
    title: 'Home',
    description: "I'm a web developer passionate about creating beautiful and functional websites",
    type: 'website',
    slug: '',
  },
})

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl text-white md:text-6xl font-bold mb-4 text-center">
        Bhavesh Patil
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-8 text-center">
        I&apos;m a web developer passionate about creating beautiful and functional websites
      </p>
      <Link
        href="/projects"
        className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-900 hover:text-white transition duration-500"
      >
        Explore my portfolio <FiChevronRight className="inline w-5 h-5 font-bold" />
      </Link>
    </div>
  )
}
