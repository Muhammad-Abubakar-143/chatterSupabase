import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import createServerSupabase from '../utils/supabase.server'
import { createBrowserClient } from "@supabase/auth-helpers-remix";

type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient

}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const env = {
    SUPBASE_URL:import.meta.env.VITE_PUBLIC_SUPABASE_URL!,
    SUPABASE_ANNON_KEY:import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!
  }
  const response = new Response()
  const supabase = createServerSupabase({request, response})
  const {data: {session},} = await supabase.auth.getSession()
  return json({env , session}, {headers:response.headers})
  
};


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
   const {env , session} = useLoaderData<typeof loader>()
  const serverAccessToken = session?.access_token
  const revalidator = useRevalidator()
  const [supabase] = useState(()=> createBrowserClient<Database>(env.SUPBASE_URL,env.SUPABASE_ANNON_KEY))
  useEffect(()=>{
   const {data : {subscription}} = supabase.auth.onAuthStateChange((event, session)=>{
      if(session?.access_token !== serverAccessToken){
        revalidator.revalidate()
      }
  })
  return ()=>{subscription.unsubscribe()}
  },[supabase, serverAccessToken, revalidator])
  return <Outlet context={{supabase}} />;
}
