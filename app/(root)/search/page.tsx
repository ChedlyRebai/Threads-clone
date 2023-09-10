"use server"

import UserCard from "@/components/cards/UserCard"
import { fetchUser,  fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const page = async() => {

    const user =await currentUser()

    if(!user){
        redirect('/sign-in')
    }

    const userInfo=await fetchUser(user.id)

    if(!userInfo.onboarded){
        redirect('/onboarding')
    }

    const result= await fetchUsers({
        userId: user.id,
        searchString:'',
        pageNumber:1,
        pageSize:10
    })

    console.log(result?.users[0].image)

    
  return (
    <section>
        <h1 className="head-text mb-10">
            Search
        </h1>

        <div className="mt-14 flex flex-col gap-9 ">
            {
                result && result.users.length === 0 ? (
                    <h6 className="no-result">No Users</h6>
                ):(
                   <>
                      {result && result.users.map((user)=>(
                        <UserCard
                            key={user.id}
                            id={user.id}
                            name={user.name}
                            username={user.username}
                            imgUrl={user.image} 
                            personType='User'
                        />
                        ))}
                   </> 
                )
            }
        </div>
    </section>
  )
}

export default page