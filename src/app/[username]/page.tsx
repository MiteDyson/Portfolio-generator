import { notFound } from "next/navigation";
import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GitHubRepo, GitHubUser } from "@/lib/types";
import { Github } from "lucide-react";

interface PortfolioPageProps {
  params: { username: string };
}

async function getGitHubData(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[] } | null> {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!userRes.ok) return null;
    const user: GitHubUser = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      },
       next: { revalidate: 3600 }
    });
    
    if (!reposRes.ok) return null;
    let repos: GitHubRepo[] = await reposRes.json();

    // Filter out forked repos
    repos = repos.filter(repo => !repo.fork);

    return { user, repos };

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

  const { user, repos } = data;

  return (
    <div className="min-h-screen bg-background">
       <div className="absolute top-4 right-4"><ThemeToggle /></div>
       
      <header className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={128}
          height={128}
          className="mx-auto mb-4 rounded-full border-4 border-primary"
        />
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{user.name || user.login}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{user.bio}</p>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
          <Github className="h-6 w-6 text-foreground/80 hover:text-foreground" />
        </a>
      </header>

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