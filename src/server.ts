import "dotenv/config";
import path from "path";
import compression from "compression";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import status from "http-status";
import morgan from "morgan";
import multer from "multer";
import routes from '@/routes';
import { seedDb } from '@/seed/seed.db';


const app = express();

const port = Number(process.env.PORT) || 5001;
const nodeEnv = process.env.NODE_ENV ?? "development";
const corsOrigin = process.env.CORS_ORIGIN;

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin ?? (nodeEnv === "production" ? false : true),
    credentials: Boolean(corsOrigin),
  }),
);
app.use(compression());
app.use(morgan(nodeEnv === "production" ? "combined" : ":method :url :status :res[content-length] - :response-time ms :date"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use('/public', express.static(path.resolve(process.cwd(), 'uploads')));

app.get("/", (_req, res) => {
  res.status(status.OK).json({ message: "Hello from Backend App" });
});

app.get("/health", (_req, res) => {
  res.status(status.OK).json({ status: "ok" });
});

const start = async () => {
  try {
    await seedDb();
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void start();


app.use('/api/v1', routes);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }

  if (error instanceof Error) {
    if (error.message === 'Unsupported file type' || error.message.includes('File too large')) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return response.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }

  return response.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
  });
});

app.use((_req, res) => {
  res.status(status.NOT_FOUND).json({ message: "Not found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} (${nodeEnv})`);
});
