/* eslint-disable no-restricted-syntax */
import {
  type LucideIcon,
  CircleDollarSign,
  ClipboardList,
  ContactRound,
  Database,
  House,
  Warehouse,
  ShoppingCart,
  ChartSpline,
} from "lucide-react"

import {
  type PermissionCode,
} from "~/types/permission-code"

export interface MenuItem {
  children?: MenuItem[]
  icon?: LucideIcon
  title?: string
  url?: string
  separator?: boolean
  permissionCode?: PermissionCode | PermissionCode[]
  isSupperAdminOnly?: boolean
}

const SidebarContent: MenuItem[] = [
  {
    icon: House,
    title: "Trang chính",
    url: "/",
  },
  {
    icon: ClipboardList,
    title: "Quản lý Hoạt động",
    children: [
      {
        title: "Bảng điều khiển phòng",
        url: "/manage-rooms",
        permissionCode: "search_room_branch",
      },
      {
        title: "Quản lý phòng hát",
        children: [
          {
            title: "Danh sách phòng hát",
            url: "/rooms",
            permissionCode: "search_room_branch",
          },
          {
            title: "Danh sách tầng",
            url: "/floors",
            permissionCode: "search_floor_branch",
          },
        ],
      },
    ],
  },
  {
    icon: ShoppingCart,
    title: "Quản lý bán hàng",
    children: [
      {
        title: "Danh sách đơn hàng",
        url: "/orders",
        permissionCode: "search_order_branch",
      },
      {
        title: "Tạo đơn hàng mới",
        url: "/orders/create",
        permissionCode: "update_order_branch",
      },
      {
        title: "Quản lý khách hàng",
        children: [
          {
            title: "Danh sách khách hàng",
            url: "/customers",
            permissionCode: "search_customer",
          },
        ],
      },
      {
        title: "Dịch vụ kèm theo",
        children: [
          {
            title: "Danh sách dịch vụ",
            url: "/services",
            permissionCode: "search_product_branch",
          },
        ],

      },
      {
        title: "Phiếu giảm giá",
        url: "/coupons",
        permissionCode: "search_coupon_branch",
      },

    ],
  },
  {
    icon: ContactRound,
    title: "Nhân sự & Chấm công",
    children: [
      {
        title: "Danh sách nhân sự",
        url: "/users",
        permissionCode: "search_user_branch",
      },
      {
        title: "Chấm công",
        url: "/work-days",
        permissionCode: "search_workday_branch",
      },
      {
        title: "Lịch làm việc",
        url: "/schedules",
        permissionCode: "get_calendar_branch",
      },
      // {
      //   title: "Chấm công & lịch làm việc",
      //   children: [

      //   ],
      // },

      {
        title: "Phân ca làm việc",
        url: "/shift-users",
        permissionCode: "search_shift_user_branch",
      },
    ],
  },
  {
    icon: Warehouse,
    title: "Quản lý kho",
    children: [
      {
        title: "Danh sách sản phẩm",
        url: "/products",
        permissionCode: "search_product_branch",
      },
      {
        title: "Nhà cung cấp",
        url: "/distributors",
        permissionCode: "search_distributor_branch",
      },
      {
        title: "Danh sách nhập kho",
        url: "/product-imports",
        permissionCode: "search_product_import_branch",
      },
      {
        title: "Danh sách xuất kho",
        url: "/product-exports",
        permissionCode: "search_product_export_branch",
      },
      {
        title: "Danh sách tồn kho",
        url: "/report-inventory",
        permissionCode: "search_report_branch",
      },
      {
        title: "Kiểm kê",
        url: "/inventory",
        permissionCode: "search_inventory_branch",
      },
    ],
  },
  {
    icon: CircleDollarSign,
    title: "Quản lý tài chính",
    children: [
      {
        title: "Quản lý khoản thu chi",
        url: "/bills",
        permissionCode: "search_bill_branch",
      },
    ],
  },
  {
    icon: ChartSpline,
    title: "Báo cáo",
    children: [
      {
        title: "Báo cáo đơn hàng",
        url: "/order-report",
        permissionCode: "report_branch",
      },
      {
        title: "Báo cáo hiệu suất & doanh thu",
        url: "/sales-report",
        permissionCode: "report_branch",
      },
      {
        title: "Phân tích xu hướng kinh doanh",
        url: "/sales-trend-analytics",
        permissionCode: "report_branch",
      },
    ],
  },
  {
    icon: Database,
    title: "Cấu hình",
    children: [
      {
        title: "Thông tin chi nhánh",
        url: "/branch",
        permissionCode: "update_branch",
      },
      {
        title: "Lập lịch làm việc",
        url: "/shift-timelines",
        permissionCode: "update_shift_timeline_branch",
      },
      {
        title: "Cấu hình dữ liệu",
        children: [
          {
            title: "Danh mục sản phẩm",
            url: "/product-categories",
            permissionCode: "search_category_product_branch",
          },
          {
            title: "Viet QR",
            url: "/viet-qr",
            permissionCode: [
              "search_viet_qr",
              "search_viet_qr_branch",
            ],
          },
        ],
      },
    ],
  },
]

export default SidebarContent
