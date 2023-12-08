import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import marketRegistryABI from '../ABIs/marketRegistery.json';

function App() {
  const [marketCount, setMarketCount] = useState(null);

  useEffect(() => {
    async function fetchMarketCount() {
      try {
        // Connect to MetaMask or an Ethereum node
        const web3 = new Web3(window.ethereum);

        // Get the user's current Ethereum address
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        // Load the smart contract ABI and address
        const contract = new web3.eth.Contract(marketRegistryABI, '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0');

        // Call the marketCount function
        const count = await contract.methods.marketCount().call({ from: address });

        // Update the state with the result
        setMarketCount(count);
      } catch (error) {
        console.error('Error fetching marketCount:', error);
      }
    }

    fetchMarketCount();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <h1>Market Count: {marketCount}</h1>
    </div>
  );
}

export default App;
