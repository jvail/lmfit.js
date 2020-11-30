import { terser } from 'rollup-plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const plugins = [
    nodeResolve(),
    commonjs()
];

export default args => ({
    input: 'src/lm.web.js',
    output: [
        { format: 'es', preferConst: true, exports: 'auto', file: 'dist/lm.js' }
    ],
    plugins: args.configDebug ? plugins : [terser(), ...plugins]
});
