export const dynamic = "force-dynamic";


export async function GET() {
  const uniqueParam = new Date().getTime(); // Current timestamp as a cache buster
  const res = await fetch(`https://engage-dev.com:4320/api/walletGen?_=${uniqueParam}`);
  const wallet = await res.json();

  return new Response(JSON.stringify(wallet), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
