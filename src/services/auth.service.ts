import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import User from '@models/users.model';
import { SignupDto, LoginDto } from '@dtos/auth.dto';

@Service()
export class AuthService {
  public async signup(userData: SignupDto): Promise<{ user: Partial<User>; tokenData: TokenData }> {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new HttpException(409, `User with email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const tokenData = this.createToken(user);
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    };

    return { user: userWithoutPassword, tokenData };
  }

  public async login(loginData: LoginDto): Promise<{ user: Partial<User>; tokenData: TokenData }> {
    const user = await User.findOne({
      where: { email: loginData.email, is_deleted: false },
    });

    if (!user) {
      throw new HttpException(401, 'Invalid email or password');
    }

    const isPasswordValid = await compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid email or password');
    }

    const tokenData = this.createToken(user);
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    };

    return { user: userWithoutPassword, tokenData };
  }

  public async getProfile(userId: number): Promise<Partial<User>> {
    const user = await User.findOne({
      where: { id: userId, is_deleted: false },
      attributes: ['id', 'email', 'name', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return user;
  }

  private createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      email: user.email,
    };

    const expiresIn = 60 * 60 * 24; // 24 hours
    const token = sign(dataStoredInToken, SECRET_KEY, { expiresIn });

    return { token, expiresIn };
  }
}
