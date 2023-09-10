
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

const Page = async () => {
  const user: any = await currentUser();
  if (!user) return null;


  const userInfo = await fetchUser(user.id.toString());
  if(userInfo?.onboarded){
    redirect('/')
  }
  const userData = {
    id: userInfo.id || "",
    objectId: userInfo?._id || "",
    username: userInfo ?  userInfo?.name : user?.username,
    name: userInfo?.name || "",
    bio: userInfo?.bio || "",
    image: userInfo.imageUrl || "",
  };

  return (
    <main className="flex mx-auto max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text ">onBoarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnLabel={"Save"} />
      </section>
    </main>
  );
};

export default Page;
