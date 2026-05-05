"use client";

import { SignInButton, useAuth, UserButton, useUser } from "@clerk/nextjs";

const Users = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <>
      {isSignedIn ? (
        <div className="flex items-center gap-2">
          <UserButton />
          <span className="hidden md:inline text-sm font-semibold text-[#4b4f67]">{user?.fullName}</span>
        </div>
      ) : (
        <SignInButton mode="modal">
          <button className="rounded-full bg-[#6C4CF1] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5b3ee6] md:px-7 md:py-3 md:text-base">
            Get Started
          </button>
        </SignInButton>
      )}
    </>
  );
};
export default Users;
