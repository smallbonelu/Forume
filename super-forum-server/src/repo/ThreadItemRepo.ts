import { isThreadBodyValid } from "../common/validators/ThreadValidators";
import { QueryOneResult } from "./QueryArrayResult";
import { Thread } from "./Thread";
import { ThreadItem } from "./ThreadItem";
import { User } from "./User";

export const createThreadItem = async (
  userId: string | undefined | null,
  threadId: string,
  body: string
): Promise<QueryOneResult<ThreadItem>> => {
  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg) {
    return {
      messages: [bodyMsg],
    };
  }
  if (!userId) {
    return {
      messages: ["User not logged in."],
    };
  }

  const user = await User.findOne({ id: userId });
  if (!user) {
    return {
      messages: ["User not exist."],
    };
  }

  const thread = await Thread.findOne({ id: threadId });
  if (!thread) {
    return {
      messages: ["Thread not found."],
    };
  }

  const threadItem = await ThreadItem.create({
    user,
    body,
    thread,
  }).save();

  if (!threadItem) {
    return {
      messages: ["Failed to create ThreadItem."],
    };
  }

  return {
    messages: [`${threadItem.id}`],
  };
};
