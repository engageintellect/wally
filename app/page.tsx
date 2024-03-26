"use client";

import { useState } from "react";
import QRCode from "qrcode.react";
import Button from "@/components/Button"; // Adjust the import path as needed

interface WalletData {
  btcAddress: string;
  privateKey: string;
  seedPhrase: string;
}

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [requestCounter, setRequestCounter] = useState<number>(0);

  const generateWallet = async () => {
    setRequestCounter((prev) => prev + 1);
    try {
      const response = await fetch(`/api/walletGen?_=${requestCounter}`);
      const data: WalletData = await response.json();
      setWallet(data);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      setWallet(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-10 items-center bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <h1 className="text-7xl">wally.</h1>
        <p className="text-lg">Bitcoin Wallet Generator</p>
        <div className="flex items-center gap-8 py-5">
          <Button onClick={generateWallet}>Generate Wallet</Button>
        </div>
      </div>

      {wallet && (
        <div className=" w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-5">
          <h2 className="text-xl font-semibold mb-4">Wallet Data:</h2>
          <div className="space-y-4">
            {Object.entries(wallet).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-400">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-gray-700 rounded text-sm break-all">
                    {value}
                  </span>
                  <button
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    onClick={() => copyToClipboard(value)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center mt-4">
              <QRCode value={wallet.btcAddress} size={200} />
              <span className="mt-2 text-sm font-medium">
                BTC Address QR Code
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
