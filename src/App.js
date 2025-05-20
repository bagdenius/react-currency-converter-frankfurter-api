// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

class Currency {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

export default function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState(`USD`);
  const [to, setTo] = useState(`EUR`);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCurrencies() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.frankfurter.dev/v1/currencies"
        );
        if (!response.ok)
          throw new Error(
            `Error loading currencies (code: ${response.status})`
          );

        const data = await response.json();
        const currencies = [];
        for (const [code, name] of Object.entries(data)) {
          currencies.push(new Currency(code, name));
        }
        setCurrencies(currencies);
      } catch (error) {
        console.error(`Currency load error: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    getCurrencies();
  }, []);

  useEffect(() => {
    async function convert() {
      try {
        setIsLoading(true);
        if (from === to) {
          setConvertedAmount(amount);
          return;
        }

        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );
        if (!response.ok)
          throw new Error(
            `Error converting currencies (code: ${response.status})`
          );

        const data = await response.json();
        setConvertedAmount(data.rates[to]);
      } catch (error) {
        console.error(`Converting error: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    if (amount && from && to) convert();
  }, [amount, from, to]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Currency Converter
        </h1>
        <input
          type="number"
          onChange={(e) => setAmount(+e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-4 mb-4">
          <select
            onChange={(e) => setFrom(e.target.value)}
            value={from}
            className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setTo(e.target.value)}
            value={to}
            className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code}
              </option>
            ))}
          </select>
        </div>
        <p className="text-center text-xl font-semibold">
          {isLoading
            ? "Loading..."
            : convertedAmount
            ? `${convertedAmount} ${to}`
            : "Enter amount to convert"}
        </p>
      </div>
    </div>
  );
}
