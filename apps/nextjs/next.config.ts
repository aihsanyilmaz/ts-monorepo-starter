import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/api-client', '@repo/env', '@repo/shared'],
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
};

export default nextConfig;
