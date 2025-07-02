import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

const Home = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton>
          Sign In
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
        Dashboard Home Page
      </SignedIn>
    </div>

  )
}
export default Home