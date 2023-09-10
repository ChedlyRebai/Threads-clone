
import CreatePostThread from "@/components/forms/CreatePostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <h1 className="head-text ">You must be logged in to create a thread.</h1>
    );
  }

  const userInfo = await fetchUser(user.id.toString());
  
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <CreatePostThread userId={userInfo?._id.toString()} />
    </>
  );
};

export default page;
