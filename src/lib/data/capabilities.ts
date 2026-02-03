export interface Capability {
  num: string;
  name: string;
  description: string;
}

export const capabilities: Capability[] = [
  {
    num: "01/",
    name: "Modern Web Development",
    description: "Building performant, SEO-friendly web applications using <strong>Next.js</strong> and <strong>React</strong>. I specialize in creating responsive Single Page Applications (SPAs) that work seamlessly across all devices."
  },
  {
    num: "02/",
    name: "UI/UX Engineering",
    description: "Translating designs into pixel-perfect code. I use <strong>Tailwind CSS</strong> and modern CSS features to build beautiful, accessible, and interactive user interfaces with smooth animations."
  },
  {
    num: "03/",
    name: "Full Stack Integration",
    description: "Connecting frontends to powerful backends. Experienced in using <strong>Firebase</strong> for real-time databases and integrating complex third-party <strong>APIs</strong> into seamless applications."
  },
  {
    num: "04/",
    name: "Tools & Automation",
    description: "Going beyond the browser with <strong>Python</strong>. I build efficient CLI tools, scripts, and automation bots to streamline workflows and handle data processing tasks."
  }
];
