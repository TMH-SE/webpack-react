import React from 'react'
import SignIn from './pages/signIn'
import { MinimalLayout, MainLayout } from './layouts'
import { Editor } from './components'
import { Card, Avatar, Row, Typography } from 'antd'
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'

const { Meta } = Card

const App = () => {
  return (
    <MainLayout>
      <Typography.Title level={1}>New post</Typography.Title>
      <Editor />
      <Card
        cover={
          <img
            alt='example'
            src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
          />
        }
        style={{ maxWidth: 400, marginTop: 16 }}
        actions={[
          <SettingOutlined key='setting' />,
          <EditOutlined key='edit' />,
          <EllipsisOutlined key='ellipsis' />,
        ]}>
        <Meta
          avatar={
            <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
          }
          title='Card title'
          description='This is the description'
        />
      </Card>
      <br />
      <Card
        cover={
          <img
            alt='example'
            src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
          />
        }
        style={{ maxWidth: 450, marginTop: 16 }}
        actions={[
          <SettingOutlined key='setting' />,
          <EditOutlined key='edit' />,
          <EllipsisOutlined key='ellipsis' />,
        ]}>
        <Meta
          avatar={
            <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
          }
          title='Card title'
          description='This is the description'
        />
      </Card>
    </MainLayout>
  )
}

export default App
