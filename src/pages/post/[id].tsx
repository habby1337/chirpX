import Head from "next/head";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>
          {`${data.post.content}`} - {`${data.author.username}`} | ChirpX
        </title>
      </Head>
      <PageLayout>
        <div className="border-b border-slate-700 p-4 pb-6">
          <div className=" left-4 top-4 w-24 ">
            <Link
              href={"/"}
              className=" w-full rounded-md bg-slate-800  p-3 text-sm text-white hover:bg-slate-900"
            >
              {`<`} Home
            </Link>
          </div>
        </div>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

import { type NextPage, type GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { LoadingSpinner } from "~/components/loading";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
