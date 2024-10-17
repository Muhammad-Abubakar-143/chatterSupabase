import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import Login from "components/Login";
import Logout from "components/Logout";
import RealTimeMessages from "components/realtime-messages";
import createSupabaseServerClient from "utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({request}: ActionFunctionArgs)=>{
  const response = new Response()
  const supabase = createSupabaseServerClient({request, response})
  const {message} = Object.fromEntries(await request.formData())
  const {error} = await supabase.from("messages").insert({content: String(message)})
if(error){
  console.log(error)
}

  return json(null, {headers: response.headers})
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.from("messages").select();

  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>() ?? { messages: [] };
  // if (!messages || messages.length === 0) {
  //   return <div className="flex h-screen items-center justify-center">Loading messages...</div>;
  // }
  return (
    <div className="bg-gray-50 m-0 h-screen">
      {messages.length === 0 ? <Login/> : <>
        <Logout/>
      <RealTimeMessages serverMessages={messages}/>
      <div style={{ maxWidth: 700,marginLeft:'auto', marginRight:'auto'}}>
      <Form method="post" style={{display:'flex', justifyContent:'center',gap:10, marginTop:'20px'}}>
        <input style={{border:'1px solid #e9e9e9', width:'100%', padding:'5px 10px', borderRadius:15}} placeholder="Enter Something..." type="text" name="message" id="message" />
        <button style={{padding:'5px 15px', backgroundColor:'black', color:'white', borderRadius:15}} type="submit">Send</button>
      </Form>
      </div>
      </>}
    </div>
  );
}
