import { useOutletContext } from "@remix-run/react";
import { SupabaseOutletContext } from "~/root";

const Logout = () => {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <div
      style={{ paddingTop: "20px"}}
    >
        <div style={{
        padding: "10px 20px",
        width: "50%",
        borderRadius: "50px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "white",
        display: "flex",
        border:"1px solid #e9e9e9",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h1 style={{ fontSize: 30, fontWeight: 600 }}>Chatter</h1>
      <button
        style={{
          backgroundColor: "#ff000020",
          padding: "5px 10px",
          color: "red",
          borderRadius: 10,
        }}
        onClick={handleLogOut}
      >
        Logout
      </button>
        </div>
    </div>
  );
};

export default Logout;
