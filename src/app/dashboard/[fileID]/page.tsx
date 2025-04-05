import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import { toast } from "sonner";

interface PageProps {
  fileID: string;
}

const Page = async ({ params }: { params: Promise<PageProps> }) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser(); // Fetch the user session
    const resolvedParams = await params;

    if (!user || !user.id) {
      toast.error("Unauthorized access", {
        description: "Redirecting to login.",
      });
      redirect("/auth-callback?origin=dashboard");
    }

    const file = await db.file.findFirst({
      where: { id: resolvedParams.fileID },
    });

    if (!file) {
      toast.error("File not found.");
      notFound(); // Show 404 page
    }

    return (
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
          <div className="lg:flex w-full">
            <div className="flex-1 min-w-0 lg:flex-[0.65]">
              <div className="px-2 py-2 sm:px-4">
                {/* Main area */}
                <PdfRenderer url={file.url} />
              </div>
            </div>

            <div className="flex-[0.75] border-t border-gray-200 lg:flex-[0.35] lg:border-l lg:border-t-0">
              {/* Chat wrapper*/}
              <ChatWrapper fileId={file.id} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("An error occurred:", error);
    toast.error("An unexpected error occurred. Please try again.");
    return notFound();
  }
};

export default Page;
