import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-scroll  border-x-4 border-slate-800 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
