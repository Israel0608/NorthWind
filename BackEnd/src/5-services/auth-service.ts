import { OkPacket } from "mysql";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import dal from "../2-utils/dal";
import cyber from "../2-utils/cyber";
import CredentialsModel from "../3-models/credentials-model";
import { Unauthorized } from "../3-models/error-models";

class AuthService {

    public async register(user: UserModel): Promise<string> {

        user.roleId = RoleModel.User;

        const sql = `INSERT INTO users(firstName, lastName, email, password, roleId)
            VALUES('${user.firstName}', '${user.lastName}', '${user.email}', '${user.password}', ${user.roleId})`;


        const info: OkPacket = await dal.execute(sql);

        user.id = info.insertId;

        const token = cyber.getNewToken(user);

        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {

        const sql = `SELECT * FROM users WHERE
                        email = '${credentials.email}' AND
                        password = '${credentials.password}'`;

        const users = await dal.execute(sql);

        const user = users[0];

        if (!user) throw new Unauthorized("Incorrect email or password");

        const token = cyber.getNewToken(user);


        return token;
    }

}

const authService = new AuthService();

export default authService;
