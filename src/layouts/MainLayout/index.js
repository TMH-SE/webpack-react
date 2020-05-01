import React, { useState } from 'react'
import { Layout, Row, Col, Menu, Drawer } from 'antd'
import {
  UnorderedListOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { Logo } from '../../components'

const { Header, Content, Sider } = Layout

const index = ({ children }) => {
  const [isBroken, setIsBroken] = useState(false)
  const [visible, setVisible] = useState(false)
  return (
    <Layout>
      <Header style={{ boxShadow: '0 1px 8px #f0f1f2' }}>
        <Row>
          <Col
            xs={23}
            lg={5}
            xxl={4}
            style={isBroken ? { textAlign: 'center' } : {}}>
            <Logo size='medium' />
          </Col>
          <Col xs={1} lg={19} xxl={20}>
            <Menu
              style={{
                borderBottom: 'none',
                height: '64px',
                lineHeight: '60px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              overflowedIndicator={<UnorderedListOutlined />}
              mode='horizontal'>
              <Menu.Item>Menu 1</Menu.Item>
              <Menu.Item>Menu 2</Menu.Item>
              <Menu.Item>Menu 3</Menu.Item>
              <Menu.Item>Menu 4</Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Layout style={{ height: 'calc(100vh - 64px)', paddingTop: 45 }}>
        {isBroken ? (
          <div
            id='btn-trigger'
            style={{
              left: visible ? 200 : 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 70,
              height: 40,
              width: 40,
              padding: 5,
              background: '#fff',
              color: '#000',
              boxShadow: '2px 0 8px rgba(0,0,0,.2)',
              borderRadius: '0 4px 4px 0',
              zIndex: 1001,
              transition: 'all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1)',
              cursor: 'pointer',
            }}
            onClick={() => setVisible(!visible)}>
            {visible ? <CloseOutlined /> : <MenuOutlined />}
          </div>
        ) : null}
        <Sider
          breakpoint='lg'
          collapsedWidth={0}
          width={isBroken ? 0 : 200}
          onBreakpoint={(broken) => setIsBroken(broken)}
          onCollapse={(collapsed) => {
            setVisible(!collapsed)
          }}
          trigger={null}>
          {!isBroken && (
            <Menu style={{ height: '100%' }} mode='inline'>
              <Menu.Item key='mail'>
                <MailOutlined />
                Navigation One
              </Menu.Item>
              <Menu.Item key='app' disabled>
                <AppstoreOutlined />
                Navigation Two
              </Menu.Item>
              <Menu.Item key='alipay'>
                <SettingOutlined />
                Navigation Three
              </Menu.Item>
            </Menu>
          )}
        </Sider>
        <Content style={{ padding: '0 24px', width: '100%' }}>
          {children}
        </Content>
        {isBroken && (
          <Drawer
            drawerStyle={{ transition: 'all 0.2s' }}
            width={200}
            placement='left'
            closable={false}
            bodyStyle={{ padding: 0 }}
            visible={visible}
            getContainer={false}>
            <Menu mode='inline'>
              <Menu.Item key='mail'>
                <MailOutlined />
                Navigation One
              </Menu.Item>
              <Menu.Item key='app' disabled>
                <AppstoreOutlined />
                Navigation Two
              </Menu.Item>
              <Menu.Item key='alipay'>
                <SettingOutlined />
                Navigation Three
              </Menu.Item>
            </Menu>
          </Drawer>
        )}
      </Layout>
    </Layout>
  )
}

export default index
