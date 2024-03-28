"use client";

import { useState } from "react";
import QRCode from "qrcode.react";
import Button from "@/components/Button"; // Adjust the import path as needed
import { IoCopyOutline } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import { FaReadme } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [requestCounter, setRequestCounter] = useState<number>(0);

  const generateWallet = async () => {
    setRequestCounter((prev) => prev + 1);
    try {
      setLoading(true);
      const response = await fetch(`/api/walletGen?_=${requestCounter}`);
      const data: WalletData = await response.json();
      setWallet(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      setWallet(null);
    }
  };

  // const copyToClipboard = async (text: string) => {
  //   if ("clipboard" in navigator) {
  //     return await navigator.clipboard.writeText(text);
  //   } else {
  //     return document.execCommand("copy", true, text);
  //   }
  // };

  const copyToClipboard = async (text: string) => {
    try {
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
        setToast({ message: "Copied to clipboard!", type: "success" });
      } else {
        // Fallback for older browsers
        const successful = document.execCommand("copy", true, text);
        if (successful) {
          setToast({ message: "Copied to clipboard!", type: "success" });
        } else {
          throw new Error("Copy command was unsuccessful");
        }
      }
      setTimeout(() => setToast({ message: "", type: "" }), 3000); // Hide toast after 3 seconds
    } catch (error) {
      setToast({ message: "Failed to copy!", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000); // Hide toast after 3 seconds
    }
  };

  return (
    <div>
      {/* Toast notification */}
      {toast.message && (
        <div className={`toast toast-bottom toast-center toast-${toast.type}`}>
          <div className={`alert alert-success`}>
            <div>
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen py-5 md:py-10 px-2 items-center bg-base-100 max-w-lg w-full mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-7xl">wally.</h1>
          <p className="text-lg">Bitcoin Wallet Generator</p>
          <div className="flex w-full max-w-md justify-center gap-2 py-5">
            <Button onClick={generateWallet}>
              <div className="flex items-center gap-2 w-full btn btn-primary">
                Generate Wallet
                {loading ? (
                  // <span className="loading loading-spinner"></span>
                  <AiOutlineLoading3Quarters className="w-7 h-7 animate-spin" />
                ) : (
                  <RiAiGenerate className="w-7 h-7" />
                )}
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
            <div className="text-xl font-semibold mb-4">
              <div className="flex items-center gap-2">
                Wallet Data:
                <a
                  href={`https://www.blockchain.com/explorer/addresses/btc/${wallet.btcAddress}`}
                  target="_blank"
                  className="btn btn-primary"
                >
                  View on Blockchain
                </a>
              </div>
            </div>
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
                  // TODO: Seed phrase display
                  <></>
                  // <div key={key} className="flex flex-col mb-3">
                  //   <span className="text-sm font-medium">
                  //     {keyDisplayNames[key]}
                  //   </span>
                  //   <div className="flex gap-2">
                  //     <textarea
                  //       readOnly
                  //       value={value}
                  //       className="border border-primary flex-grow p-2 bg-base-200 rounded text-sm overflow-scroll resize-none"
                  //       rows={5}
                  //       onClick={(e) => e.currentTarget.select()}
                  //     />
                  //     <button
                  //       className="p-2 bg-base-300 hover:bg-base-200 text-base-content rounded"
                  //       onClick={() => copyToClipboard(value)}
                  //     >
                  //       <IoCopyOutline className="w-7 h-7" />
                  //     </button>
                  //   </div>
                  // </div>
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
                  Wally is a simple Bitcoin wallet generator that creates a new,
                  random, Bitcoin wallet every time you click the &quot;Generate
                  Wallet&quot; button. The wallet includes a Bitcoin address and
                  private key. You can copy the wallet data to your clipboard
                  and save it in a secure location.
                </div>
              </div>

              <div>
                <div className="text-xl font-semibold pb-4">Data Privacy</div>
                <div>
                  Wally is a client-side application that generates wallet data
                  locally in your browser. The wallet data is never sent back to
                  a server or stored in any database. You can verify this by
                  checking the network tab in your browser&apos;s developer
                  tools.
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
