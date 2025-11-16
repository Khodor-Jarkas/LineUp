import React from "react";
// import "./QueueList.css";

function QueueList({ queue, onServeNext, onRemove }) 
{
  return (
    <div className="queue-list">
      <h2>Current Queue</h2>
      {queue.length === 0 ? ( // if its 0 then show message
        <p>The queue is empty.</p>
        ) : (
            
        <ul>
          {queue.map((person) => ( 
            <li key={person.id} className={person.status}>
              <span> {person.name} </span>
              {person.status === "waiting" && (
                <div className="buttons">
                  <button onClick={() => onServeNext(person.id)}>Serve Next</button>
                  <button onClick={() => onRemove(person.id)}>Remove</button>
                </div>
              )}

              {person.status === "being served" && <span> Being Served </span>}
            </li>

          ))}
        </ul>

      )}
    </div>
  );
}

export default QueueList;
