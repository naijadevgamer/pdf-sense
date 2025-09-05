import {
  getKindeServerSession,
  // LoginLink,
  // RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return <NavbarClient user={user} />;
};

export default Navbar;
