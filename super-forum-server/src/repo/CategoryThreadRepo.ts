import CategoryThread from "./CategoryThread";
import { Thread } from "./Thread";
import { ThreadCategory } from "./ThreadCategory";

export const getTopCategoryThread = async (): Promise<
  Array<CategoryThread>
> => {
  const categories = await ThreadCategory.createQueryBuilder("threadCategory")
    .leftJoinAndSelect("threadCategory.threads", "thread")
    .getMany();

  const categoryThreads: Array<CategoryThread> = [];
  // sort categories with most threads on top then desc
  categories.sort((a: ThreadCategory, b: ThreadCategory) => {
    if (a.threads.length > b.threads.length) return -1;
    if (a.threads.length < b.threads.length) return 1;
    return 0;
  });

  const topCategories = categories.slice(0, 3);
  // sort the threads by createdOn desc
  topCategories.forEach((category) => {
    category.threads.sort((a: Thread, b: Thread) => {
      if (a.createdOn > b.createdOn) return -1;
      if (a.createdOn < b.createdOn) return 1;
      return 0;
    });
    category.threads.forEach((thread) => {
      categoryThreads.push(
        new CategoryThread(
          thread.id,
          category.id,
          category.name,
          thread.title,
          thread.createdOn
        )
      );
    });
  });

  return categoryThreads;
};
