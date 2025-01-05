"use client";
import React, { useEffect, useState } from "react";
import { db, rtdb } from "@/firebase";
import { onValue, ref, update } from "firebase/database";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { Token } from "@/types";

interface CounterProps {
    tokens: Token[];
    setCurrentTableToken: (token: number) => void;
}

const Counter: React.FC<CounterProps> = ({ tokens, setCurrentTableToken  }) => {
    const [isRunning, setIsRunning] = useState(true);
    const [currentToken, setCurrentToken] = useState<number | null>(null);
    const [load, setLoad] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [tokenStatus, setTokenStatus] = useState("pending");

    useEffect(() => {
        const isRunningRef = ref(rtdb, "isRunning");
        onValue(isRunningRef, (snapshot) => {
            setIsRunning(snapshot.val());
        });

        const currentTokenRef = ref(rtdb, "CurrentToken");
        onValue(currentTokenRef, (snapshot) => {
            setCurrentToken(snapshot.val());
            setCurrentTableToken(snapshot.val());
        });
    }, []);

    const handlePauseClick = () => {
        const newIsRunning = !isRunning;

        update(ref(rtdb, "/"), {
            isRunning: newIsRunning,
        });

        setIsRunning(newIsRunning);
    };

    const handleMarkCompleted = async () => {
        setLoad(true);

        if (currentToken && tokenStatus === "pending") {
            const tokenDocRef = doc(db, `tokens`, currentToken.toString());

            try {
                await updateDoc(tokenDocRef, {
                    status: "completed",
                    completed_at: Timestamp.now(),
                });
                setTokenStatus("completed");
                setIsCompleted(true); // Disable button after completion
            } catch (error) {
                console.error("Error updating token in Firestore:", error);
            }
        }

        setLoad(false);
    };

    const handleNext = async () => {
        setLoad(true);
        setIsCompleted(false);
        setTokenStatus("pending");
        // If currentToken is 0 or null, start from the first available token
        if (currentToken === 0 || currentToken === null) {
            if (tokens.length > 0) {
                update(ref(rtdb, "/"), {
                    CurrentToken: parseInt(tokens[0].id),
                });
            }
        } else {
            // Find the next token in the list
            const currentIndex = tokens.findIndex(
                (token) => token.id === currentToken?.toString()
            );

            if (currentIndex !== -1 && currentIndex + 1 < tokens.length) {
                const nextToken = tokens[currentIndex + 1].id;
                update(ref(rtdb, "/"), {
                    CurrentToken: parseInt(nextToken),
                });
            }
        }

        setLoad(false);
    };

    return (
        <div className="flex gap-10 p-8 border-4 shadow">
            <div className="flex flex-col">
                <div className="relative h-32 w-full flex justify-center items-center border shadow rounded-[0.4rem]">
                    {!isRunning && (
                        <span className="absolute whitespace-nowrap top-0 left-1/2 -translate-x-1/2 text-xs text-white bg-red-500 rounded-b-2xl p-1 px-4">
                            System Paused
                        </span>
                    )}
                    <p className="text-center text-7xl font-bold">
                        {currentToken !== null ? (
                            currentToken
                        ) : (
                            <LoaderCircle className="animate-spin" size={40} />
                        )}
                    </p>
                </div>
                <button
                    disabled={isCompleted || load}
                    onClick={handleMarkCompleted}
                    className={`mt-4 w-full p-2 rounded-[0.5rem] text-white flex justify-center items-center gap-2
            ${isCompleted ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"}
        `}
                >
                    {load ? (
                        <LoaderCircle className="animate-spin" size={20} />
                    ) : null}
                    {isCompleted ? "Completed" : "Mark as Completed"}
                </button>
            </div>
            <div className="flex flex-col w-40 gap-4 mt-3 font-semibold text-white">
                <button
                    disabled={load}
                    onClick={handleNext}
                    className="p-1 px-6 flex gap-1 justify-center items-center rounded-[0.4rem] bg-green-500 shadow"
                >
                    Next{" "}
                    {load && (
                        <LoaderCircle
                            className="animate-spin text-white"
                            size={20}
                        />
                    )}
                </button>
                <button
                    onClick={handlePauseClick}
                    className="w-full rounded-[0.4rem] p-1 bg-red-600 text-white shadow"
                >
                    {isRunning ? "Pause" : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default Counter;
