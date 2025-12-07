import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.habitList.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');

    const user = await prisma.user.findUnique({
      where: { email: 'test@gmail.com' },
    });

    expect(user).toBeTruthy();
  });

  it('should not register with existing email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(409);
  });

  it('should login and return access token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'password12',
    });

    expect(res.statusCode).toEqual(401);
  });
});
