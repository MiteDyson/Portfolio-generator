import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { GitHubRepo, GitHubUser } from "@/lib/types";
import { Github } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from "@/components/ui/button";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Define a precise Props type that includes searchParams to match Next.js internals
type Props = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function extractTechnologies(readmeContent: string): string[] {
  const techKeywords = [
    'Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'shadcn/ui',
    'Vercel', 'Node.js', 'Python', 'Framer Motion', 'Docker', 'PostgreSQL',
    'MongoDB', 'Express', 'HTML', 'CSS', 'Gemini API', 'NextAuth.js', 'Prisma'
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

async function generateSummary(user: GitHubUser, technologies: string[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return user.bio || "A passionate developer.";
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Based on this developer's profile, write a professional and engaging summary in the first person. Keep it concise (around 30 words).\n- Name: ${user.name || user.login}\n- Bio: "${user.bio || 'A passionate developer.'}"\n- Key Technologies: ${technologies.join(', ')}\n\nGenerate the summary now:`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return user.bio || "A passionate developer exploring new technologies.";
  }
}

async function getGitHubData(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[]; allTechnologies: string[]; summary: string } | null> {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` }, next: { revalidate: 3600 } });
    if (!userRes.ok) return null;
    const user: GitHubUser = await userRes.json();
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, { headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` }, next: { revalidate: 3600 } });
    if (!reposRes.ok) return null;
    let initialRepos: GitHubRepo[] = await reposRes.json();
    initialRepos = initialRepos.filter(repo => !repo.fork);
    const reposWithTech = await Promise.all(
      initialRepos.map(async (repo) => {
        try {
          const readmeRes = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers: { Authorization: `token ${process.env.GITHUB_API_TOKEN}` }, next: { revalidate: 3600 } });
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            const readmeContent = Buffer.from(readmeData.content, 'base64').toString();
            repo.technologies = extractTechnologies(readmeContent);
          } else { repo.technologies = []; }
        } catch { repo.technologies = []; }
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

// ✅ Use the robust 'Props' type here to satisfy ESLint and TypeScript
export default async function PortfolioPage({ params }: Props) {
  const data = await getGitHubData(params.username);

  if (!data) {
    notFound();
  }

  const { user, repos, allTechnologies, summary } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <a href={user.html_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </Button>
        <ThemeToggle />
      </div>
      
      <header className="container mx-auto max-w-4xl px-4 pt-16 pb-8 text-center">
        <Image src={user.avatar_url} alt={user.login} width={128} height={128} className="mx-auto mb-4 rounded-full border-4 border-primary" priority />
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{user.name || user.login}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{user.bio}</p>
        
        {/* ✅ Restored the single-line, scrollable, and centered chip layout */}
        <div className="mt-6 flex items-center justify-start gap-2 py-2">
          {allTechnologies.map((tech) => (
            <Badge key={tech} variant="glass" className="flex-shrink-0">
              {tech}
            </Badge>
          ))}
        </div>
      </header>
      
      <section className="container mx-auto max-w-2xl px-4 py-8">
        {/* ✅ Added quotes back to the summary for styling */}
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