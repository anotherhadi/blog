/// <reference types="bun-types" />
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface GiteaRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string;
  topics: string[];
  stars_count: number;
  language: string | null;
  fork: boolean;
  private: boolean;
  website: string;
}

export interface RepoMirrors {
  github?: string;
  gitlab?: string;
}

export interface GiteaRepoWithMirrors extends GiteaRepo {
  mirrors: RepoMirrors;
}

const GITEA_BASE = "https://git.hadi.icu";
const GITEA_USER = "anotherhadi";
const GITHUB_USER = "anotherhadi";
const GITLAB_USER = "anotherhadi_mirror";
const SKIP_REPOS = ["anotherhadi"];

async function checkMirrors(repoName: string): Promise<RepoMirrors> {
  const mirrors: RepoMirrors = {};

  const [githubRes, gitlabRes] = await Promise.allSettled([
    fetch(`https://github.com/${GITHUB_USER}/${repoName}`, { method: "HEAD" }),
    fetch(`https://gitlab.com/${GITLAB_USER}/${repoName}`, { method: "HEAD" }),
  ]);

  if (githubRes.status === "fulfilled" && githubRes.value.ok) {
    mirrors.github = `https://github.com/${GITHUB_USER}/${repoName}`;
  }
  if (gitlabRes.status === "fulfilled" && gitlabRes.value.ok) {
    mirrors.gitlab = `https://gitlab.com/${GITLAB_USER}/${repoName}`;
  }

  return mirrors;
}

export async function fetchGiteaRepos(): Promise<GiteaRepoWithMirrors[]> {
  try {
    const res = await fetch(
      `${GITEA_BASE}/api/v1/users/${GITEA_USER}/repos?limit=50&page=1`,
    );
    if (!res.ok) throw new Error(`Gitea API: ${res.status}`);

    const repos: GiteaRepo[] = await res.json();

    const filtered = repos
      .filter((r) => !r.fork && !r.private && !SKIP_REPOS.includes(r.name))
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

    const reposWithMirrors = await Promise.all(
      filtered.map(async (repo) => ({
        ...repo,
        mirrors: await checkMirrors(repo.name),
      })),
    );

    return reposWithMirrors;
  } catch (e) {
    console.error("Failed to fetch Gitea repos:", e);
    return [];
  }
}

export function getBannerUrl(repo: GiteaRepo): string {
  return `${GITEA_BASE}/${repo.full_name}/raw/branch/main/.github/assets/banner.png`;
}

async function main() {
  console.log("Fetching repos from Gitea...");
  const rawRepos = await fetchGiteaRepos();
  const repos = rawRepos.map((repo) => ({
    ...repo,
    banner_url: `${GITEA_BASE}/${repo.full_name}/raw/branch/main/.github/assets/banner.png`,
  }));

  const dataDir = join(process.cwd(), "src/data");
  await mkdir(dataDir, { recursive: true });

  await Bun.write(join(dataDir, "repos.json"), JSON.stringify(repos, null, 2));

  console.log(`Saved ${repos.length} repos to src/data/repos.json`);
}

main().catch(console.error);
