import Counter from "@/components/Counter";
import TabBody from "@/components/TabBody";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase";
import { Token } from "@/types";
import { collection, getDocs } from "firebase/firestore";

const getTokens = async () => {
    try {
        let data: Token[] = [];
        const querySnapshot = await getDocs(collection(db, "tokens"));
        querySnapshot.forEach((doc: any) => {
            data.push({ id: doc.id, ...doc.data() });
            console.log(doc.id, " => ", doc.data());
        });
        return data;
    } catch (error: any) {
        console.log(error.message);
    }
    return null;
};

export default async function Home() {
    const tokens = await getTokens();
    console.log(tokens);
    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-16 sm:px-44">
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Token</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone no:</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens?.map((token) => (
                        <TabBody tokenData={token} />
                    ))}
                </TableBody>
            </Table>
                <div className="mt-10">
                    <Counter />
                </div>
        </div>
    );
}
