import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import usersRepository, {
  UsersRepository,
} from "@/repositories/users.repository";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas/users.schema";
import { UserWithoutPassword } from "@/types";

class UsersService {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async createUser(user: CreateUserSchema["body"]) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
  }

  retrieveUsers() {
    return this.usersRepository.findMany();
  }

  retrieveUser(id: string): Promise<UserWithoutPassword | null> {
    return this.usersRepository.findOne(id);
  }

  updateUser(
    id: string,
    user: UpdateUserSchema["body"]
  ): Promise<Partial<User>> {
    return this.usersRepository.update(id, user);
  }

  deleteUser(id: string) {
    return this.usersRepository.remove(id);
  }

  // async validateUserCredentials(credentials: {
  //   email: string;
  //   password: string;
  // }) {
  //   const user = await this.usersRepository.findOneByEmail(credentials.email);
  //   if (!user) throw new NotFoundError("Invalid credentials");

  //   const isPasswordValid = await bcrypt
  //     .compare(credentials.password, user.password)
  //     .catch((e) => {
  //       if (e instanceof Error) logger.error(e.message);
  //       throw new BadRequestError("Invalid credentials");
  //     });

  //   if (!isPasswordValid) throw new BadRequestError("Invalid credentials");

  //   const { password, ...userWithoutPassword } = user;
  //   return userWithoutPassword;
  // }
}

const usersService = new UsersService(usersRepository);

export default usersService;
