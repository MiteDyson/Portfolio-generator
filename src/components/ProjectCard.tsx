"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Star, GitFork, Sparkles, Loader2, ExternalLink } from "lucide-react";
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

      if (!response.ok) throw new Error("Failed to generate description");
      
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

  // Combine primary language with other techs, ensuring no duplicates
  const allTechs = Array.from(new Set([
    ...(repo.language ? [repo.language] : []), 
    ...(repo.technologies || [])
  ]));

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">{repo.name}</CardTitle>
          <CardDescription className="min-h-[40px]">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="mb-4 flex flex-wrap gap-2">
            {allTechs.map((tech, index) => (
              <Badge key={tech} variant={index === 0 ? "default" : "secondary"}>
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4" /> {repo.stargazers_count}
            </div>
            <div className="flex items-center">
              <GitFork className="mr-1 h-4 w-4" /> {repo.forks_count}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-2 pt-4">
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </a>
            </Button>
            {repo.homepage && (
              <Button variant="secondary" asChild>
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View Live
                </a>
              </Button>
            )}
          </div>
          <Button onClick={handleGenerateDescription} disabled={isGenerating} size="sm">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            AI Describe
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}