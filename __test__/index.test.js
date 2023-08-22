const axios = require('axios');
const url = '127.0.0.1'

describe('Login', () => {
    test('The login route with the user', async () => {
      const res = await axios.post(url+'/auth/login', {
        email: 'testuser@email.com',
        password: '#P4ssw0rd'
      })
    expect(res.status).toBe(200)
    });

    test('The login route with the wrong user', async () => {
        const res = await axios.post(url+'/auth/login', {
            email: 'nouser@email.com',
            password: 'nouser'
        })
    expect(res.status).toBe(404);  
    })
  })