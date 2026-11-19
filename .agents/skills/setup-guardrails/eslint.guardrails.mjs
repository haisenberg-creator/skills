import comments from "@eslint-community/eslint-plugin-eslint-comments";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const zeroDelayTimeoutSelectors = [
  {
    selector: "CallExpression[callee.name='setTimeout'][arguments.length=1]",
    message:
      "setTimeout without an explicit delay hides a timing or ordering bug. Fix the root cause instead: await the promise, derive state during render, or use the proper callback.",
  },
  {
    selector:
      "CallExpression[callee.name='setTimeout'][arguments.1.type='Literal'][arguments.1.value<=50]",
    message:
      "setTimeout with a zero or tiny delay (<=50ms) hides a timing or ordering bug. Fix the root cause instead: await the promise, derive state during render, or use the proper callback.",
  },
];

const banDirectUseEffectSelectors = [
  {
    selector: "CallExpression[callee.name='useEffect']",
    message:
      "Do not call useEffect directly in a component. Derive values during render or run side effects in an event handler. If synchronizing with an external system is required, extract a named custom hook in a use*.ts(x) file.",
  },
  {
    selector:
      "CallExpression[callee.object.name='React'][callee.property.name='useEffect']",
    message:
      "Do not call React.useEffect directly in a component. Derive values during render or run side effects in an event handler. If synchronizing with an external system is required, extract a named custom hook in a use*.ts(x) file.",
  },
];

export const guardrailConfigs = [
  {
    name: "guardrails/base",
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "@eslint-community/eslint-comments": comments,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-expect-error": "allow-with-description",
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "@eslint-community/eslint-comments/no-unlimited-disable": "error",
      "@eslint-community/eslint-comments/require-description": [
        "error",
        { ignore: [] },
      ],
      "no-restricted-syntax": ["error", ...zeroDelayTimeoutSelectors],
    },
  },
  {
    name: "guardrails/no-component-use-effect",
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "**/use*.{ts,tsx}",
      "**/hooks/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "e2e/**",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...zeroDelayTimeoutSelectors,
        ...banDirectUseEffectSelectors,
      ],
    },
  },
];

export default guardrailConfigs;
