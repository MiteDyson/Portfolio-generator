// A simplified type for the GitHub repository data we need
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  homepage: string | null;
  fork: boolean; // From a previous step
  technologies?: string[]; 
}

// Type for GitHub user data
export interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string | null;
    bio: string | null;
    blog: string | null; // Add this for the website/portfolio link
    twitter_username: string | null; // Add this for the Twitter handle
    email: string | null; // email is sometimes available
}