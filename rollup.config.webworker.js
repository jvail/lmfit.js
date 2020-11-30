import { terser } from 'rollup-plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';

const plugins = [
    nodeResolve()
];

export default args => ({
    input: 'src/lm.webworker.js',
    output: [
        { format: 'es', preferConst: true, exports: 'auto', file: 'src/build/lm.webworker.js' }
    ],
    plugins: args.configDebug ? plugins : [...plugins, terser()]
});
