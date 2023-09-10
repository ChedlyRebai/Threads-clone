"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { log } from "console";
import Community from "../models/community.model";
import { FilterQuery, SortOrder } from "mongoose";
import { skip } from "node:test";
import Thread from "../models/thread.model";

interface UserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: UserParams): Promise<void> {
  try {
    connectToDB();

    const n = await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    console.log(n);

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString="",
  pageNumber=1,
  pageSize=20,
  sortBy="desc"
}:{
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {

  connectToDB()

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex=new RegExp(searchString, "i")

    const query:FilterQuery<typeof User> = {
      id : { $ne: userId },
    }


    if(searchString.trim() !== ''){
      query.$or = [
        {username :{$regex : regex}},
        {name :{$regex : regex}},
      ]
    }


    const sortOption ={createdAt : sortBy}

    const usesQuery = 
    User.find(query)
    .sort(sortOption)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUsersQuery = User.countDocuments(query)

    const users =await usesQuery.exec()

    const isNextPage = await totalUsersQuery > skipAmount + users.length

    return {users , isNextPage}
  } catch (error) {
    console.error(error)
    
  }

}


export async function getActivity(userId : string){
  try {
    connectToDB()

    const userThreads = await Thread.find({author : userId})
    //explain the code below 
    const childThreads = userThreads.reduce((acc, thread) => {
      return  [...acc, ...thread.children]
    },[])

    const replies= await Thread.find({
      _id : {$in : childThreads},
      author : {$ne : userId}
    }).populate({
      path : "author",
      model : User,
      select : "username name image _id"
    })

    return replies

  } catch (error) {
    console.log(error)
  }
}