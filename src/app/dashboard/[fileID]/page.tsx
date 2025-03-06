import PdfRenderer from "@/components/PdfRenderer";
import { LeftSidebar } from "@/components/SidebarToggle";
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
        {/* Left sidebar  */}
        <LeftSidebar />

        {/* main wrapper  and chat wrapper*/}

        <div className="lg:flex w-full">
          <div className="flex-1 min-w-0 lg:flex-[0.65]">
            <div className="px-2 py-2 sm:px-4">
              {/* Main area */}
              <PdfRenderer url={file.url} />
            </div>
          </div>

          <div className="flex-[0.75] border-t border-gray-200 lg:flex-[0.35] lg:border-l lg:border-t-0">
            {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
            amet veniam totam cum provident molestias dolore repellat distinctio
            fugit iure quibusdam voluptas quaerat iste assumenda asperiores
            neque. Recusandae ipsam mollitia esse quod ipsum? Nam, dolor a.
            Nobis aut veritatis, officia reiciendis possimus facere vitae totam
            molestiae natus explicabo repudiandae tempore maxime nesciunt quas
            numquam harum. Nisi repellendus eligendi adipisci, minus odio
            praesentium consequuntur natus error officiis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
