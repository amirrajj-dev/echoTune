import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import React from "react";

const App = () => {
  return (
    <header>
      <SignedOut>
        <button className="btn btn-primary m-4">
        <SignInButton />
        </button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default App;
