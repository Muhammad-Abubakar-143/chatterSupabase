import { useOutletContext } from "@remix-run/react";
import type { Database } from "database.types";
import { useEffect, useState } from "react";
import { SupabaseOutletContext } from "~/root";
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function RealTimeMessages({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [messages, setMessages] = useState(serverMessages);
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log({ payload });
          const newMessage = payload.new as Message;

          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, messages, setMessages]);

  return (
    <>
      <div
        style={{
          maxWidth: 700,
          margin: "auto",
          marginTop: 100,
          backgroundColor: "white",
          padding: 20,
          border: "1px solid #e9e9e9",
          borderRadius: 20,
          maxHeight:'500px',
          overflow:'hidden'
        }}
      >
        <h1 style={{fontSize:20, marginBottom:10, fontWeight:500}}>Real Time Messages</h1>
        {messages.map((msg)=>(
            <div key={msg.id}>
                <div style={{display:'flex', justifyContent:'end', alignItems:'end'}}>
                <span style={{fontSize:12, marginBottom:5, marginRight:10,}}>{new Date(msg?.created_at).toLocaleDateString()}</span>
                <div >
                <p style={{backgroundColor:'#00000090', borderRadius:20, margin:'5px 0', color:'white', padding:'5px 10px'}}>{msg.content}</p>
                </div>
                </div>
            </div>
        ))}
      </div>
    </>
  );
}
