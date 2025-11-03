import { type Dispatch, type SetStateAction, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout as AntLayout, theme } from 'antd';
import Sidebar from './Sidebar';

const { Content, Header } = AntLayout;

interface HeaderSidebarContentProps {
    burger?: boolean;
    toggleCollapsed?: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}

const Layout = ({ children }: HeaderSidebarContentProps) => {
    const [burger, setBurger] = useState<boolean>(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <AntLayout>
            <Sidebar burger={burger} />
            <AntLayout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={burger ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setBurger(!burger)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div>
                        {children}
                    </div>
                </Content>
            </AntLayout>
        </AntLayout>
    )
}

export default Layout;
