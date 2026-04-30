import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // CORS跨域配置
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤非DTO定义的属性
      forbidNonWhitelisted: true, // 非DTO定义的属性抛出异常
      transform: true, // 自动将请求负载转换为DTO实例
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger文档配置
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'OPC智能体系统 API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'OPC智能体系统业务API网关文档',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // 从环境变量读取端口
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API网关已启动: http://localhost:${port}/${apiPrefix}`);
  console.log(`📖 Swagger文档: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
