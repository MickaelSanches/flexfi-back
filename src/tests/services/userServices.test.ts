import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { User } from "../../models/User";
import userService from "../../services/userService";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("UserService", () => {
  it("should create a new user", async () => {
    // Créer un utilisateur pour le test
    const mockUser = new User({
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      authMethod: "email",
      userReferralCode: "TEST123",
      formFullfilled: false,
      wallets: [],
      kycStatus: "none",
    });

    await mockUser.save();

    // Tester getUserById
    const foundUser = await userService.getUserById(mockUser._id.toString());
    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe("test@example.com");
  });

  it("should get a user by email", async () => {
    // Créer un utilisateur pour le test
    const mockUser = new User({
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      authMethod: "email",
      userReferralCode: "TEST123",
      formFullfilled: false,
      wallets: [],
      kycStatus: "none",
    });

    await mockUser.save();

    // Tester getUserByEmail
    const foundUser = await userService.getUserByEmail("test@example.com");
    expect(foundUser).not.toBeNull();
    expect(foundUser?._id.toString()).toBe(mockUser._id.toString());
  });

  it("should update a user", async () => {
    // Créer un utilisateur pour le test
    const mockUser = new User({
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      authMethod: "email",
      userReferralCode: "TEST123",
      formFullfilled: false,
      wallets: [],
      kycStatus: "none",
    });

    await mockUser.save();

    // Tester updateUser
    const updatedUser = await userService.updateUser(mockUser._id.toString(), {
      firstName: "Updated",
      lastName: "Name",
    });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.firstName).toBe("Updated");
    expect(updatedUser?.lastName).toBe("Name");
  });
});
