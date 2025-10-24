import React, { useState } from "react";
import "./DisplayPage.css"; // optional CSS file

const XMLDisplay = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleApiCall = async () => {
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/getData"); // change to your API endpoint
      const data = await res.json();

      if (res.status === 400) {
        setError(data.message || "Something went wrong!");
      } else if (res.status === 201 || res.status === 200 ) {
        setResponse(data);
      } else {
        setError(`Unexpected status: ${res.status}`);
      }
    } catch (err) {
      setError("Network or server error");
    }
  };

  return (
    <div className="container">
      <h2>API Response Viewer</h2>
      <button onClick={handleApiCall}>Fetch API Data</button>

      {error && <p className="error">{error}</p>}

      {response && response.data && (
        <div className="table-container">
          {response.data.map((user, idx) => (
            <div key={idx} className="card">
              <h3>{user.name}</h3>
              <p><strong>PAN:</strong> {user.PAN}</p>
              <p><strong>Mobile:</strong> {user.mobilePhone}</p>
              <p><strong>Credit Score:</strong> {user.creditScore}</p>
              <p><strong>Total Accounts:</strong> {user.totalAccounts}</p>
              <p><strong>Active Accounts:</strong> {user.activeAccounts}</p>
              <p><strong>Closed Accounts:</strong> {user.closedAccounts}</p>
              <p><strong>Current Balance:</strong> ₹{user.currentBalanceAmount}</p>

              <h4>Credit Accounts:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Account No</th>
                    <th>Bank</th>
                    <th>Address</th>
                    <th>Overdue</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {user.creditAccounts.map((acc, i) => (
                    <tr key={i}>
                      <td>{acc.accountNumber}</td>
                      <td>{acc.bankName}</td>
                      <td>{acc.address}</td>
                      <td>{acc.amountOverdue}</td>
                      <td>{acc.currentBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default XMLDisplay;
