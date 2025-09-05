import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
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

    const plan = await getUserSubscriptionPlan();

    return (
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-4rem)]">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
          <div className="lg:flex w-full justify-center flex flex-col lg:flex-row h-full">
            <div className="flex-[0.35] min-w-0 lg:flex-[0.65]">
              <div className="px-2 py-2 sm:px-4">
                {/* Main area */}
                <PdfRenderer url={file.url} />
              </div>
            </div>

            <div className="flex-[0.65] border-t border-gray-200 lg:flex-[0.35] lg:border-l lg:border-t-0">
              {/* Chat wrapper*/}
              <ChatWrapper fileId={file.id} isSubscribed={plan.isSubscribed} />
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

// // app/dashboard/[fileID]/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import ChatWrapper from "@/components/chat/ChatWrapper";
// import PdfRenderer from "@/components/PdfRenderer";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { LoadingSpinner } from "@/components/LoadingSpinner";
// import { FloatingBackground } from "@/components/FloatingBackground";

// const Page = () => {
//   const { user, isLoading: userLoading } = useKindeBrowserClient();
//   const params = useParams();
//   const router = useRouter();
//   const [file, setFile] = useState<any>(null);
//   const [subscriptionPlan, setSubscriptionPlan] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fileID = params.fileID as string;

//   useEffect(() => {
//     if (!userLoading && (!user || !user.id)) {
//       toast.error("Unauthorized access", {
//         description: "Redirecting to login.",
//       });
//       router.push("/auth-callback?origin=dashboard");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // Fetch file data
//         const fileResponse = await fetch(`/api/file/${fileID}`);
//         if (fileResponse.ok) {
//           const fileData = await fileResponse.json();
//           setFile(fileData);
//         } else {
//           toast.error("File not found.");
//           router.push("/dashboard");
//           return;
//         }

//         // Fetch subscription data
//         const subscriptionResponse = await fetch("/api/subscription");
//         if (subscriptionResponse.ok) {
//           const subscriptionData = await subscriptionResponse.json();
//           setSubscriptionPlan(subscriptionData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("An unexpected error occurred. Please try again.");
//         router.push("/dashboard");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (user) {
//       fetchData();
//     }
//   }, [user, userLoading, fileID, router]);

//   if (userLoading || isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (!file) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
//       {/* <FloatingBackground /> */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.5 }}
//           className="relative z-10 flex-1 justify-between flex flex-col h-screen"
//         >
//           <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
//             <div className="lg:flex w-full">
//               {/* PDF Viewer */}
//               <div className="flex-1 min-w-0 lg:flex-[0.65]">
//                 <div className="px-4 py-6 sm:px-6">
//                   <motion.div
//                     initial={{ y: -20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <PdfRenderer url={file.url} />
//                   </motion.div>
//                 </div>
//               </div>

//               {/* Chat Panel */}
//               <div className="flex-[0.75] border-t border-gray-200 lg:flex-[0.35] lg:border-l lg:border-t-0">
//                 <motion.div
//                   initial={{ x: 20, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   className="h-full"
//                 >
//                   <ChatWrapper
//                     fileId={file.id}
//                     isSubscribed={subscriptionPlan?.isSubscribed}
//                   />
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Page;
