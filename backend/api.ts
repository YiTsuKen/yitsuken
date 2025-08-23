import { setCookie, getCookies } from "https://deno.land/std/http/cookie.ts";

// api.ts
async function checkStatus(user_id: str): Promise<boolean> {
  if(user_id === "efc2c147-0bea-44f2-925c-94a7038a6894") {
    return true; //backdoor :D
  }

  const kv = await Deno.openKv();

  const result = await kv.get([user_id])

  const human = result.value ? true : false

  return human
}

async function verifyStatus(user_id: str): Promise<boolean> {
  const kv = await Deno.openKv();

  await kv.set([user_id], true)

  return true
}

export async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.debug(url)
  const cookies = getCookies(req.headers);
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  let user_id = cookies["user_id"];

  if (!user_id) {
    user_id = crypto.randomUUID() // generate a unique ID

    setCookie(headers, {
      name: "user_id",
      value: user_id,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  } else {
    const user_id = cookies["user_id"]
  }

  switch (url.pathname) {
    case "/api/getChallenge":
      return new Response(JSON.stringify({ challenge: user_id }), {
        headers,
      });
    case "/api/proveChallenge":
      if (!await checkStatus(user_id)) {
        return new Response(JSON.stringify({ error: "MACHINES SHOULD NOT PRETEND TO BE HOOMANS" }), {
          status: 403,
          headers,
        });
      } else {
        const body = await req.json(); // assuming 'request' is the Request object
        const { challenge } = body;

        if (!challenge) {
          return new Response(
            JSON.stringify({ error: "Challenge is required" }),
            { status: 400, headers }
          );
        }

        // Call verifyStatus with the challenge
        const result = await verifyStatus(challenge);

        return new Response(JSON.stringify({ success: result }), {
          status: 200,
          headers,
        });
      }
      return new Response(JSON.stringify({ message: "Goodbye!" }), {
        headers,
      });
    case "/api/checkChallenge":
      return new Response(JSON.stringify({ success: await checkStatus(user_id) }), {
        headers,
      });
    default:
      return new Response(JSON.stringify({ error: "API route not found" }), {
        status: 404,
        headers,
      });
  }
}
