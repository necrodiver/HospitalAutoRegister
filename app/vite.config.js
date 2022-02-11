import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';

import styleImport, { AndDesignVueResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx({}),
        ViteComponents({
            customComponentResolvers: [AntDesignVueResolver()]
        }),
        styleImport({
            resolves: [AndDesignVueResolve()],
            libs: [
                {
                    libraryName: 'ant-design-vue',
                    esModule: true,
                    ensureStyleFile: true,
                    resolveStyle: name => {
                        return `ant-design-vue/es/${name}/style/index`;
                    }
                }
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    server: {
        host: 'localhost',
        port: 3000,
        open: true,
        strictPort: true,
        https: false,
        proxy: {
            '/api': {
                target: 'http://localhost:10087',
                changeOrigin: true
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    // 强制预构建插件包
    // optimizeDeps: {
    //     include: ['axios']
    // },
    build: {
        target: 'modules',
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser' // 混淆器
    }
});
