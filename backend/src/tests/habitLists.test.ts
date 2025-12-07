import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Habit logic (Protected routes)', () => {
  let token: string;
  let listId: string;

  beforeAll(async () => {
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.habitList.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/api/auth/register').send({
      email: 'tester@example.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'tester@example.com',
      password: 'password123',
    });

    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new habit list', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Praca',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Praca');

    listId = res.body.id;
  });

  it('should get all habit lists for user', async () => {
    const res = await request(app)
      .get('/api/lists')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toEqual('Praca');
  });

  it('should failt to create list without token', async () => {
    const res = await request(app)
      .post('/api/lists')
      .send({ name: 'Siłownia' });

    expect(res.statusCode).toEqual(401);
  });

  it('should delete a list', async () => {
    const res = await request(app)
      .delete(`/api/lists/${listId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);

    const deletedList = await prisma.habitList.findUnique({
      where: { id: listId },
    });

    expect(deletedList).toBeNull();
  });

  it('should cascade delete habits when list is deleted', async () => {
    const listRes = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cascade Test' });

    expect(listRes.statusCode).toEqual(201);

    const cascadeListId = listRes.body.id;

    const habitRes = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Habit inside', listId: cascadeListId });

    expect(habitRes.statusCode).toEqual(201);

    const habitId = habitRes.body.id;

    await request(app)
      .delete(`/api/lists/${cascadeListId}`)
      .set('Authorization', `Bearer ${token}`);

    const habitCheck = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    expect(habitCheck).toBeNull();
  });
});
