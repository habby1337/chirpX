import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type RouterOutputs, api } from "~/utils/api";

import Image from "next/image";
import { LoadingButton, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.content;
      if (errorMessage) {
        toast.error(errorMessage[0]!);
        return;
      } else toast.error("Failed to post! Please try again.");
    },
  });

  if (!user) return null;
  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="h-12 w-12 rounded-full"
        width={48}
        height={48}
      />
      <input
        placeholder="What's on your mind? use only emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingButton />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if (postLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //Start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="border-b-1 flex justify-center border-slate-800 p-2">
          {!isSignedIn && (
            <SignInButton>
              <button className="rounded-md border-2 border-slate-500 bg-slate-800 p-2 text-white">
                Sign in
              </button>
            </SignInButton>
          )}
          {!!isSignedIn && (
            <SignOutButton>
              <button className="rounded-md border-2 border-slate-500 bg-slate-800 p-2 text-white">
                Sign out
              </button>
            </SignOutButton>
          )}
        </div>
        <div className="flex border-b border-slate-400 p-4">
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
}
