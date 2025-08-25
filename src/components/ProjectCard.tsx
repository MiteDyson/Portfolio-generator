"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Star, GitFork, Sparkles, Loader2 } from "lucide-react";
import { GitHubRepo } from "@/lib/types";

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  const [description, setDescription] = useState(repo.description || "No description provided.");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    toast.info(`Generating new description for ${repo.name}...`);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: repo.name,
          repoDescription: repo.description,
          repoLanguage: repo.language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }
      const data = await response.json();
      setDescription(data.description);
      toast.success("Description generated successfully!");

    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{repo.name}</CardTitle>
          <CardDescription className="min-h-[40px]">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {repo.language && <p>Language: {repo.language}</p>}
          </div>
          <div className="mt-2 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4" /> {repo.stargazers_count}
            </div>
            <div className="flex items-center">
              <GitFork className="mr-1 h-4 w-4" /> {repo.forks_count}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button onClick={handleGenerateDescription} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            AI Describe
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}