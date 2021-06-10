module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', '192.168.171.61'),
        port: env.int('DATABASE_PORT', 5433),
        database: env('DATABASE_NAME', 'wongames'),
        username: env('DATABASE_USERNAME', 'wongames'),
        password: env('DATABASE_PASSWORD', 'wongames123'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
