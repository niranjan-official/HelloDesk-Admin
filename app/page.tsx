"use client";
import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import Header from "@/components/Header";
import TabBody from "@/components/TabBody";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Token } from "@/types";

export default function Home() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [currentToken, setCurrentToken] = useState<number>(-1);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tokens"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Token[];

            const sortedTokens = data.sort(
                (a, b) => Number(a.id) - Number(b.id)
            );

            setTokens(sortedTokens);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col">
            <Header />
            <div className="mt-8 flex flex-col w-full items-center">
                <Table className="border-2 max-w-5xl max-h-[400px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Token</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Dept</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Phone no:</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokens?.slice(-7).map((token) => (
                            <TabBody
                                key={token.id}
                                tokenData={token}
                                isActive={currentToken?.toString() === token.id}
                            />
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-10">
                    <Counter
                        setCurrentTableToken={setCurrentToken}
                        tokens={tokens}
                    />
                </div>
            </div>
        </div>
    );
}
