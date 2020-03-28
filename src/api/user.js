import request from '@/utils/request';

export function login(data) {

  const a = request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
  return a;
  // return new Promise((resolve, reject) => {

  //   const res = {
  //     data: {
  //       token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmQzNjMzNjg2ZjQ0MzI5MmQwYWIxZiIsIm5hbWUiOiJkcm9kZW4iLCJpYXQiOjE1NzMwNDU1OTAsImV4cCI6MTU3MzA0OTE5MH0.-rCXuDB8ol_ii9CFwzJ4-NgUdUKJshXWnkX3K1s9HfI'
  //     }
  //   };
  //   resolve(res);

  // });

}

export function getInfo(token) {

  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  });

}

export function logout() {

  return request({
    url: '/user/logout',
    method: 'post'
  });

}
