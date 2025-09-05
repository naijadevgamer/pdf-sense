import Pricing from "@/components/Pricing";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return <Pricing user={user} />;
};

export default Page;
