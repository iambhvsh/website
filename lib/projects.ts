export interface ProjectLinks {
  github: string;
  live?: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: ProjectLinks;
}

export const PROJECTS: Project[] = [
  {
    title: 'TSLRC - Time Synced Lyrics',
    description: 'Time Synced Lyrics is an innovative app that synchronizes lyrics with your favorite tracks in real time, creating an immersive, interactive music experience.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=TSLRC',
    tags: ['HTML', 'TailwindCSS', 'JavaScript'],
    links: {
      github: 'https://github.com/iambhvsh/tslrc',
      live: 'https://tslrc.vercel.app'
    }
  },
  {
    title: 'Flashified',
    description: 'Flashified is a powerful and user-friendly tool for downloading images from websites effortlessly. Whether it’s blogs, galleries, or dynamic content, Flashified simplifies the process.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=Flashified',
    tags: ['NextJS', 'TailwindCSS'],
    links: {
      github: 'https://github.com/iambhvsh/flashified',
      live: 'https://flashified.vercel.app'
    }
  },
  {
    title: 'The Pixel Store',
    description: 'An App Store inspired by Apple\'s design, built with React and Framework7. Features a clean, modern interface with smooth animations.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=Pixel+Store',
    tags: ['React', 'Framework7', 'CSS3'],
    links: {
      github: 'https://github.com/iambhvsh/thepixelstore',
      live: 'https://thepixelstore.vercel.app'
    }
  },
  {
    title: 'DarkValor',
    description: 'A video streaming website using Invidious and Piped APIs. Modern interface with dark theme and seamless video playback.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=DarkValor',
    tags: ['HTML', 'TailwindCSS', 'JavaScript', 'API'],
    links: {
      github: 'https://github.com/iambhvsh/DarkValor',
      live: 'https://darkvalor.vercel.app'
    }
  },
  {
    title: 'Chat App',
    description: 'Real-time chat application with Firebase backend and modern UI. Just enter your name and start chatting instantly.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=Chat+App',
    tags: ['HTML', 'TailwindCSS', 'JavaScript', 'Firebase'],
    links: {
      github: 'https://github.com/iambhvsh/chat-app'
    }
  },
  {
    title: 'Forword',
    description: 'A dictionary application built with React and Ionic, providing comprehensive word lookups.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=Forword',
    tags: ['React', 'Ionic', 'API'],
    links: {
      github: 'https://github.com/iambhvsh/forword',
      live: 'https://forwordin.vercel.app'
    }
  },
  {
    title: 'ISS Live',
    description: 'Real-time International Space Station tracker with live location updates.',
    image: 'https://placehold.co/1200x630/1a1a1a/FFFFFF/png?text=ISS+Live',
    tags: ['HTML', 'Ionic', 'JavaScript'],
    links: {
      github: 'https://github.com/iambhvsh/iss-live',
      live: 'https://isslive.vercel.app'
    }
  }
]

export type SearchResultType = 'page' | 'blog' | 'project' | 'social'

export interface SearchResult {
  id: string
  title: string
  description?: string
  url: string
  type: SearchResultType
  tags?: string[]
}
