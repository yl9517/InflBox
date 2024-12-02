const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter migration name: ', (migrationName) => {
  if (!migrationName) {
    console.error('❌ Migration name is required!');
    rl.close();
    process.exit(1);
  }

  try {
    // 마이그레이션 실행
    console.log(`🚀 Running migration: ${migrationName}`);
    execSync(`npx prisma migrate dev --name ${migrationName}`, {
      stdio: 'inherit',
    });
    console.log('✅ Migration completed successfully!');

    // Prisma 클라이언트 생성
    console.log('🔄 Running prisma generate...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated!');

    // DB 스키마 적용
    console.log('🔄 Running prisma db push...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed!');
  } catch (error) {
    console.error('❌ An error occurred:', error.message);
  } finally {
    rl.close();
  }
});
