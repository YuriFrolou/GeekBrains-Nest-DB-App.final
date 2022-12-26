import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../src/entities/users.entity';
import { CategoriesModule } from '../dist/news/categories/categories.module';
import { CategoriesEntity } from '../dist/entities/category.entity';
import mocked = jest.mocked;
import mock = jest.mock;


describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  const mockCategories=[{id:1,name:'cats'}];
  const mockCategoriesRepository={
    find:jest.fn().mockResolvedValue(mockCategories),
    save:jest.fn().mockImplementation(category=>Promise.resolve({id:expect.any(Number),...category}))
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    }).overrideProvider(getRepositoryToken(CategoriesEntity)).useValue(mockCategoriesRepository).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(mockCategories);
  });
  it('/categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({name:"cats"})
      .expect('content-type',/json/)
      .expect(201)
  });
});
