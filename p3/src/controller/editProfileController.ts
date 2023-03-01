import express from "express";
import { errorHandler } from "../error";
import { EditProfile } from "../model";
import { EditProfileRouters } from "../routes/routes";
import { editProfileService } from "../service/editProfileService";
export class EditProfileController extends EditProfileRouters {
  constructor() {
    super();
  }
  async editProfileOfUser(req: express.Request, res: express.Response) {
    try {
      let userId = Number(req.session.id!);
      let obj: EditProfile = req.body;
      // let password:string = req.body;
      // let user_icon :string = req.body;
      // let location :string = req.body;
      let userUpload = await editProfileService.editProfileOfUser(obj, userId);

      res.status(200).json({
        data: userUpload,
        isErr: false,
        errMess: null,
      });
    } catch (err: any) {
      errorHandler(err, req, res);
    }
  }
}
