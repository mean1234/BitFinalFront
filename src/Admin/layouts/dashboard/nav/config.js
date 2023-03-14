// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: "/adminindex/app",
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: "/adminindex/user",
    icon: icon('ic_user'),
  },
  {
    title: 'Movie List',
    path: '/adminindex/products',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'blog',
  //   path: '/adminindex/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    // 관리자 store
    title: 'Store',
    path: '/adminindex/AdminStore',
    icon: icon('ic_cart'),
  }
];

export default navConfig;
