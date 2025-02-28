import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  fileID: string;
}

const Page = async ({ params }: { params: Promise<PageProps> }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Properly await the user data

  const resolvedParams = await params;

  if (!user || !user.id) {
    console.log("DB user not found, redirecting...");
    redirect("/auth-callback?origin=dashboard");
  }

  const file = await db.file.findFirst({
    where: { id: resolvedParams.fileID },
  });

  if (!file) {
    console.log("DB file not found, redirecting...");
    notFound();
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
