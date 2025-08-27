
# 🤖 AI-Powered Portfolio Generator

⚡️ Instantly generate and deploy a stunning developer portfolio by simply entering a GitHub username. This project leverages the GitHub API for project data and Google's Gemini AI for dynamic content generation.

[](https://www.google.com/search?q=https://vercel.com/new/clone%3Frepository-url%3Dhttps%253A%252F%252Fgithub.com%252FMiteDyson%252FPortfolio-generator)

**[View Live Demo](https://github-portfolio-generator.vercel.app/)**

-----

## ✨ Key Features

  * **Automated Portfolio Creation**: Generates a complete portfolio page from any public GitHub profile.
  * **AI-Generated Content**:
      * **Professional Summary**: Creates a unique, first-person summary based on the user's bio and top technologies.
      * **Project Descriptions**: Generates engaging, one-click descriptions for individual repositories.
  * **Smart Tech Stack Detection**: Intelligently scans repository `README` files to automatically identify and display the technologies used for each project.
  * **Modern UI/UX**:
      * Sleek, responsive design that looks great on all devices.
      * Theme-aware with beautiful **light and dark modes**.
      * Features a dynamic, theme-sensitive WebGL background animation.

-----

## 🛠️ Technologies Used
Of course. The project is built with a modern, full-stack TypeScript stack designed for performance and a great developer experience.

***
### Frontend & Framework 뼈

* **Next.js**: A full-stack React framework. We're using the App Router with Server Components for fast page loads and efficient data fetching.
* **React**: The core library for building the user interface.
* **TypeScript**: Used for static typing to ensure code quality and prevent bugs.

***
### Styling & UI ✨

* **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling.
* **shadcn/ui**: A collection of beautifully designed, reusable, and accessible components that are copied directly into the project for full control.
* **OGL (WebGL)**: A minimal WebGL library used to power the animated background grid.

***
### Backend & APIs ☁️

* **Next.js API Routes**: All backend logic, such as calling external services, is handled within server-side API routes.
* **GitHub API**: Used to fetch all user profile information and repository data.
* **Google Gemini API**: The core AI engine used to generate the user's professional summary and the descriptions for each project.

***
### Deployment & Infrastructure 🚀

* **Vercel**: The platform used for building, deploying, and hosting the application. It's optimized for Next.js and provides seamless continuous deployment from GitHub.
-----

## 📂 Project Structure

The project follows the standard Next.js App Router structure. Key directories and files are outlined below:

```
/src
└── app/
    ├── api/                  # Backend API routes (server-side logic)
    │   ├── generate-description/ # Handles AI project descriptions
    │   └── fetch-projects/       # Fetches GitHub data securely
    ├── components/             # Reusable React components
    │   ├── ui/                 # Unstyled components from shadcn/ui
    │   ├── ProjectCard.tsx     # Card for displaying a single project
    │   ├── PortfolioForm.tsx   # The main form on the homepage
    │   ├── Squares.tsx         # The WebGL background animation component
    │   └── ThemeToggle.tsx     # Dark/Light mode switcher
    ├── lib/                    # Utility functions and type definitions
    │   ├── types.ts            # TypeScript type definitions (GitHubRepo, etc.)
    │   └── utils.ts            # shadcn/ui utility file
    ├── [username]/             # Dynamic route for generated portfolios
    │   └── page.tsx            # The main portfolio page component
    ├── layout.tsx              # Root layout of the application
    └── page.tsx                # Homepage (where user enters username)
```

-----

## 🚀 Getting Started (Local Setup)

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MiteDyson/Portfolio-generator.git
    cd Portfolio-generator
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your API keys. See the **Environment Variables** section below for details.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://localhost:3000) in your browser to see the result.

-----

## 🌍 Vercel Deployment Steps

Deploying your portfolio generator to Vercel is quick and easy.

1.  **Fork this Repository**: Click the "Fork" button at the top-right of this page to create your own copy.

2.  **Import Project on Vercel**:

      * Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New... \> Project".
      * Select your forked GitHub repository.

3.  **Configure Environment Variables**:

      * In the "Configure Project" step, expand the "Environment Variables" section.
      * Add your `GITHUB_API_TOKEN` and `GEMINI_API_KEY` secrets. These are crucial for the application to function.

4.  **Deploy**: Click the "Deploy" button. Vercel will automatically build and deploy your site, making it live on the web\!

-----

## 🔑 Environment Variables

To run this project, you need to add the following environment variables to your `.env.local` file (for local development) and to your Vercel project settings (for deployment).

| Variable           | Description                                                 | Where to get it                                                                      |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `GITHUB_API_TOKEN` | Allows the server to make authenticated requests to the GitHub API, increasing rate limits. | **GitHub** \> Settings \> Developer settings \> Personal access tokens |
| `GEMINI_API_KEY`   | Authenticates requests to the Google Gemini API for content generation. | **Google AI Studio** \> Get API key                                                    |

-----

