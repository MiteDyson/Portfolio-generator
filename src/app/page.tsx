import { PortfolioForm } from "@/components/PortfolioForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github } from "lucide-react";

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4 flex items-center gap-4">
          <a href="https://github.com/your-repo-link" target="_blank" rel="noopener noreferrer">
              <Github className="h-6 w-6 text-foreground/80 hover:text-foreground" />
          </a>
          <ThemeToggle />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
          AI Portfolio Generator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter your GitHub username to automatically generate a portfolio with AI-powered descriptions.
        </p>
      </div>

      <div className="mt-12 w-full max-w-xl">
        <PortfolioForm />
      </div>
    </main>
  );
}