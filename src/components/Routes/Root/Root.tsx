import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { SearchOutlined, ContactsOutlined } from "@ant-design/icons";
import { CreateHistory, List as ListPatient } from "@/components";
import Menu, { MenuProps } from "antd/es/menu";
import { Layout, Image, Space } from "antd";
import { useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import styles from "./Root.scss";

const { Header, Content, Sider } = Layout;

export function Root() {
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<BreadcrumbItemType>>([
    { title: "Dashboard" },
  ]);

  let location = useLocation();

  useMemo(() => {
    setBreadcrumbs(
      location.pathname
        .slice(1)
        .split("/")
        .map((item) => {
          return {
            title: item,
          };
        })
    );
  }, [location]);

  const onMenuClick = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  const items: MenuProps["items"] = [
    {
      label: "Create History",
      key: "patient/history/create",
      icon: <ContactsOutlined />,
      onClick: onMenuClick,
    },
    {
      label: "Patient List",
      key: "patient/list",
      icon: <ContactsOutlined />,
      onClick: onMenuClick,
    },
  ];

  return (
    <Layout className="_app-layout">
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Space className="_app-layout-sider-logo">
          <Link
            to="/"
            onClick={() => {
              setBreadcrumbs([{ title: "Dashboard" }]);
            }}
          >
            <Image width={80} src={logo} preview={false} />
          </Link>
        </Space>
        <Menu mode="inline" items={items} />
      </Sider>
      <Layout className="_app-layout">
        <Header>
          <Breadcrumb items={breadcrumbs}></Breadcrumb>
        </Header>
        <Content className="_app-layout-content">
          <Routes>
            <Route path="/" Component={Welcome}></Route>
            <Route
              path="/patient/history/create"
              Component={CreateHistory}
            ></Route>
            <Route path="/patient/list" Component={ListPatient}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function Welcome() {
  return <>Welcome</>;
}
