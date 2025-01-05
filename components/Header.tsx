import Image from "next/image";
import React from "react";

const Header = () => {
    return (
        <div className="p-3 sm:p-5 shadow w-full flex gap-4 items-center">
            <Image
                src={"/prc-official.png"}
                width={80}
                height={80}
                className="w-14 h-auto sm:w-20"
                alt=".."
            />
            <div className="flex flex-col">
                <h1 className="text-xl sm:text-3xl font-extrabold">
                    Hello Desk - Admin Panel
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600">
                    PROVIDENCE COLLEGE OF ENGINEERING
                </p>
            </div>
        </div>
    );
};

export default Header;
