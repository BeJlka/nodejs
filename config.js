module.exports = {
  PORT: 5000,
  // mongoURL:
  //   'mongodb+srv://user1:user1@cluster0.lpqfk.azure.mongodb.net/portal?retryWrites=true&w=majority',
  UPLOADS: 'uploads',
  jwt: {
    secret: 'jwt secret for nodejs test project',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '10m',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '24h',
      },
    },
  },
};
