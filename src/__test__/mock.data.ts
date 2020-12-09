import bcrypt from 'bcrypt';
import moment from 'moment';
import config from '../config';

const userRecord = {
  email: 'test@hello.world',
  password: bcrypt.hashSync('123456', config.saltRounds),
};

const validLogin = {
  email: 'test@hello.world',
  password: '123456',
};

const invalidJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsImNsaW5pY0lkIjoiIiwiaWF0IjoxNjA3MDE1NzQwfQ.TgZ2xTaLhnWg4SSQ8TUHy9z7IIerucJ261jNd9eOa9o';

const invalidLogin = {
  email: '12345',
  password: 'abc1234',
};

const imageResultFields = ['image_ID', 'thumbnails', 'preview', 'title', 'source', 'tags'];

const generateImages = (size: number, source: string, keyword: string) => {
  return [...Array(size).keys()].map(index => {
    return {
      source,
      image_ID: `${source}_${index}`,
      thumbnails: `http://${source}/${index}/thumbnails`,
      preview: `http://${source}/${index}/preview`,
      title: `${keyword}_${index}`,
      tags: [keyword, `${keyword}_${index}`],
    };
  });
};

export { userRecord, validLogin, invalidJwt, invalidLogin, imageResultFields, generateImages };
