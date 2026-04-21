import { useState } from "react";

const SelectRole = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/oauth/complete-profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/success";
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Select Your Role</h1>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button type="button" onClick={() => setRole("BACHELOR")}>
          Bachelor
        </button>

        <button type="button" onClick={() => setRole("HOME_OWNER")}>
          Home Owner
        </button>

        <button type="button" onClick={() => setRole("CATERING")}>
          Catering
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>Selected: {role || "None"}</p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!role || loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Submitting..." : "Continue"}
      </button>
    </div>
  );
};

export default SelectRole;
