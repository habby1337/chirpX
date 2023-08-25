import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`@${data.username}`} | ChirpX</title>
      </Head>
      <PageLayout>
        <div className="relative h-36  border-slate-400 bg-slate-700">
          <Image
            src={data.imageUrl}
            alt={`${data.username!}'s profile picture`}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";

import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";

import { type NextPage, type GetStaticProps } from "next";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
