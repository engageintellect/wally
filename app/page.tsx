"use client";

import { useState } from "react";
import QRCode from "qrcode.react";
import Button from "@/components/Button"; // Adjust the import path as needed
import { IoCopyOutline } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import { FaBitcoin } from "react-icons/fa";
import { FaReadme } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

interface WalletData {
  btcAddress: string;
  privateKey: string;
  seedPhrase: string;
}

const keyDisplayNames: { [key in keyof WalletData]: string } = {
  btcAddress: "BTC Address",
  privateKey: "Private Key",
  seedPhrase: "Seed Phrase",
};

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
    <div>
      <main className="min-h-screen py-5 px-2 items-center bg-base-100 max-w-lg w-full mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-7xl">wally.</h1>
          <p className="text-lg">Bitcoin Wallet Generator</p>
          <div className="flex w-full max-w-md justify-center gap-2 py-5">
            <Button onClick={generateWallet}>
              <div className="flex items-center gap-2 w-full btn btn-primary">
                Generate Wallet
                <RiAiGenerate className="w-7 h-7" />
              </div>
            </Button>
            <Button onClick={() => setWallet(null)}>
              <div className="flex items-center gap-2 w-full btn btn-primary">
                Learn More
                <FaReadme className="w-7 h-7" />
              </div>
            </Button>
          </div>
        </div>

        {wallet && (
          <div className="w-full max-w-md mx-auto border-primary bg-base-100 rounded border p-5">
            <h2 className="text-xl font-semibold mb-4">Wallet Data:</h2>
            <div className="space-y-4">
              {Object.entries(wallet).map(([key, value]) => {
                const displayName = keyDisplayNames[key as keyof WalletData]; // Use a type assertion here
                return key !== "seedPhrase" ? (
                  <div key={key} className="flex flex-col mb-3">
                    <span className="text-sm font-medium">{displayName}</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={value}
                        className="border border-primary flex-grow p-2 bg-base-200 rounded text-sm overflow-scroll"
                        onClick={(e) => e.currentTarget.select()}
                      />
                      <button
                        className="p-2 bg-base-300 hover:bg-base-200 text-base-content rounded"
                        onClick={() => copyToClipboard(value)}
                      >
                        <IoCopyOutline className="w-7 h-7" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={key} className="flex flex-col mb-3">
                    <span className="text-sm font-medium">
                      {keyDisplayNames[key]}
                    </span>
                    <div className="flex gap-2">
                      <textarea
                        readOnly
                        value={value}
                        className="border border-primary flex-grow p-2 bg-base-200 rounded text-sm overflow-scroll resize-none"
                        rows={5}
                        onClick={(e) => e.currentTarget.select()}
                      />
                      <button
                        className="p-2 bg-base-300 hover:bg-base-200 text-base-content rounded"
                        onClick={() => copyToClipboard(value)}
                      >
                        <IoCopyOutline className="w-7 h-7" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-col items-center mt-4">
                <QRCode
                  className="rounded"
                  value={wallet.btcAddress}
                  size={200}
                />
                <span className="mt-2 text-sm text-primary font-medium">
                  BTC Address QR Code
                </span>
              </div>
            </div>
          </div>
        )}

        {!wallet && (
          <div className="w-full max-w-md mx-auto border-primary bg-base-100 rounded border p-5">
            <div className="flex flex-col gap-5">
              <div>
                <div className="text-xl font-semibold pb-4">What is Wally?</div>
                <div>
                  Wally is a simple Bitcoin wallet generator that creates a new
                  wallet every time you click the &quot;Generate Wallet&quot;
                  button. The wallet includes a Bitcoin address, private key,
                  and seed phrase. You can copy the wallet data to your
                  clipboard and save it in a secure location.
                </div>
              </div>

              <div>
                <div className="text-xl font-semibold pb-4">Data Privacy</div>
                <div>
                  Wally is a client-side application that generates wallet data
                  locally in your browser. The wallet data is never sent to a
                  server or stored online. You can verify this by checking the
                  network tab in your browser&apos;s developer tools.
                </div>
              </div>
            </div>

            <a
              href="https://github.com/engageintellect/wally"
              className="btn btn-primary mt-5"
            >
              <div className="flex items-center gap-2">
                Source Code
                <FaGithub className="w-7 h-7" />
              </div>
            </a>
          </div>
        )}
      </main>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>
            Built by{" "}
            <a href="https://github.com/engageintellect">@engageintellect</a>
          </p>
        </aside>
      </footer>
    </div>
  );
}
