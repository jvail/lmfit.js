import { terser } from 'rollup-plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const plugins = [
    nodeResolve(),
    copy({
        targets: [
            { src: 'src/build/lmfit.wasm', dest: 'dist' }
        ]
    })
];

export default args => ({
    input: 'src/lm.node.js',
    output: [
        { dir: 'dist', format: 'cjs', preferConst: true, exports: 'auto' }
    ],
    plugins: args.configDebug ? plugins : [...plugins, terser()]
});
