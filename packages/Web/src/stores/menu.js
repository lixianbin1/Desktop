import Message from '~icons/carbon/send-alt'
import Book from '~icons/carbon/notebook-reference'
import Collect from '~icons/carbon/star'
import Staging from '~icons/carbon/volume-block-storage'

console.log(Message)

// 公共页面
const common = [
  {
    index: '/PageOne',
    icon: Message,
    title: 'menu.PageOne',
  },
]

// user权限
export const userList = [
  ...common,
]

// admin权限
export const adminList = [
  ...common,
  {
    index: '/PageTwo',
    icon: Book,
    title: 'menu.PageTwo',
    children: [
      {
        index: '/PageTwo',
        title: 'menu.PageTwo',
      },
      {
        index: '/PageTwo/info',
        title: 'menu.PageTwoInfo',
      },
    ],
  },
]