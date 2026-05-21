import { createRouter, createWebHashHistory } from 'vue-router'

const TabLayout = () => import('../layouts/TabLayout.vue')

const Home = () => import('../pages/Home.vue')
const Market = () => import('../pages/Market.vue')
const Community = () => import('../pages/Community.vue')
const Holdings = () => import('../pages/Holdings.vue')
const Account = () => import('../pages/Account.vue')

const Wallet = () => import('../pages/Wallet.vue')
const Recharge = () => import('../pages/Recharge.vue')
const Withdraw = () => import('../pages/Withdraw.vue')
const Kyc = () => import('../pages/Kyc.vue')

const OrdersList = () => import('../pages/OrdersList.vue')
const OrderDetail = () => import('../pages/OrderDetail.vue')

const ProductDetail = () => import('../pages/ProductDetail.vue')
const ResearchDetail = () => import('../pages/ResearchDetail.vue')
const ManagerDetail = () => import('../pages/ManagerDetail.vue')
const AnnouncementDetail = () => import('../pages/AnnouncementDetail.vue')

const LiveRoom = () => import('../pages/LiveRoom.vue')
const NewsDetail = () => import('../pages/NewsDetail.vue')
const DiscussThread = () => import('../pages/DiscussThread.vue')
const TraderDetail = () => import('../pages/TraderDetail.vue')
const MomentDetail = () => import('../pages/MomentDetail.vue')

const Notifications = () => import('../pages/Notifications.vue')
const Cs = () => import('../pages/Cs.vue')
const Search = () => import('../pages/Search.vue')
const Compare = () => import('../pages/Compare.vue')
const Login = () => import('../pages/Login.vue')

const AccountProfile = () => import('../pages/AccountProfile.vue')
const AccountSecurity = () => import('../pages/AccountSecurity.vue')
const AccountAddresses = () => import('../pages/AccountAddresses.vue')
const AccountDevices = () => import('../pages/AccountDevices.vue')

const InfoPage = () => import('../pages/InfoPage.vue')

const routes = [
  {
    path: '/',
    component: TabLayout,
    children: [
      { path: '', name: 'home', component: Home, meta: { tab: 'home' } },
      { path: 'market', name: 'market', component: Market, meta: { tab: 'market' } },
      { path: 'community', name: 'community', component: Community, meta: { tab: 'community' } },
      { path: 'holdings', name: 'holdings', component: Holdings, meta: { tab: 'holdings' } },
      { path: 'account', name: 'account', component: Account, meta: { tab: 'account' } },
      { path: 'wallet', name: 'wallet', component: Wallet }
    ]
  },
  { path: '/login', component: Login },
  { path: '/orders', component: OrdersList },
  { path: '/order/:id', component: OrderDetail },
  { path: '/recharge', component: Recharge },
  { path: '/withdraw', component: Withdraw },
  { path: '/kyc', component: Kyc },
  { path: '/product/:id', component: ProductDetail },
  { path: '/research/:id', component: ResearchDetail },
  { path: '/manager/:id', component: ManagerDetail },
  { path: '/announcement/:id', component: AnnouncementDetail },
  { path: '/live/:id', component: LiveRoom },
  { path: '/news/:id', component: NewsDetail },
  { path: '/discuss/:id', component: DiscussThread },
  { path: '/trader/:id', component: TraderDetail },
  { path: '/moment/:id', component: MomentDetail },
  { path: '/notifications', component: Notifications },
  { path: '/cs', component: Cs },
  { path: '/search', component: Search },
  { path: '/compare', component: Compare },
  { path: '/account/profile', component: AccountProfile },
  { path: '/account/security', component: AccountSecurity },
  { path: '/account/addresses', component: AccountAddresses },
  { path: '/account/devices', component: AccountDevices },
  { path: '/info/:slug', component: InfoPage },
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
