import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");

  let handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:5000/", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          mobileNumber: mobileNumber,
        }),
        headers: {'content-type': 'application/json'}
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setName("");
        setEmail("");
        setMobileNumber("");
        setMessage(resJson['message']);
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  let handleSubmitGet = async (e) => {
    e.preventDefault();
    try {
      const encodedValue = encodeURIComponent(name);
      let res = await fetch(`http://localhost:5000/?name=${encodedValue}`, {
        method: "GET",
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setMessage(resJson["email"]+" | "+resJson["mobileNumber"]);
      } else {
        setMessage(resJson["message"]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmitPost}>
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={mobileNumber}
          placeholder="Mobile Number"
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>

        <button onClick={handleSubmitGet}>Search</button>

        
      </form>
    </div>
  );
}

export default App;