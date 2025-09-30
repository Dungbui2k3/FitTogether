export const config = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-auth',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
});