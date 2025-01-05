"use client";
import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import { Token } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const TabBody = ({ tokenData, isActive }: { tokenData: Token, isActive: boolean }) => {
    const [name, setName] = useState("");
    const [phno, setPhno] = useState("");
    const [year, setYear] = useState("");
    const [dept, setDept] = useState("");
    const [createdAt, setCreatedAt] = useState<string>("");
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
                const data = docSnap.data();
                setName(data.name);
                setPhno(data.phno);
                setYear(data.year); // Assuming 'year' is in user data
                setDept(data.dept); // Assuming 'dept' is in user data
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

    const convertToIST = (timestamp: any) => {
        const date = new Date(timestamp);
        const options: any = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        };
        return date.toLocaleString('en-IN', options);
    };

    useEffect(() => {
        if (tokenData.created_at) {
            const istTime = convertToIST(tokenData.created_at);
            setCreatedAt(istTime);
        }
    }, [tokenData.created_at]);

    return (
        <TableRow className={`${isActive && "bg-green-200"}`} key={tokenData.id}>
            <TableCell className="font-medium">{tokenData.token}</TableCell>
            <TableCell>{load ? "Loading..." : name}</TableCell>
            <TableCell>{load ? "Loading..." : year}</TableCell>
            <TableCell>{load ? "Loading..." : dept}</TableCell>
            <TableCell>{load ? "Loading..." : createdAt}</TableCell>
            <TableCell>{load ? "Loading..." : phno}</TableCell>
            <TableCell className="text-right">{tokenData.status}</TableCell>
        </TableRow>
    );
};

export default TabBody;
