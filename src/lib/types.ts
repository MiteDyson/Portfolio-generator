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
}

// Type for GitHub user data
export interface GitHubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string | null;
    bio: string | null;
}