import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';
import { getTodayDate } from '../utils/date.utils';

const prisma = new PrismaClient();

describe('Habits and Entries integration tests', () => {
  let token: string;
  let testListId: string;
  let habitId: string;

  beforeAll(async () => {
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.habitList.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/api/auth/register').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'password123',
    });

    token = loginRes.body.accessToken;

    const listRes = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
      });

    testListId = listRes.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a habit inside the list', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Prysznic',
        listId: testListId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.listId).toEqual(testListId);
    habitId = res.body.id;
  });

  it('should mark habit as done (create entry)', async () => {
    const today = getTodayDate();

    const res = await request(app)
      .post(`/api/habits/${habitId}/toggle`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        habitId: habitId,
        date: today,
      });

    expect(res.statusCode).toEqual(200);
  });

  it('should delete a habit', async () => {
    const res = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);

    const deletedHabit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    expect(deletedHabit).toBeNull();
  });

  it('should cascade delete entries when habit is deleted', async () => {
    const habitRes = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pływanie',
        listId: testListId,
      });

    const tempHabitId = habitRes.body.id;
    const today = getTodayDate();

    await request(app)
      .post(`/api/habits/${tempHabitId}/toggle`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        habitId: tempHabitId,
        date: today,
      });

    const entryBefore = await prisma.habitEntry.findFirst({
      where: { habitId: tempHabitId },
    });

    expect(entryBefore).not.toBeNull();

    const deleteRes = await request(app)
      .delete(`/api/habits/${tempHabitId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toEqual(204);

    const entryAfter = await prisma.habitEntry.findFirst({
      where: { habitId: tempHabitId },
    });

    expect(entryAfter).toBeNull();
  });
});
