import { createRouter, createWebHashHistory } from 'vue-router';
const Index = () => import('@/views/Index/Index.jsx');
const Set = () => import('@/views/Set/Index.jsx');
const About = () => import('@/views/About/Index.jsx');

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Index,
            name: 'index',
            meta: {
                title: '首页'
            }
        },
        {
            path: '/set',
            component: Set,
            name: 'set',
            meta: {
                title: '配置'
            }
        },
        {
            path: '/about',
            component: About,
            name: 'about',
            meta: {
                title: '关于'
            }
        }
    ]
});
router.beforeEach((to, from) => {
    document.title = to.meta.title;
});
export default router;
