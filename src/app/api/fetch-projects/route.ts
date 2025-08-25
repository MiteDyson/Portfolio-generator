import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user');
    }

    const user = await res.json();
    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json({ error: 'GitHub user not found or API error.' }, { status: 404 });
  }
}