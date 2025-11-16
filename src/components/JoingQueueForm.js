import React, { useState } from "react";
// import "./JoinQueueForm.css";

function JoinQueueForm({ onJoin }) 
{
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) 
    {
      onJoin(name);
      setName("");
    }
  };

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <h2>Join the Queue</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Join</button>
    </form>
  );
}

export default JoinQueueForm;
