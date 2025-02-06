# Instructies

## 1. .env Bestand Aanpassen
Open het bestand `.env` in de map `van-geel` en voeg de volgende regel toe:

```env
DATABASE_URL="postgresql://localhost:postgres@localhost:5556/postgres?schema=public"
```

## 2. Command Line Opdrachten Uitvoeren
Voer in de command line de volgende opdrachten uit:

```bash
docker-compose up -d
npx prisma migrate dev --name init
npm run dev
```

Als dit niet werkt, bel me dan even.
