import { CategoryTreeResponse } from "../../typings/clients";

export default (categories: CategoryTreeResponse[]) =>
  categories.map(cateogry => ({
    id: cateogry.id,
    title: cateogry.name,
    description: cateogry.Title
  }));
