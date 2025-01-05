"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const page = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const { toast } = useToast();

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoad(true);

    if(email !== "providenceadmin@gmail.com"){
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid Email",
      });
      setLoad(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password.trim().toLowerCase(),
      );
      Router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error.code);
      if (error.code === "auth/invalid-credential") {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid Email or password",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      }
      setLoad(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-100 px-4">
      <form
        className="flex w-full flex-col gap-4 rounded-xl border-2 border-black/50 bg-white p-4 shadow-xl max-w-2xl"
        onSubmit={login}
      >
        <div className="flex flex-col items-center justify-end">
          <Image src={"/prc-official.png"} width={120} height={120} alt=".." />
          <p className="mt-4 text-2xl sm:text-3xl font-semibold tracking-wide">Login to Admin Panel</p>
          <p className="text-sm">Enter your credential to login</p>
          <hr className="mt-3 w-3/4 bg-black/10" />
        </div>

        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="w-max rounded-[0.5rem] bg-rose-200 p-2 px-4 font-serif text-sm">
            E Mail
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="w-max rounded-[0.5rem] bg-purple-300 p-2 px-4 font-serif text-sm">
            Password
          </span>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          disabled={load}
          type="submit"
          className="flex justify-center rounded-[0.5rem] bg-green-500 p-2 font-serif text-white shadow disabled:bg-green-700"
        >
          {load ? (
            <VscLoading size={20} className="animate-spin text-white" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default page;
