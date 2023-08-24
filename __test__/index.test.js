const axios = require('axios');
const url = '127.0.0.1'

const axiosInstance = axios.create({baseURL: 'http://'+url})
let userId = 0
let token = ""

describe('Signup', () => {
  test('All parameters have valid format', async () => {
    const res = await axiosInstance.post('/auth/signup', {
      email: 'user@email.com',
      password: '#P4ssw0rd'
    })
    userId = res.data.id;
    expect(res.status).toBe(201)
  });

  test('Email has invalid format', async () => {
    try{
      const res = await axiosInstance.post('/auth/signup', {
          email: 'nouseremail.com',
          password: '#P4ssw0rd'
      })
    } catch(e){
      expect(e.response.status).toBe(400);
    }
  })

  test('Password has invalid format', async () => {
    try{
      const res = await axiosInstance.post('/auth/signup', {
          email: 'nouser@email.com',
          password: 'password'
      })
    } catch(e){
      expect(e.response.status).toBe(400);
    }
  })
})

describe('Login', () => {
    test('User exists', async () => {
      const res = await axiosInstance.post('/auth/login', {
        email: 'user@email.com',
        password: '#P4ssw0rd'
      })
    token = res.data.token
    expect(res.status).toBe(200)
    });

    test('Delete user as user', async () => {

      console.log(token)
      console.log(userId)
      const res = await axiosInstance.delete('/users/'+userId, {
        headers: { Authorization: 'Bearer '+token },
        data:{
            password: "#P4ssw0rd"
        }
      });

      expect(res.status).toBe(204)

    });

    test("User doesn't exist", async () => {
      try{
        const res = await axiosInstance.post('/auth/login', {
            email: 'nouser@email.com',
            password: 'nouser'
        })
      } catch(e){
        expect(e.response.status).toBe(404);
      }
    })
  })