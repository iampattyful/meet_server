import { Knex } from "knex";
import moment from "moment";
import { knex } from "../db";
import { FilterForm, UserRows } from "../model";

export class FilterService {
  constructor(protected knex: Knex) {}
  async filter(obj: FilterForm): Promise<UserRows[]> {
    try {
      // calculate age from date of birth
      // Method 1: new Date()
      //   const endDate = new Date();
      //   endDate.setFullYear(new Date().getFullYear() - obj.minAge);
      // Method 2: moment.js
      const min_year = moment()
        .subtract(obj.maxAge, "years")
        .format("YYYY-MM-DD");
      const max_year = moment()
        .subtract(obj.minAge, "years")
        .format("YYYY-MM-DD");

      const usersRows = await this.knex
        .select(
          "id",
          "username",
          "user_icon",
          "date_of_birth",
          "gender"
          // "about_me"
          // "education_level",
          // "job",
          // "nationality",
          // "height",
          // "weight",
          // "pet",
          // "fitness",
          // "smoke",
          // "drink",
          // "image1",
          // "image2",
          // "image3",
          // "image4",
          // "image5"
        ) // add location later?
        .from("users")
        // .join("personal_information","users.id","=","personal_information.user_id")
        // .join("image","users.id","=","image.user_id")
        .whereNotIn("id", function () {
          this.select("liked_to").from("liked").where("liked_from", obj.userId);
        })
        .whereIn("gender", obj.gender)
        .andWhere("date_of_birth", ">=", min_year)
        .andWhere("date_of_birth", "<=", max_year)
        .andWhereNot("id", obj.userId)
        .orderByRaw("random()")
        .limit(20); // limit more users when there are more users in the database
      if (usersRows.length == 0) {
        throw new Error("找不到用戶!");
      }
      return usersRows;
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }
}
export let filterService = new FilterService(knex);
