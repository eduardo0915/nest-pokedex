export const EnvCOnfiguration = () => ({
  environment: process.env.NOVE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
});
