const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('saojeong-dev', 'saojeong-dev', 'password', {
  host: 'hostname',
  dialect: 'mariadb',
});

const dbTest = async () => {
  try {
    const isauthenticated = await sequelize.authenticate();
    console.log('데이터베이스에 성공적으로 연결되었습니다.', isauthenticated);
  } catch (err) {
    console.error('데이터베이스에 오류가 발생하였습니다.');
    throw new Error('데이터베이스 연결에 실패하였습니다.', err);
  }
};

dbTest();

module.exports = sequelize;
