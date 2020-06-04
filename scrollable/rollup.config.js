// rollup.config.js
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'

export default [{  // 可以使用数组，如果有多个项目需要编译
  input: 'src/index.js',
  output: [  // 如果代码有动态导入，那么输出应该指定文件夹
    {
      file: 'dist/bundle.js',
      format: 'cjs',

      // Necessary for iife/umd bundles that exports values in which case it is the global variable name representing your bundle. 
      // Other scripts on the same page can use this variable name to access the exports of your bundle.
      name: '',

      // default – suitable if you are only exporting one thing using export default ...
      // named – suitable if you are exporting more than one thing
      // none – suitable if you are not exporting anything (e.g. you are building an app, not a library)
      exports: 'named',

      // variableName pairs necessary for external imports in umd/iife bundles. For example, in a case like this…
      globals: {
        jquery: '$'
      },
      sourcemap: true
    },
    {
      file: 'dist/bundle.min.js',
      format: 'iife',
      name: 'Editor', // 对于 iife 格式是必须的，用来表示引用变量名
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    // Allow Rollup to resolve modules from `node_modules`, since it only
    // resolves local modules by default.
    resolve({
      browser: true,
    }),

    // Allow Rollup to resolve CommonJS modules, since it only resolves ES2015
    // modules by default.
    commonjs({
      // HACK: Sometimes the CommonJS plugin can't identify named exports, so
      // we have to manually specify named exports here for them to work.
      // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
      namedExports: {
        esrever: ['reverse'],
        immutable: [
          'List',
          'Map',
          'Record',
          'OrderedSet',
          'Set',
          'Stack',
          'is',
        ],
        'react-dom': ['findDOMNode'],
        'react-dom/server': ['renderToStaticMarkup'],
      },
    }),

    // Convert JSON imports to ES6 modules.
    json(),

    // Register Node.js builtins for browserify compatibility.
    builtins(),

    // Use Babel to transpile the result, limiting it to the source code.
    babel({
      include: [`src/**`],
      exclude: ["node_modules/**"],
      plugins: ["@babel/plugin-proposal-class-properties"]
    }),

    // Register Node.js globals for browserify compatibility.
    globals(),

    // Only minify the output in production, since it is very slow. And only
    // for UMD builds, since modules will be bundled by the consumer.
  ].filter(Boolean),
  external: [  // 指定的三方库将不会被打包进结果, 或源码
  ],
}]