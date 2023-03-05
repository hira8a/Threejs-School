import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/home/index.vue'),
        redirect: '/qitou',
        meta: { hidden: true },
        children: [
            {
                path: '/gallery',
                component: () => import('@/views/gallery/index.vue'),
                meta: { hidden: true },
            },
            {
                path: '/qitou',
                component: () => import('@/views/qitou/index.vue'),
                meta: { hidden: true },
            },
            {
                path: '/test',
                component: () => import('@/views/test/index.vue'),
                meta: { hidden: true },
            },
            {
                path: '/ttk',
                component: () => import('@/views/t1/index.vue'),
                meta: { hidden: true },
            },
        ]
    },
    
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes as RouteRecordRaw[],
    // // 刷新时，滚动条位置还原
    // scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;