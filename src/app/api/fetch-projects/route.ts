// app/api/fetch-projects/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
  }

  if (!process.env.GITHUB_API_TOKEN) {
    console.error("CRITICAL: GITHUB_API_TOKEN is not set.");
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub user '${username}' not found.` }, { status: res.status });
    }

    const user = await res.json();
    return NextResponse.json(user);

  } catch {
    return NextResponse.json({ error: 'An unexpected network error occurred.' }, { status: 500 });
  }
}