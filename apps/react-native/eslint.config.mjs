import config from '@repo/eslint-config';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  ...config,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['.expo/', 'dist/'],
  },
];
