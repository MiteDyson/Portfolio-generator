import { PortfolioForm } from "@/components/PortfolioForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button"; // Import the Button component
import { Github } from "lucide-react";

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8">
      
      {/* START: Corrected Top-Right Corner */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <a 
            href="https://github.com/your-username/portfolio-generator" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </Button>
        <ThemeToggle />
      </div>
      {/* END: Corrected Top-Right Corner */}

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