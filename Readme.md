src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── errors/
│   └── repositories/      ← interfaces
│
├── application/
│   ├── use-cases/
│   ├── services/
│   └── dto/
│
├── interfaces/
│   ├── http/
│   │   ├── controllers/
│   │   ├── presenters/
│   │   └── validators/
│
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   ├── auth/
│   └── external/
│
└── main/
    ├── app.ts
    ├── routes.ts
    └── container.ts   ← DI wiring