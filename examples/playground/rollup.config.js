import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default _ => ({
    input: 'src/playground.js',
    output: [
        {
            file: 'index.js',
            format: 'es',
            exports: 'auto'
        }
    ],
    plugins: [
        nodeResolve(),
        terser()
    ]
});
