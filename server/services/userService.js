const prisma = require('../prismaClient');

const createUser = async (data) => {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      universityId: data.universityId || null,
      department: data.department || null
    }
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers
};
