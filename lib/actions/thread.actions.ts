"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

type ThreadParams = {
  text: string;
  accountId: string;
  communityId?: string | null;
  path: string;
};

export async function createThread({
  text,
  accountId,
  communityId,
  path,
}: ThreadParams) {
  try {
    connectToDB(); // Make sure you have a function for connecting to your database

    // Create a new thread
    const newThread = new Thread({
      author: accountId,
      text: text,
      community: communityId,
    });
    
    // Save the new thread
    await newThread.save();
    
    // Update the user with the new thread's ID
    const user = await User.findOneAndUpdate(
      { _id: accountId }, 
      { $push: { threads: newThread._id } }
    );
    
    console.log(user);
    
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for higher-level handling
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipNumber = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipNumber)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipNumber + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();
  const thread = await Thread.findById(id)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    })
    .exec();

  return thread;
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string,
) {
  connectToDB(); // Connect to the database (assuming this is a valid function)

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    console.log(threadId, commentText, userId, path);

    // Create a new comment thread
    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Update the original thread by pushing the comment thread's ID to the 'children' array
    const updatedThread = await Thread.findByIdAndUpdate(
      threadId,
      {
        $push: { children: commentThread._id },
      },
      { new: true },
    );

    console.log(updatedThread);

    // Assuming revalidatePath is a valid function, you can call it here
    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}


export async function fetchPostsByUserId(userId: string) {
  connectToDB()

  try {
    const posts = await User.findOne({ id: userId })
    .populate({
      path :"threads",
      model: Thread,
      populate:{
        path:"children",
        model: Thread,
        populate:{
          path:"author",
          model: User,
          select: "_id id name parentId image",
        }
      }
    })

    return posts
  } catch (error:any) {
    console.log(error)
  }
}