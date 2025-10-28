# Mongoose vs Prisma - Hvorfor Mongoose for v2?

## 🎯 Beslutningen

I v1 brukte vi Prisma, men det skapte problemer. I v2 bruker vi **Mongoose** for MongoDB.

## ✅ Fordeler med Mongoose

### 1. Native MongoDB Support
- Mongoose er bygget spesifikt for MongoDB
- Full støtte for MongoDB features (aggregation, transactions, etc.)
- Ingen "oversettelse" mellom ORM og database

### 2. Enklere Schemas
```typescript
// Mongoose - enkelt og rett frem
const jobSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  status: { type: String, enum: Object.values(JobStatus) },
  tags: { type: [String], default: [] },
});
```

vs Prisma:
```prisma
// Prisma - ekstra kompleksitet for MongoDB
model Job {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @index
  title  String
  status JobStatus
  tags   String[] @default([])
}
```

### 3. Ingen Migrasjoner
- MongoDB er schema-less
- Mongoose validerer runtime
- Ingen `prisma db push` eller migration-filer
- Endringer skjer direkte i koden

### 4. Bedre TypeScript Inference
```typescript
// Mongoose - direkte typing
const job = await Job.findOne({ userId });
// job er automatisk typet som IJob | null

// Prisma - må ofte caste eller bruke generated types
const job = await prisma.job.findUnique({ where: { id } });
```

### 5. Fleksibilitet
- Mongoose lar deg bruke MongoDB queries direkte
- Aggregation pipelines
- Bulk operations
- Transactions

### 6. Vercel-vennlig
- Mongoose håndterer connection pooling bedre
- Cached connections fungerer perfekt med serverless
- Ingen "too many connections" problemer

## ❌ Problemer med Prisma (v1)

### 1. MongoDB Support er "Second Class"
- Prisma er primært bygget for SQL databases
- MongoDB features er begrenset
- Mange workarounds nødvendig

### 2. Migration Hell
- `prisma db push` fungerer ikke alltid som forventet
- Schema changes krever regenerering av client
- Komplisert i team-miljø

### 3. Generated Code
- Prisma genererer masse kode
- node_modules blir større
- Build times øker
- Vanskeligere å debugge

### 4. ObjectId Håndtering
- Prisma's ObjectId håndtering er klønete
- Må bruke `@map("_id")` overalt
- Relations er kompliserte

### 5. Connection Issues
- Prisma kan ha problemer med connection pooling på Vercel
- "Too many connections" errors
- Må ofte tweake connection limits

## 🔧 Mongoose Best Practices (som vi bruker)

### 1. Cached Connection
```typescript
// lib/db.ts
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  // ... connect logic
}
```

### 2. Lean Queries
```typescript
// Returnerer plain JavaScript objects (raskere)
const jobs = await Job.find({ userId }).lean();
```

### 3. Indexes
```typescript
// Definert direkte i schema
jobSchema.index({ userId: 1, status: 1 });
```

### 4. Virtuals & Methods
```typescript
// Mongoose lar deg legge til custom methods
jobSchema.methods.isActive = function() {
  return this.status !== JobStatus.REJECTED;
};
```

### 5. Middleware (Hooks)
```typescript
// Pre/post hooks for validering, transformering
jobSchema.pre('save', function(next) {
  // Do something before save
  next();
});
```

## 📊 Performance Sammenligning

| Feature | Mongoose | Prisma |
|---------|----------|--------|
| Query Speed | ⚡⚡⚡ | ⚡⚡ |
| Build Time | ⚡⚡⚡ | ⚡ |
| Bundle Size | 📦 Small | 📦📦 Large |
| MongoDB Features | ✅ Full | ⚠️ Limited |
| Learning Curve | 📚 Medium | 📚📚 Steep |
| Vercel Deploy | ✅ Smooth | ⚠️ Can be tricky |

## 🎓 Mongoose Tips

### Connection String
```env
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority"
```

### Error Handling
```typescript
try {
  await connectDB();
  const job = await Job.findOne({ _id: jobId, userId });
} catch (error) {
  if (error.name === 'CastError') {
    // Invalid ObjectId
  }
}
```

### Populate (Relations)
```typescript
// Populate related documents
const job = await Job.findById(jobId)
  .populate('contacts')
  .lean();
```

### Aggregation
```typescript
// Powerful queries
const stats = await Job.aggregate([
  { $match: { userId } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

## 🚀 Konklusjon

For MongoDB + Next.js + Vercel:
- ✅ **Mongoose** er det beste valget
- ❌ **Prisma** skaper unødvendig kompleksitet

Mongoose gir oss:
- Raskere utvikling
- Bedre performance
- Færre bugs
- Enklere deployment
- Full MongoDB feature support

## 📚 Ressurser

- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose + Next.js Guide](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose)
