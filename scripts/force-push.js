const { execSync } = require('child_process');

const url = "postgresql://neondb_owner:npg_bExFcZg28lWp@ep-billowing-wind-aj21iyvm.us-east-2.aws.neon.tech/neondb?sslmode=require";

try {
  console.log('Running prisma db push...');
  execSync('npx prisma db push --force-reset --accept-data-loss', {
    env: {
      ...process.env,
      DATABASE_URL: url
    },
    stdio: 'inherit'
  });
  console.log('Successfully pushed schema!');
} catch (error) {
  console.error('Failed to push schema:', error.message);
}
