import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
const page =async () => {
  const user =await currentUser();
  if(!user) return null;

  const userInfo=await fetchUser(user.id)
  
  if(!userInfo.onboarded){
    redirect('/onboarding')
  }

  const activity = await getActivity(userInfo?._id);
  

  return (
    <section>
      <h1 className="head-text mb-10">
        Activity
      </h1>

      <article className="mt-10 flex flex-col gap-5 ">
        {
          activity && activity?.length > 0 ?  (

            <>
            {
              activity.map((item)=>(
                  <Link key={item._id}
                  href={`/thread/${item.parentId}`}
                  >
                      <article className="activity-card">
                      <Image
                        src={item?.author?.image}
                        alt="profile"
                        width={20}
                        height={20}
                        className="rounded-full  object-cover shadow-2xl"
                      /> 
                      <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500" >
                        {item?.author?.name} 
                      </span>  
                      {` replies to your thread`}
                      </p> 
                      </article>  
                  </Link>
              ))
            }
            </>
          ):(
              <p className="!text-base-regular text-light-3">No activity yet</p>
          )
        }

      </article>
    </section>
  )
}

export default page