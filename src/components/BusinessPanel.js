import React from "react";
import QueueList from "./QueueList";
// import "./BusinessPanel.css";

function BusinessPanel({ queue, onServeNext, onRemove, onClear }) 
{
  return (
    <div className="business-panel">
      <button className="clear-btn" onClick={onClear}>Clear Queue</button>
      <QueueList queue={queue} onServeNext={onServeNext} onRemove={onRemove} />
    </div>
  );
}

export default BusinessPanel;
