// This array will hold all of your project information.
// Adding a new project is as simple as adding a new object to this array.

export const projectsData = [
  {
    id: 1,
    title: 'My Awesome Portfolio',
    description: 'A responsive portfolio website built with React and Vite, featuring a theme toggle and dynamic project filtering.',
    imageUrl: 'https://placehold.co/600x400/F9A826/000000?text=Portfolio+Screenshot',
    videoUrl: 'path/to/your/video1.mp4', // You can add video paths later
    tags: ['React', 'JSX', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    title: 'Python Data Analyzer',
    description: 'A script that processes CSV files to generate insightful reports and visualizations using Pandas and Matplotlib.',
    imageUrl: 'https://placehold.co/600x400/4DB6AC/FFFFFF?text=Python+Project',
    videoUrl: 'path/to/your/video2.mp4',
    tags: ['Python'],
  },
  {
    id: 3,
    title: '3D Scene with Three.js',
    description: 'An interactive 3D scene rendered in the browser using Three.js, demonstrating lighting, models, and camera controls.',
    imageUrl: 'https://placehold.co/600x400/8E44AD/FFFFFF?text=Three.js+Scene',
    videoUrl: 'path/to/your/video3.mp4',
    tags: ['Three.js', 'JavaScript'],
  },
  {
    id: 4,
    title: 'TypeScript E-Commerce UI',
    description: 'The user interface for an e-commerce platform built with React and TypeScript, ensuring type safety and scalability.',
    imageUrl: 'https://placehold.co/600x400/3498DB/FFFFFF?text=TypeScript+App',
    videoUrl: 'path/to/your/video4.mp4',
    tags: ['React', 'TSX', 'TypeScript', 'CSS'],
  },
  {
    id: 5,
    title: 'Unreal Engine 5 Environment',
    description: 'A detailed, realistic environment created in Unreal Engine 5, focusing on lighting, texturing, and level design.',
    imageUrl: 'https://placehold.co/600x400/2ECC71/FFFFFF?text=Unreal+Scene',
    videoUrl: 'path/to/your/video5.mp4',
    tags: ['Unreal Engine'],
  },
  {
    id: 6,
    title: 'Utility Website with TailwindCSS',
    description: 'A landing page for a fictional company, built rapidly using TailwindCSS for utility-first styling.',
    imageUrl: 'https://placehold.co/600x400/38BDF8/FFFFFF?text=Tailwind+Site',
    videoUrl: 'path/to/your/video6.mp4',
    tags: ['HTML', 'TailWindCSS', 'JavaScript'],
  },
  {
    id: 7,
    title: 'Stylized 3D Model',
    description: 'A low-poly, stylized character model created and textured in Blender, ready for use in a game engine.',
    imageUrl: 'https://placehold.co/600x400/E74C3C/FFFFFF?text=Blender+Model',
    videoUrl: 'path/to/your/video7.mp4',
    tags: ['Blender'],
  },
];

// We can also create a list of all your skills for the filter bar
export const skillTags = [
  'All', 'React', 'JSX', 'TSX', 'Python', 'JavaScript', 'TypeScript', 'CSS', 'TailWindCSS', 'HTML', 'Bootstrap', 'Unreal Engine', 'Blender', 'Three.js'
];