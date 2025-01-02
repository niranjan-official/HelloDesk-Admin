"use client";
import React, { useEffect, useState } from "react";
import { db, rtdb } from "@/firebase";
import { onValue, ref, update } from "firebase/database";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";

const Counter = () => {
    const [isRunning, setIsRunning] = useState(true);
    const [currentToken, setCurrentToken] = useState(-1);
    const [tokenStatus, setTokenStatus] = useState("pending");
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const isRunningRef = ref(rtdb, "isRunning");
        onValue(isRunningRef, (snapshot) => {
            const data = snapshot.val();
            setIsRunning(data);
        });

        const currentTokenRef = ref(rtdb, "CurrentToken");
        onValue(currentTokenRef, (snapshot) => {
            const data = snapshot.val();
            setCurrentToken(data);
        });
    }, []);

    const handlePauseClick = () => {
        const newIsRunning = !isRunning;

        update(ref(rtdb, "/"), {
            isRunning: newIsRunning,
        });

        setIsRunning(newIsRunning);
    };

    const handleSkipClick = () => {
        const newToken = currentToken + 1;
        update(ref(rtdb, "/"), {
            CurrentToken: newToken,
        });

        setCurrentToken(newToken);
    };

    const handleNext = async () => {
        setLoad(true);
        if (currentToken !== -1 && tokenStatus === "pending") {
            const tokenDocRef = doc(db, `tokens`, currentToken.toString());

            try {
                await updateDoc(tokenDocRef, {
                    status: "completed",
                    completed_at: Timestamp.now(),
                });
                setTokenStatus("completed");
            } catch (error) {
                console.error("Error updating token in Firestore:", error);
            }
        }
        setLoad(false);
        handleSkipClick();
    };

    return (
        <div className="flex flex-col">
            <div className="relative h-32 w-full flex justify-center items-center border shadow rounded-[0.4rem]">
                {!isRunning && (
                    <span className="absolute whitespace-nowrap top-0 left-1/2 -translate-x-1/2 text-xs text-white bg-red-500 rounded-b-2xl p-1 px-4">
                        System Paused
                    </span>
                )}
                <p className="text-center text-7xl font-bold">
                    {currentToken !== -1 ? (
                        currentToken
                    ) : (
                        <LoaderCircle className="animate-spin" size={40} />
                    )}
                </p>
            </div>
            <div className="flex gap-2 mt-3 text-white font-medium">
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
                    onClick={handleSkipClick}
                    className="p-1 px-6 rounded-[0.4rem] bg-red-600 shadow"
                >
                    Skip
                </button>
            </div>
            <button
                onClick={handlePauseClick}
                className="w-full rounded-[0.4rem] p-1 mt-5 bg-orange-500 text-white font-medium shadow"
            >
                {isRunning ? "Pause" : "Continue"}
            </button>
        </div>
    );
};

export default Counter;
