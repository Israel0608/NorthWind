import UserModel from "../3-models/user-model";
import jwt from "jsonwebtoken"
import { Forbidden, Unauthorized } from "../3-models/error-models";
import RoleModel from "../3-models/role-model";

class Cyber {

    private secretKey = "The-Amazing-Students-Of-Yos-Israel";

    public getNewToken(user: UserModel): string {
        //  Containing the user inside a container objact:
        const container = { user };

        // Create expiration date:
        const options = { expiresIn: "3h" };

        // Create token:
        const token = jwt.sign(container, this.secretKey, options)

        // Return the token:
        return token;

    }

    public verifyToken(token: string): void {
        if (!token) throw new Unauthorized("You are not logged in.")

        try {

            jwt.verify(token, this.secretKey);

        } catch (err: any) {

            throw new Unauthorized(err.message);

        }
    }

    public verifyAdmin(token: string): void {
        this.verifyToken(token);

        const container = jwt.verify(token, this.secretKey) as { user: UserModel };
        const user = container.user;

        if (user.roleId != RoleModel.Admin) throw new Forbidden("You are not admin");
    }

}

const cyber = new Cyber();

export default cyber;