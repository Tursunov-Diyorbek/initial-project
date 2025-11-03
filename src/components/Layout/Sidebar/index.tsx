import { Layout, Menu } from "antd";
import { protected_routes } from "../../../routes/routes";
import { Link } from "react-router-dom";
import type { MenuItemType } from "antd/es/menu/interface";

const { Sider } = Layout;

export default function Sidebar({ burger }: any) {
  const role = localStorage.getItem("role") ?? "";
  const items = () => {
    const _items: MenuItemType[] = [];
    protected_routes?.forEach((e) => {
      if (
        e.config?.isMenu &&
        e.config.permission === "unlock" &&
        e.config.structure === "layout" &&
        ((e.config.isRole && e.config.isRole?.includes(role)) ||
          !e.config.isRole)
      ) {
        _items.push({
          key: e.path,
          icon: e.config.icon ?? undefined,
          label: <Link to={e.path}>{e.name}</Link>,
        });
      }
    });

    return _items;
  };

  return (
    <Sider trigger={null} collapsible collapsed={burger} className="vh-100">
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items()}
      />
    </Sider>
  );
}
