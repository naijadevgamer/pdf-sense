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
        {/* Left sidebar  */}
        <div className="lg:flex-[0.17] bg-red-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus,
          aliquid mollitia. Cumque expedita, aliquid illum ipsam repudiandae
          odio corrupti, fugiat, dolores quas iste natus eligendi at vitae fugit
          porro itaque.
        </div>

        {/* Left sidebar & main wrapper */}
        <div className="flex-1 lg:flex-[0.55] min-w-0 bg-blue-400">
          <div className="px-2 py-2 sm:px-4">
            {/* Main area */}
            <PdfRenderer url={file.url} />
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur, odio pariatur ipsum dignissimos consectetur, maxime
            ipsa cumque deserunt modi tempore vero, nobis necessitatibus tenetur
            laudantium quisquam mollitia dolores? Aliquam, ducimus!
          </div>
        </div>

        <div className=" flex-[0.75] border-t border-gray-200 lg:flex-[0.28] lg:border-l lg:border-t-0 bg-green-400">
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ea,
          nihil facere inventore consequuntur pariatur architecto cumque nam
          assumenda nemo omnis totam similique qui, illum molestias quam
          expedita tenetur accusantium. Voluptas ducimus, quae similique minus
          maxime, debitis sed illum optio neque eum vero quidem quaerat
        </div>
      </div>
    </div>
  );
};

export default Page;
