'use client';
// import Image from 'next/image'

// import styles from '../styles/page.module.css'
// import type { NextPage } from "next";
// import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";

import Header from "../components/Header";
import Essay from '../utils/essay';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [searchquery, setSearchQuery] = useState("");
  const [relevantEssays, setrelevantEssays] = useState<Essay[]>([]);

  const lookupPassages = async (e: any) => {
    // will take a query and will perform a lookup 
    
    e.preventDefault();
    
    try{
      const response = await fetch('/api/embedsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchquery }),
      });
      
      if (!response.ok) {
        console.log('response fails')
        throw new Error(response.statusText);
      }
      const data = await response.json();

      const essays = data.map((essayData) => new Essay(essayData)).filter((essay) => essay.contentLength > 120);
      essays.sort((a, b) => b.similarity - a.similarity);
      setrelevantEssays(essays);
      // console.log('data', data)
      // console.log('SearchQuery:', searchquery)
      // console.log('relevantEssays', relevantEssays)
      // console.log(loading)
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
  } 
  setLoading(false);
};
return (
  <div className="flex-1">
    <Header />
    <div className="bg-white py-10 px-6 lg:px-14">
      <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">
        Search Paul Graham&apos;s articles. 
      </h1>
      <h2 className="text-1xl  text-slate-900 text-center mb-4">
        Embedding-based similarity search on all of Paul Graham&apos;s articles. Details on GitHub.

      </h2>
      <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto space-y-8 ">
        <form onSubmit={lookupPassages} className="flex flex-col items-center">
          <div className="mb-4">
            <input
              type="text"
              value={searchquery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="px-8 py-2 bg-orange-400 text-black rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-black"
              >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-10 my-10">
        
        {relevantEssays.length > 0  && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Matching Results
              </h2>
            </div>
            <div className="mx-auto max-w-3xl space-y-8">
              {relevantEssays.map((essay) => (
                <div
                  className="group relative focus:outline-none block border border-black py-4 lg:py-10 px-6 lg:px-14 bg-white overflow-hidden transform transition hover:scale-[1.01] h-full will-change-transform rounded-3xl"
                  key={essay.id}
                >
                  <div className="relative max-w-screen-sm mr-4 lg:mr-8 w-full z-10">
                    <div className="mt-4">
                      <div
                        className="inline-block rounded-md px-3 py-2 uppercase tracking-widest text-xs font-semibold"
                        style={{ background: '#F0883E33', color: '#F0883E' }}
                      >
                        <a href={essay.essayUrl} target="_blank" rel="noopener noreferrer">
                          {essay.essayTitle}
                        </a>
                      </div>
                    </div>
                    <div className="text-gh-textLight mt-3">
                      {essay.essayDate}
                    </div>
                    <div className="font-light text-gf3 mt-5 pb-5">
                      {essay.content.replace(/([.,?!])(?=\S)/g, '$1 ').replace(/\s+/g, ' ').replace(/�/g, " - ")}
                    </div>
                  </div>
                  <div className="absolute top-0 bottom-0 right-0 w-[max(30em,50%)] opacity-80"></div>
                </div>
              ))}
            </div>
          </>
        )}
        {relevantEssays.length === 0 && !loading && (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-slate-900">
      No Matching Results
    </h2>
    <p className= "mt-5">No essays that match your search criteria. Try searching something else.</p>
  </div>
)}
      </div>
    </div>
  </div>
);


              }