import { fetchPostsByUserId } from "@/lib/actions/thread.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

type ThreadsTabProps = {
currentUserId: string;
accountId: string;
accountType: string;
}



const ThreadsTab =async ({currentUserId,accountId,accountType}:ThreadsTabProps) => {

    let result:any;
    if(accountType === "User"){
        result = await fetchPostsByUserId(accountId)
    }else{
        result = await fetchCommunityPosts(accountId)
    }
    
    const CurrentUser = await currentUser()
    if(!result) {
        redirect('/')
    }


    return (
    <section className="mt-9 flex flex-col gap-10">
        {
                result.threads.map((thread:any) => (
                    <ThreadCard
                    key={thread._id}
                   
                    id={thread._id}
                    currentUserId={CurrentUser?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User" 
                        ? {name : result.name , image : result.image , id : result.id}
                        : {name : thread.name , image : thread.author.image , id : thread.author.id}
                    }
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    />    
                ))
        }
    </section>
  )
}

export default ThreadsTab
