import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { GitHubRepo, GitHubUser } from "@/lib/types";
import { Github } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface PortfolioPageProps {
  params: { username: string };
}

/**
 * Extracts a list of known technologies from a given string (like a README).
 * @param readmeContent The string content to scan.
 * @returns An array of unique technologies found.
 */
function extractTechnologies(readmeContent: string): string[] {
  const techKeywords = [
    'Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'shadcn/ui',
    'Vercel', 'Node.js', 'Python', 'Framer Motion', 'Docker', 'PostgreSQL',
    'MongoDB', 'Express', 'HTML', 'CSS', 'Gemini API', 'NextAuth.js', 'Prisma'
    // Add any other technologies you want to detect here
  ];
  const foundTechs = new Set<string>();
  const contentLower = readmeContent.toLowerCase();
  techKeywords.forEach(tech => {
    const regex = new RegExp(`\\b${tech.toLowerCase().replace('.', '\\.')}\\b`, 'i');
    if (regex.test(contentLower)) {
      foundTechs.add(tech);
    }
  });
  return Array.from(foundTechs);
}

/**
 * Generates a short, first-person summary using the Gemini API.
 * @param user The user's GitHub profile data.
 * @param technologies A list of the user's key technologies.
 * @returns A promise resolving to the AI-generated summary string.
 */
async function generateSummary(user: GitHubUser, technologies: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return user.bio || "A passionate developer exploring new technologies.";
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Based on this developer's profile, write a professional and engaging summary in the first person. Keep it concise (around 30 words).
  - Name: ${user.name || user.login}
  - Bio: "${user.bio || 'A passionate developer.'}"
  - Key Technologies: ${technologies.join(', ')}
  
  Generate the summary now:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return user.bio || "A passionate developer exploring new technologies.";
  }
}

/**
 * Fetches all necessary data for the portfolio page, including an AI summary.
 */
async function getGitHubData(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[]; allTechnologies: string[]; summary: string } | null> {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` },
      next: { revalidate: 3600 }
    });
    if (!userRes.ok) return null;
    const user: GitHubUser = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` },
      next: { revalidate: 3600 }
    });
    if (!reposRes.ok) return null;
    let initialRepos: GitHubRepo[] = await reposRes.json();
    initialRepos = initialRepos.filter(repo => !repo.fork);

    const reposWithTech = await Promise.all(
      initialRepos.map(async (repo) => {
        try {
          const readmeRes = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
            headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` },
            next: { revalidate: 3600 }
          });
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            const readmeContent = Buffer.from(readmeData.content, 'base64').toString();
            repo.technologies = extractTechnologies(readmeContent);
          } else {
            repo.technologies = [];
          }
        } catch (e) {
          repo.technologies = [];
        }
        return repo;
      })
    );
    
    const allTechSet = new Set<string>();
    reposWithTech.forEach(repo => {
        if (repo.language) allTechSet.add(repo.language);
        repo.technologies?.forEach(tech => allTechSet.add(tech));
    });
    const limitedTechnologies = Array.from(allTechSet).slice(0, 10);
    
    const summary = await generateSummary(user, limitedTechnologies);

    return { user, repos: reposWithTech, allTechnologies: limitedTechnologies, summary };

  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return null;
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const data = await getGitHubData(params.username);

  if (!data) {
    notFound();
  }

  const { user, repos, allTechnologies, summary } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
        </a>
        <ThemeToggle />
      </div>
      
      <header className="container mx-auto max-w-4xl px-4 pt-16 pb-8 text-center">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={128}
          height={128}
          className="mx-auto mb-4 rounded-full border-4 border-primary"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{user.name || user.login}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{user.bio}</p>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {allTechnologies.map((tech) => (
            <Badge key={tech} variant="glass">
              {tech}
            </Badge>
          ))}
        </div>
      </header>
      
      <section className="container mx-auto max-w-2xl px-4 py-8">
        <p className="text-center text-lg italic text-muted-foreground md:text-xl">
          {summary.trim()}
        </p>
      </section>

      <main className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">My Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      </main>
    </div>
  );
}