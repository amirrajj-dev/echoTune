import { useSignIn } from "@clerk/clerk-react";

const SignInWithGoogleBtn = () => {
    const {signIn , isLoaded} = useSignIn();

    if (!isLoaded){
        return null;
    }

    const signinWithGoogle = async ()=>{
        signIn.authenticateWithRedirect({
            strategy : "oauth_google",
            redirectUrl : "/sso-callback",
            redirectUrlComplete : "/auth-callback" // for adding user to the database
        })
    }

  return (
    <button className="btn btn-soft hover:bg-base-content/20" onClick={()=>signinWithGoogle()}>
      Contiue with Google
      {/* google icon  */}
      <img src="/google.png" alt="google image" className="size-5" />
    </button>
  );
};

export default SignInWithGoogleBtn;
