import { IResolvers } from "apollo-server-express";
import CategoryThread from "../repo/CategoryThread";
import { getTopCategoryThread } from "../repo/CategoryThreadRepo";
import { QueryArrayResult, QueryOneResult } from "../repo/QueryArrayResult";
import { Thread } from "../repo/Thread";
import { ThreadCategory } from "../repo/ThreadCategory";
import { getAllCategories } from "../repo/ThreadCategoryRepo";
import { ThreadItem } from "../repo/ThreadItem";
import { updateThreadItemPoint } from "../repo/ThreadItemPointRepo";
import { createThreadItem } from "../repo/ThreadItemRepo";
import { updateThreadPoint } from "../repo/ThreadPointRepo";
import {
  createThread,
  getThreadById,
  getThreadsByCategoryId,
  getThreadsLatest,
} from "../repo/ThreadRepo";
import { User } from "../repo/User";
import {
  changePassword,
  login,
  logout,
  me,
  register,
  UserResult,
} from "../repo/UserRepo";
import { GqlContext } from "./GqlContext";

const STANDARD_ERROR = "An error has occurred";
interface EntityResult {
  messages: Array<string>;
}

declare module "express-session" {
  export interface SessionData {
    userId: any;
  }
}

const resolvers: IResolvers = {
  ThreadResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "Thread";
    },
  },

  ThreadArrayResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "ThreadArray";
    },
  },

  UserResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "User";
    },
  },

  Query: {
    getThreadById: async (
      obj: any,
      args: { id: string },
      ctx: GqlContext,
      info: any
    ): Promise<Thread | EntityResult> => {
      let result: QueryOneResult<Thread>;
      try {
        result = await getThreadById(args.id);
        if (result.entity) {
          return result.entity;
        }
        return {
          messages: result.messages ? result.messages : ["test"],
        };
      } catch (error) {
        throw error;
      }
    },

    getThreadsByCategoryId: async (
      obj: any,
      args: { categoryId: string },
      ctx: GqlContext,
      info: any
    ): Promise<{ threads: Array<Thread> } | EntityResult> => {
      let threads: QueryArrayResult<Thread>;
      try {
        threads = await getThreadsByCategoryId(args.categoryId);
        if (threads.entities) {
          return {
            threads: threads.entities,
          };
        }
        return {
          messages: threads.messages
            ? threads.messages
            : ["An error has occurred"],
        };
      } catch (error) {
        throw error;
      }
    },

    getThreadsLatest: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<{ threads: Array<Thread> } | EntityResult> => {
      let threads: QueryArrayResult<Thread>;
      try {
        threads = await getThreadsLatest();
        if (threads.entities) {
          return {
            threads: threads.entities,
          };
        }
        return {
          messages: threads.messages
            ? threads.messages
            : ["An error has occurred"],
        };
      } catch (error) {
        throw error;
      }
    },

    getTopCategoryThread: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<CategoryThread>> => {
      let topCategoryThread: Array<CategoryThread>;
      try {
        topCategoryThread = await getTopCategoryThread();
        return topCategoryThread;
      } catch (error) {
        throw error;
      }
    },
    getAllCategories: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<ThreadCategory> | EntityResult> => {
      let categories: QueryArrayResult<ThreadCategory>;
      try {
        categories = await getAllCategories();
        if (categories.entities) {
          return categories.entities;
        }
        return {
          messages: categories.messages
            ? categories.messages
            : [STANDARD_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },
    me: async (
      obj: any,
      args: {},
      ctx: GqlContext,
      info: any
    ): Promise<User | EntityResult> => {
      let userResult: UserResult;

      try {
        const userId = ctx.req.session?.userId;
        if (!userId) {
          return {
            messages: ["User was not login"],
          };
        }
        userResult = await me(userId);
        if (userResult && userResult.user) {
          return userResult.user;
        }
        return {
          messages: userResult.messages
            ? userResult.messages
            : [STANDARD_ERROR],
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  Mutation: {
    register: async (
      obj: any,
      args: { email: string; userName: string; password: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let userResult: UserResult;
      try {
        userResult = await register(args.email, args.userName, args.password);
        if (userResult && userResult.user) {
          return "Registration successful.";
        }
        return userResult.messages ? userResult.messages[0] : STANDARD_ERROR;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    login: async (
      obj: any,
      args: { userName: string; password: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let loginResult: UserResult;
      try {
        loginResult = await login(args.userName, args.password);
        if (loginResult && loginResult.user) {
          ctx.req.session!.userId = loginResult.user.id;
          return `Login successful for userId ${ctx.req.session!.userId}.`;
        }

        return loginResult.messages ? loginResult.messages[0] : STANDARD_ERROR;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    logout: async (
      obj: any,
      args: { userName: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        let result = await logout(args.userName);
        ctx.req.session?.destroy((error: any) => {
          if (error) {
            console.log("destroy session failed");
            return;
          }
          console.log("session destroyed", ctx.req.session?.userId);
        });
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    changePassword: async (
      obj: any,
      args: { newPassword: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        if (!ctx.req.session || !ctx.req.session!.userId) {
          return "You must be logged in before you can change your password.";
        }
        let result = await changePassword(
          ctx.req.session!.userId,
          args.newPassword
        );
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    createThread: async (
      obj: any,
      args: { userId: string; categoryId: string; title: string; body: string },
      ctx: GqlContext,
      info: any
    ): Promise<EntityResult> => {
      let result: QueryOneResult<Thread>;
      try {
        result = await createThread(
          args.userId,
          args.categoryId,
          args.title,
          args.body
        );
        return {
          messages: result.messages
            ? result.messages
            : ["An error has ocurred"],
        };
      } catch (error) {
        throw error;
      }
    },

    createThreadItem: async (
      obj: any,
      args: { userId: string; threadId: string; body: string },
      ctx: GqlContext,
      info: any
    ): Promise<EntityResult> => {
      let result: QueryOneResult<ThreadItem>;
      try {
        result = await createThreadItem(args.userId, args.threadId, args.body);
        return {
          messages: result.messages ? result.messages : [STANDARD_ERROR],
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    updateThreadPoint: async (
      obj: any,
      args: { threadId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result: string = "";
      try {
        if (!ctx.req.session || !ctx.req.session?.userId) {
          return "You must be logged in to set likes.";
        }
        result = await updateThreadPoint(
          ctx.req.session!.userId,
          args.threadId,
          args.increment
        );
        return result;
      } catch (error) {
        throw error;
      }
    },

    updateThreadItemPoint: async (
      obj: any,
      args: { threadItemId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result: string = "";
      try {
        if (!ctx.req.session || !ctx.req.session?.userId) {
          return "You must be logged in to set likes.";
        }
        result = await updateThreadItemPoint(
          ctx.req.session!.userId,
          args.threadItemId,
          args.increment
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default resolvers;
