"use client";
import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import { Token } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const TabBody = ({ tokenData }: { tokenData: Token }) => {
    const [name, setName] = useState("");
    const [phno, setPhno] = useState("");
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (tokenData.uid) {
            getData(tokenData.uid);
        }
    }, [tokenData.uid]);

    const getData = async (uid: string) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const data = docSnap.data();
                setName(data.name);
                setPhno(data.phno);
            } else {
                console.log("No such document!");
                return;
            }
        } catch (error: any) {
            console.log(error.message);
            return;
        }
        setLoad(false);
    };

    return (
        <TableRow key={tokenData.id}>
            <TableCell className="font-medium">{tokenData.token}</TableCell>
            <TableCell>{load ? "Loading..." : name}</TableCell>
            <TableCell>{load ? "Loading..." : phno}</TableCell>
            <TableCell className="text-right">{tokenData.status}</TableCell>
        </TableRow>
    );
};

export default TabBody;
