import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@repo/api-client', '@repo/env', '@repo/shared'],
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
};

export default nextConfig;
